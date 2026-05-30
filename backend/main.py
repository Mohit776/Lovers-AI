from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.opportunity import router as opportunity_router
from api.admin import router as admin_router
from api.search import router as search_router
from api.applications import router as application_router

app = FastAPI(title="Lovers AI - Opportunity Tracker")

import os

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    opportunity_router,
    prefix="/opportunities",
    tags=["Opportunities"]
)

app.include_router(
    admin_router,
    prefix="/admin",
    tags=["Admin"]
)

app.include_router(
    search_router,
    prefix="/search",
    tags=["Search"]
)

app.include_router(
    application_router,
    prefix="/applications",
    tags=["Applications"]
)


@app.get("/")
def root():
    return {"status": "ok", "message": "Lovers AI backend is running"}