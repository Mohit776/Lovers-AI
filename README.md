# Lovers AI 💕

An AI-powered opportunity tracker — find scholarships, fellowships, grants, and internships tailored for you.

## Project Structure

```
Lovers-AI/
├── backend/          # FastAPI Python backend
└── frontend-next/    # Next.js 15 frontend (Turbopack)
```

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1   # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend-next
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

## Environment Variables

Create `frontend-next/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python, PostgreSQL
- **AI**: Opportunity matching & search
