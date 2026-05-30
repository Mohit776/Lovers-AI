from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from services.application_service import ApplicationService

router = APIRouter()


class ApplicationCreate(BaseModel):
    opportunity_id: str
    notes: Optional[str] = None
    user_email: Optional[str] = "anonymous@loversai.app"


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


@router.get("/")
def get_all():
    return ApplicationService.get_all()


@router.post("/")
def create(data: ApplicationCreate):
    return ApplicationService.create(data.model_dump())


@router.patch("/{application_id}")
def update(application_id: str, data: ApplicationUpdate):
    return ApplicationService.update(
        application_id,
        {k: v for k, v in data.model_dump().items() if v is not None}
    )