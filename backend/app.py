"""
Process Station Dashboard — Backend API
========================================
FastAPI service for the Siemens MMS Process Station academic dashboard.
Runs as a Hugging Face Space (Docker SDK) and persists learners + quiz results.

Database
--------
Set DATABASE_URL to use Postgres (e.g. free Neon):
    postgresql://user:pass@host/dbname?sslmode=require
If DATABASE_URL is unset it falls back to a local SQLite file (dev only) at
$DB_PATH (default ./dashboard.db). The same SQLAlchemy code runs on both.

Endpoints
---------
GET  /                      -> health / info
POST /api/login            -> {name, email}                 store/update a learner
POST /api/quiz             -> {email, page, answers, score, total}  per-page result
POST /api/submit           -> {email, results, score, total} final aggregated result
GET  /api/results          -> all submissions (simple admin view)
GET  /api/results/{email}  -> submissions for one learner
"""

import json
import os
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    MetaData,
    String,
    Table,
    Text,
    create_engine,
    select,
)

# --------------------------------------------------------------------------- #
# Engine / schema
# --------------------------------------------------------------------------- #

def _database_url() -> str:
    url = os.environ.get("DATABASE_URL", "").strip()
    if url:
        # Neon/Heroku style "postgres://" -> SQLAlchemy "postgresql://"
        if url.startswith("postgres://"):
            url = "postgresql://" + url[len("postgres://") :]
        return url
    # local dev fallback
    db_path = os.environ.get("DB_PATH", "dashboard.db")
    folder = os.path.dirname(db_path)
    if folder:
        os.makedirs(folder, exist_ok=True)
    return f"sqlite:///{db_path}"


DB_URL = _database_url()
IS_SQLITE = DB_URL.startswith("sqlite")

engine = create_engine(
    DB_URL,
    pool_pre_ping=True,          # survive Neon idle-connection drops
    pool_recycle=300,
    connect_args={"check_same_thread": False} if IS_SQLITE else {},
)

metadata = MetaData()

users = Table(
    "users", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(120), nullable=False),
    Column("email", String(255), nullable=False, unique=True, index=True),
    Column("created_at", DateTime(timezone=True), nullable=False),
    Column("last_seen", DateTime(timezone=True), nullable=False),
)

quiz_results = Table(
    "quiz_results", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("email", String(255), nullable=False, index=True),
    Column("page", String(64), nullable=False),
    Column("answers", Text, nullable=False),
    Column("score", Integer, nullable=False),
    Column("total", Integer, nullable=False),
    Column("created_at", DateTime(timezone=True), nullable=False),
)

submissions = Table(
    "submissions", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("email", String(255), nullable=False, index=True),
    Column("name", String(120)),
    Column("results", Text, nullable=False),
    Column("score", Integer, nullable=False),
    Column("total", Integer, nullable=False),
    Column("created_at", DateTime(timezone=True), nullable=False),
)


def now() -> datetime:
    return datetime.now(timezone.utc)


# --------------------------------------------------------------------------- #
# Schemas
# --------------------------------------------------------------------------- #

class LoginIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr


class QuizIn(BaseModel):
    email: EmailStr
    page: str
    answers: Any = None
    score: int = 0
    total: int = 0


class SubmitIn(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    results: Any = None
    score: int = 0
    total: int = 0


# --------------------------------------------------------------------------- #
# App
# --------------------------------------------------------------------------- #

app = FastAPI(title="Process Station Dashboard API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # teaching tool; restrict if needed
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup() -> None:
    metadata.create_all(engine)


@app.get("/")
def root():
    return {
        "service": "Process Station Dashboard API",
        "status": "ok",
        "db": "postgres" if not IS_SQLITE else "sqlite",
        "endpoints": ["/api/login", "/api/quiz", "/api/submit", "/api/results"],
    }


@app.post("/api/login")
def login(body: LoginIn):
    ts = now()
    with engine.begin() as conn:
        existing = conn.execute(
            select(users.c.id).where(users.c.email == body.email)
        ).first()
        if existing:
            conn.execute(
                users.update()
                .where(users.c.email == body.email)
                .values(name=body.name, last_seen=ts)
            )
            uid = existing[0]
        else:
            res = conn.execute(
                users.insert().values(
                    name=body.name, email=body.email, created_at=ts, last_seen=ts
                )
            )
            uid = res.inserted_primary_key[0]
    return {"ok": True, "id": uid, "name": body.name, "email": body.email}


@app.post("/api/quiz")
def save_quiz(body: QuizIn):
    with engine.begin() as conn:
        conn.execute(
            quiz_results.insert().values(
                email=body.email,
                page=body.page,
                answers=json.dumps(body.answers),
                score=body.score,
                total=body.total,
                created_at=now(),
            )
        )
    return {"ok": True}


@app.post("/api/submit")
def submit(body: SubmitIn):
    with engine.begin() as conn:
        name = body.name
        if name is None:
            row = conn.execute(
                select(users.c.name).where(users.c.email == body.email)
            ).first()
            name = row[0] if row else None
        conn.execute(
            submissions.insert().values(
                email=body.email,
                name=name,
                results=json.dumps(body.results),
                score=body.score,
                total=body.total,
                created_at=now(),
            )
        )
    return {"ok": True, "score": body.score, "total": body.total}


@app.get("/api/results")
def all_results(limit: int = 200):
    with engine.connect() as conn:
        rows = conn.execute(
            select(
                submissions.c.email,
                submissions.c.name,
                submissions.c.score,
                submissions.c.total,
                submissions.c.created_at,
            )
            .order_by(submissions.c.id.desc())
            .limit(limit)
        ).mappings().all()
    return {"count": len(rows), "submissions": [dict(r) for r in rows]}


@app.get("/api/results/{email}")
def results_for(email: str):
    with engine.connect() as conn:
        per_page = conn.execute(
            select(
                quiz_results.c.page,
                quiz_results.c.score,
                quiz_results.c.total,
                quiz_results.c.created_at,
            )
            .where(quiz_results.c.email == email)
            .order_by(quiz_results.c.id.desc())
        ).mappings().all()
        finals = conn.execute(
            select(
                submissions.c.results,
                submissions.c.score,
                submissions.c.total,
                submissions.c.created_at,
            )
            .where(submissions.c.email == email)
            .order_by(submissions.c.id.desc())
        ).mappings().all()
    if not per_page and not finals:
        raise HTTPException(status_code=404, detail="No results for that email")
    return {
        "email": email,
        "per_page": [dict(r) for r in per_page],
        "final": [{**dict(r), "results": json.loads(r["results"])} for r in finals],
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "7860"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
