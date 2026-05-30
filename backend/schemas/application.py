from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    user_email: str
    opportunity_id: str


class ApplicationUpdate(BaseModel):
    status: str
    notes: str | None = None
    priority: int | None = None