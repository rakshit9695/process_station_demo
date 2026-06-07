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

## Deploy

- **Backend → Hugging Face Spaces (Docker):** see `backend/README.md`. Upload the
  `backend/` folder; the Space serves on port 7860. Copy the Space URL into
  `frontend/.env.local` as `NEXT_PUBLIC_API_BASE`.
- **Frontend → Vercel / Netlify / static host:** `npm run build`. Set the same
  `NEXT_PUBLIC_API_BASE` env var to your Space URL.

The frontend degrades gracefully: if the backend is offline, learning continues
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
