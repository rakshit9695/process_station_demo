# Process Station — Academic Dashboard (Siemens MMS04)

An interactive, black-&-white teaching dashboard for the Siemens MMS **Process
Station** (mock drilling + pick-&-place on a rotary indexing table). Built as the
beta for an AR/VR product.

> **Stack:** Next.js (React) frontend · FastAPI + SQLite backend (Hugging Face
> Spaces ready). Free, zero-config database.

## What's inside

| Page | What it does |
|------|--------------|
| **Login** | Captures name + email, stored in the backend; gates the dashboard. |
| **Introduction** | Hero photo + animated high-level flowchart; the station's role in the MMS line. |
| **Physics** | First principles in causal order — Pneumatics → Mechanics → Electronics → Electrical — with worked numbers. |
| **Step & Pneumatic** | One transport drives a synced **step-displacement chart** + **electro-pneumatic schematic** simulation. |
| **Function Chart** | The SFC overview + component cards, each opening an in-depth physics deep-dive. |
| **PLC & Ladder** | 3D S7-1200 model + live 2D I/O panel + ladder logic, all stepping through the real IO list / system steps. |
| **Results** | Score ring + per-page breakdown; submits all quiz results to the backend. |

Every content page carries 1–2 quiz questions; answers persist locally and are
saved to the backend (per page and as a final submission).

## Run locally

**1 — Backend** (http://localhost:7860)
```bash
cd backend
python -m venv .venv && .venv\Scripts\activate     # Windows
pip install -r requirements.txt
python app.py
```

**2 — Frontend** (http://localhost:3000)
```bash
cd frontend
npm install
npm run dev
```
`frontend/.env.local` already points `NEXT_PUBLIC_API_BASE` at the local backend.

## Deploy (Neon Postgres → Hugging Face → Vercel)

Do these in order — each step produces a value the next one needs.

### 1 — Database: Neon (free Postgres)
1. Sign up at https://neon.tech → **New Project**.
2. Copy the **pooled** connection string (Dashboard → Connect). It looks like:
   `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`
3. Keep it for step 2.

### 2 — Backend: Hugging Face Space (Docker)
1. https://huggingface.co/new-space → SDK **Docker**, name e.g. `process-station-api`.
2. Upload the contents of the `backend/` folder (`app.py`, `Dockerfile`,
   `requirements.txt`, `README.md`) — drag-and-drop in the Space's **Files** tab,
   or `git push` to the Space repo.
3. Space **Settings → Variables and secrets → New secret**:
   `DATABASE_URL` = the Neon string from step 1.
4. The Space builds and serves at
   `https://<username>-process-station-api.hf.space`. Visit `/` to confirm
   `"db": "postgres"`.

### 3 — Frontend: Vercel
1. https://vercel.com → **Add New → Project** → import the GitHub repo.
2. **Root Directory: `frontend`** (important — the Next.js app lives there).
3. **Environment Variables:** `NEXT_PUBLIC_API_BASE` = your HF Space URL
   (from step 2). It's a build-time var, so set it *before* deploying.
4. Deploy. (If you change the env var later, redeploy to rebuild.)

CORS is open on the backend, so the Vercel domain works out of the box. The
frontend also degrades gracefully: if the backend is offline, learning continues
and results are kept locally on the device.

## Project layout

```
dashboard_process_station/
├─ frontend/            Next.js app (App Router)
│  ├─ app/              routes: login + (dashboard) group
│  ├─ components/       Sidebar, Quiz, Transport, charts, 3D, ladder, panel
│  ├─ lib/              data.js (IO list/steps), sim.js, sfc.js, quizzes, store, api
│  └─ public/img/       source photos used in the UI
├─ backend/             FastAPI + SQLite (Hugging Face Space)
└─ sources/             original workbook images (the spec)
```

## Data provenance

All technical content (`frontend/lib/data.js`) is transcribed from the instructor
workbook images in `sources/main/` — Table of Components (§10), IO List (§17) and
System Steps (§19). The 17-step operating sequence is a cleaned, pedagogically
consistent version of the worksheet sequence.

## Roadmap

- **AR Setup** — the augmented-reality walkthrough (next phase, per the brief).
