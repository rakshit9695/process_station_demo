---
title: Process Station API
emoji: 🏭
colorFrom: gray
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# Process Station Dashboard — Backend API

FastAPI + SQLite service that stores dashboard **logins** and **quiz results**
for the Siemens MMS Process Station academic dashboard.

## Run locally

```bash
cd backend
pip install -r requirements.txt
python app.py            # serves on http://localhost:7860
```

## Deploy to Hugging Face Spaces (free)

1. Create a new **Space** → SDK: **Docker**.
2. Upload the contents of this `backend/` folder (`app.py`, `Dockerfile`,
   `requirements.txt`, `README.md`). The YAML header above configures the Space.
3. (Optional, for durable storage) In **Settings → Persistent storage**, add a
   free disk and it will mount at `/data`, where `dashboard.db` lives.
4. Your API base URL will be `https://<username>-<space-name>.hf.space`.
   Put that into the frontend's `.env.local` as `NEXT_PUBLIC_API_BASE`.

## Endpoints

| Method | Path                  | Purpose                              |
|--------|-----------------------|--------------------------------------|
| GET    | `/`                   | Health / info                        |
| POST   | `/api/login`          | `{name, email}` — store learner      |
| POST   | `/api/quiz`           | per-page quiz result                 |
| POST   | `/api/submit`         | final aggregated result              |
| GET    | `/api/results`        | all submissions (admin)              |
| GET    | `/api/results/{email}`| results for one learner              |

## Database

SQLite (`dashboard.db`) — zero-config and free. Tables: `users`,
`quiz_results`, `submissions`. To swap to Postgres (e.g. free Supabase),
replace the `get_db()` helper in `app.py`.
