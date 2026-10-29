from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class FdrSubmissionCreate(BaseModel):
    instrument_number: str = Field(..., min_length=1, max_length=100)
    bank_name: str = Field(..., min_length=1, max_length=200)
    branch: str = Field(..., min_length=1, max_length=200)
    ifsc: str = Field(..., pattern=r"^[A-Z]{4}0[A-Z0-9]{6}$", max_length=11)
    amount_paise: int = Field(..., gt=0)
    issue_date: date
    maturity_date: date
    tenure_months: int = Field(..., ge=1, le=600)
    programme: str = Field(..., min_length=1, max_length=30)
    ocr_fields: dict[str, Optional[str]] = Field(default_factory=dict)


class StoredDocumentResponse(BaseModel):
    id: str
    file_name: str
    mime_type: str
    size_bytes: int
    sha256: str
    ocr_status: str
    uploaded_at: datetime
    download_url: str


class StoredInstrumentResponse(BaseModel):
    id: str
    institution_id: str
    institution_name: str
    instrument_number: str
    bank_name: str
    branch: str
    ifsc: str
    amount_paise: int
    issue_date: date
    maturity_date: date
    status: str
    verification_status: str
    created_at: datetime
    documents: list[StoredDocumentResponse]


class SubmissionResponse(BaseModel):
    instrument_id: str
    document_id: str
    status: str
    message: str
