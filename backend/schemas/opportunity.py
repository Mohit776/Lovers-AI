from pydantic import BaseModel
from datetime import date
from typing import Optional


class OpportunityCreate(BaseModel):
    title: str

    organization: Optional[str] = None

    country: Optional[str] = None

    deadline: Optional[date] = None

    category: Optional[str] = None

    description: Optional[str] = None

    source_url: str


class OpportunityResponse(OpportunityCreate):
    id: str

    class Config:
        from_attributes = True