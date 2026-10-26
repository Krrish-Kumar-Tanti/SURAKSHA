from pydantic import BaseModel, Field, UUID4
from typing import Optional
from datetime import datetime


class ProgrammeCreate(BaseModel):
    institution_id: UUID4 = Field(..., description="Institution UUID")
    programme: str = Field(..., description="ENGINEERING/PLANNING/APPLIED_ARTS/DESIGN/HMCT/COMPUTER_APPLICATIONS/MANAGEMENT")
    level: str = Field(..., description="DIPLOMA/UG/PG")
    approved_intake: int = Field(default=0, ge=0, description="Approved intake capacity")
    active: bool = Field(default=True, description="Whether the programme is active")


class ProgrammeUpdate(BaseModel):
    approved_intake: Optional[int] = Field(None, ge=0)
    active: Optional[bool] = Field(None)


class ProgrammeResponse(BaseModel):
    id: str
    institution_id: str
    programme: str
    level: str
    approved_intake: int
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True