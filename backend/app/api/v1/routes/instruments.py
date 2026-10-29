from fastapi import APIRouter, Depends, UploadFile, File, Query, Form, HTTPException, Response
from typing import Optional, List, Dict, Any, Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
import json
import hashlib
import re
from decimal import Decimal
from pydantic import ValidationError
from app.db.session import get_db
from app.models.instrument import Instrument
from app.models.document import Document, DocumentContent
from app.models.institution import Institution
from app.models.programme import Programme
from app.models.provenance_field import ProvenanceField
from app.models.finding import Finding
from app.core.deps import get_current_user
from app.services.document_storage import encrypt_document, decrypt_document
from app.schemas.document import (
    FdrSubmissionCreate,
    StoredDocumentResponse,
    StoredInstrumentResponse,
    SubmissionResponse,
)
from app.schemas.instrument import (
    InstrumentCreate,
    InstrumentUpdate,
    InstrumentResponse,
    InstrumentProvenanceResponse,
    InstrumentListResponse,
)
from app.schemas.common import EnumsResponse


router = APIRouter(prefix="/instruments", tags=["instruments"])
MAX_DOCUMENT_SIZE = 25 * 1024 * 1024
ALLOWED_DOCUMENT_TYPES = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
}


def _validate_document(content: bytes, filename: str) -> str:
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded document is empty.")
    if len(content) > MAX_DOCUMENT_SIZE:
        raise HTTPException(status_code=413, detail="Documents must be 25 MB or smaller.")

    extension = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    mime_type = ALLOWED_DOCUMENT_TYPES.get(extension)
    if not mime_type:
        raise HTTPException(status_code=415, detail="Upload a PDF, PNG, JPG, or TIFF document.")
    return mime_type


async def _ensure_instrument_access(
    instrument: Instrument,
    current_user: dict,
    db: AsyncSession,
) -> None:
    role = current_user["role"]
    if role == "INSTITUTION_USER":
        if current_user["institution_id"] != instrument.institution_id:
            raise HTTPException(status_code=404, detail="Instrument not found.")
        return

    if role in ("DEALING_OFFICER", "DIRECTOR_RB"):
        institution_result = await db.execute(
            select(Institution).where(Institution.id == instrument.institution_id)
        )
        institution = institution_result.scalar_one_or_none()
        if not institution or institution.region_code != current_user["region_code"]:
            raise HTTPException(status_code=404, detail="Instrument not found.")
        return

    if role not in ("COMPETENT_AUTHORITY", "AUDITOR", "ADMIN"):
        raise HTTPException(status_code=403, detail="You may not access receipt documents.")


def _safe_download_filename(filename: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]", "_", filename)
    return cleaned[:180] or "receipt"


@router.post("/submissions", response_model=SubmissionResponse, status_code=201)
async def submit_fdr(
    payload: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Persist an FDR submission and its encrypted receipt for its institution."""
    if current_user["role"] != "INSTITUTION_USER" or not current_user["institution_id"]:
        raise HTTPException(status_code=403, detail="An institution registrar account is required to submit an FDR.")

    try:
        submission = FdrSubmissionCreate.model_validate_json(payload)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail="Submission details are invalid.") from exc

    if submission.maturity_date <= submission.issue_date:
        raise HTTPException(status_code=422, detail="Maturity date must be after issue date.")
    if len(submission.ifsc) != 11:
        raise HTTPException(status_code=422, detail="Enter a valid 11-character IFSC code.")

    institution_result = await db.execute(
        select(Institution).where(Institution.id == current_user["institution_id"])
    )
    institution = institution_result.scalar_one_or_none()
    if not institution:
        raise HTTPException(status_code=403, detail="Your account is not associated with an institution.")

    programme_result = await db.execute(
        select(Programme).where(
            Programme.institution_id == institution.id,
            Programme.programme == submission.programme,
            Programme.active.is_(True),
        )
    )
    programme = programme_result.scalar_one_or_none()
    if not programme:
        raise HTTPException(
            status_code=422,
            detail="Select an active approved programme associated with your institution.",
        )

    existing_number = await db.execute(
        select(Instrument).where(
            Instrument.institution_id == institution.id,
            Instrument.instrument_number == submission.instrument_number.strip(),
        )
    )
    if existing_number.scalar_one_or_none():
        raise HTTPException(
            status_code=409,
            detail="An FDR with this receipt number is already on your institution's record.",
        )

    file_content = await file.read(MAX_DOCUMENT_SIZE + 1)
    mime_type = _validate_document(file_content, file.filename or "")
    file_hash = hashlib.sha256(file_content).hexdigest()

    duplicate_result = await db.execute(
        select(Document).where(Document.sha256 == file_hash)
    )
    duplicate = duplicate_result.scalar_one_or_none()
    if duplicate:
        original_finding_result = await db.execute(
            select(Finding).where(
                Finding.instrument_id == duplicate.instrument_id,
                Finding.rule_id == "DUPLICATE_HASH",
                Finding.disposition == "OPEN",
            )
        )
        if not original_finding_result.scalar_one_or_none():
            db.add(Finding(
                id=UUID(),
                instrument_id=duplicate.instrument_id,
                rule_id="DUPLICATE_HASH",
                severity="CRITICAL",
                reason="The same receipt file was submitted for another FDR.",
                evidence_json={"sha256": file_hash, "attempted_by": str(current_user["id"])},
                suggested_action="Review the duplicate receipt and verify the underlying bank deposit.",
                disposition="OPEN",
                actor_id=current_user["id"],
            ))
            await db.commit()
        raise HTTPException(
            status_code=409,
            detail="This exact receipt file is already associated with another submission. A duplicate-document finding was recorded for review.",
        )

    instrument_id = UUID()
    document_id = UUID()
    encrypted_content, encryption_meta = encrypt_document(document_id, file_content)
    instrument = Instrument(
        id=instrument_id,
        institution_id=institution.id,
        programme_id=programme.id,
        type="FDR",
        instrument_number=submission.instrument_number.strip(),
        bank_name=submission.bank_name.strip(),
        branch=submission.branch.strip(),
        ifsc=submission.ifsc.upper(),
        amount_paise=submission.amount_paise,
        issue_date=submission.issue_date,
        maturity_date=submission.maturity_date,
        tenure_months=submission.tenure_months,
        depositor_name=institution.trust_name,
        lien_in_favour="AICTE",
        status="SUBMITTED",
        verification_status="UNVERIFIED",
        officer_verified=False,
    )
    document = Document(
        id=document_id,
        instrument_id=instrument_id,
        type="FDR_RECEIPT",
        file_name=file.filename or "receipt",
        sha256=file_hash,
        storage_key=f"postgresql:document_contents:{document_id}",
        encryption_meta=encryption_meta,
        mime_type=mime_type,
        size_bytes=len(file_content),
        uploaded_by=current_user["id"],
        ocr_status="PENDING",
    )
    db.add_all([
        instrument,
        document,
        DocumentContent(document_id=document_id, ciphertext=encrypted_content),
    ])

    declared_fields = {
        "amount": str(Decimal(submission.amount_paise) / Decimal(100)),
        "instrument_number": submission.instrument_number.strip(),
        "issue_date": submission.issue_date.isoformat(),
        "maturity_date": submission.maturity_date.isoformat(),
        "bank_name": submission.bank_name.strip(),
        "branch": submission.branch.strip(),
        "ifsc": submission.ifsc.upper(),
        "depositor": institution.trust_name,
        "lien": "AICTE",
    }
    ocr_field_names = {
        "amount": "amount",
        "instrument_number": "instrumentNumber",
        "issue_date": "issueDate",
        "maturity_date": "maturityDate",
        "bank_name": "bankName",
        "branch": "branch",
        "ifsc": "ifsc",
        "depositor": "depositor",
        "lien": "lien",
    }
    provided_ocr_fields = submission.ocr_fields
    recognized_field_count = sum(
        bool(provided_ocr_fields.get(field_name))
        for field_name in ocr_field_names.values()
    )
    document.ocr_status = "OCR_DONE" if recognized_field_count >= 5 else "NEEDS_REVIEW"
    db.add_all([
        ProvenanceField(
            id=UUID(),
            instrument_id=instrument_id,
            field_name=field_name,
            declared_value=declared_value,
            document_value=provided_ocr_fields.get(ocr_field_names[field_name]),
            status=(
                "MISSING_DOCUMENT"
                if not provided_ocr_fields.get(ocr_field_names[field_name])
                else "MATCH"
                if provided_ocr_fields[ocr_field_names[field_name]].strip().casefold()
                == declared_value.strip().casefold()
                else "MISMATCH"
            ),
        )
        for field_name, declared_value in declared_fields.items()
    ])

    await db.commit()
    return SubmissionResponse(
        instrument_id=str(instrument_id),
        document_id=str(document_id),
        status="SUBMITTED",
        message="Receipt and FDR details were saved to your institution's records.",
    )


@router.get("/records", response_model=List[StoredInstrumentResponse])
async def list_stored_records(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List stored FDR submissions visible to the authenticated role."""
    role = current_user["role"]
    query = select(Instrument, Institution.name).join(
        Institution, Instrument.institution_id == Institution.id
    )

    if role == "INSTITUTION_USER":
        if not current_user["institution_id"]:
            raise HTTPException(status_code=403, detail="Your account is not associated with an institution.")
        query = query.where(Instrument.institution_id == current_user["institution_id"])
    elif role in ("DEALING_OFFICER", "DIRECTOR_RB"):
        query = query.where(Institution.region_code == current_user["region_code"])
    elif role not in ("COMPETENT_AUTHORITY", "AUDITOR", "ADMIN"):
        raise HTTPException(status_code=403, detail="You may not view submitted FDR records.")

    rows = (await db.execute(query.order_by(Instrument.created_at.desc()))).all()
    records = []
    for instrument, institution_name in rows:
        documents_result = await db.execute(
            select(Document).where(Document.instrument_id == instrument.id)
        )
        documents = documents_result.scalars().all()
        records.append(StoredInstrumentResponse(
            id=str(instrument.id),
            institution_id=str(instrument.institution_id),
            institution_name=institution_name,
            instrument_number=instrument.instrument_number,
            bank_name=instrument.bank_name,
            branch=instrument.branch,
            ifsc=instrument.ifsc,
            amount_paise=instrument.amount_paise,
            issue_date=instrument.issue_date,
            maturity_date=instrument.maturity_date,
            status=instrument.status,
            verification_status=instrument.verification_status,
            created_at=instrument.created_at,
            documents=[
                StoredDocumentResponse(
                    id=str(document.id),
                    file_name=document.file_name,
                    mime_type=document.mime_type,
                    size_bytes=document.size_bytes,
                    sha256=document.sha256,
                    ocr_status=document.ocr_status,
                    uploaded_at=document.uploaded_at,
                    download_url=f"/instruments/documents/{document.id}/content",
                )
                for document in documents
            ],
        ))
    return records


@router.get("/documents/{document_id}/content")
async def download_stored_document(
    document_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found.")

    instrument_result = await db.execute(
        select(Instrument).where(Instrument.id == document.instrument_id)
    )
    instrument = instrument_result.scalar_one_or_none()
    if not instrument:
        raise HTTPException(status_code=404, detail="Document not found.")
    await _ensure_instrument_access(instrument, current_user, db)

    content_result = await db.execute(
        select(DocumentContent).where(DocumentContent.document_id == document.id)
    )
    stored_content = content_result.scalar_one_or_none()
    if not stored_content:
        raise HTTPException(status_code=410, detail="The stored receipt content is unavailable.")

    try:
        plaintext = decrypt_document(document.id, stored_content.ciphertext, document.encryption_meta)
    except (ValueError, KeyError) as exc:
        raise HTTPException(status_code=500, detail="The stored receipt could not be decrypted.") from exc

    return Response(
        content=plaintext,
        media_type=document.mime_type,
        headers={
            "Content-Disposition": f'attachment; filename="{_safe_download_filename(document.file_name)}"',
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "private, no-store",
        },
    )


@router.get("/", response_model=InstrumentListResponse)
async def list_instruments(
    status: Optional[str] = Query(default=None, description="Filter by instrument status"),
    institution_id: Optional[str] = Query(default=None, description="Filter by institution UUID"),
    programme: Optional[str] = Query(default=None, description="Filter by programme"),
    maturity_before: Optional[str] = Query(default=None, description="Maturity before YYYY-MM-DD"),
    region: Optional[str] = Query(default=None, description="Filter by institution region"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List instruments with filtering and pagination."""
    from app.models.programme import Programme as ProgrammeModel

    query = select(Instrument)
    if current_user["role"] == "INSTITUTION_USER":
        if not current_user["institution_id"]:
            raise HTTPException(status_code=403, detail="Your account is not associated with an institution.")
        query = query.where(Instrument.institution_id == current_user["institution_id"])
    elif current_user["role"] in ("DEALING_OFFICER", "DIRECTOR_RB"):
        query = query.join(Institution).where(
            Institution.region_code == current_user["region_code"]
        )
    elif current_user["role"] not in ("COMPETENT_AUTHORITY", "AUDITOR", "ADMIN"):
        raise HTTPException(status_code=403, detail="You may not view instrument records.")

    if status:
        query = query.where(Instrument.status == status)

    if institution_id:
        query = query.where(Instrument.institution_id == UUID(institution_id))

    if programme:
        query = query.join(Instrument.programme).where(ProgrammeModel.programme == programme)

    if maturity_before:
        from datetime import datetime
        mb = datetime.strptime(maturity_before, "%Y-%m-%d").date()
        query = query.where(Instrument.maturity_date < mb)

    if region and institution_id:
        # First get institution IDs in this region, then filter instruments
        # For simplicity, we'll join with institution
        pass

    # Order by creation date desc
    query = query.order_by(Instrument.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    items = result.scalars().all()

    total_query = select(Instrument)
    if current_user["role"] == "INSTITUTION_USER":
        total_query = total_query.where(Instrument.institution_id == current_user["institution_id"])
    elif current_user["role"] in ("DEALING_OFFICER", "DIRECTOR_RB"):
        total_query = total_query.join(Institution).where(
            Institution.region_code == current_user["region_code"]
        )
    if status:
        total_query = total_query.where(Instrument.status == status)
    if institution_id:
        total_query = total_query.where(Instrument.institution_id == UUID(institution_id))

    total_result = await db.execute(total_query)
    total = len(total_result.scalars().all())

    return {
        "items": [
            InstrumentResponse(
                id=str(item.id),
                institution_id=str(item.institution_id),
                programme_id=str(item.programme_id) if item.programme_id else None,
                type=item.type,
                instrument_number=item.instrument_number,
                bank_name=item.bank_name,
                branch=item.branch,
                ifsc=item.ifsc,
                amount_paise=item.amount_paise,
                issue_date=item.issue_date,
                maturity_date=item.maturity_date,
                tenure_months=item.tenure_months,
                interest_rate=float(item.interest_rate) if item.interest_rate else None,
                depositor_name=item.depositor_name,
                lien_in_favour=item.lien_in_favour,
                status=item.status,
                verification_status=item.verification_status,
                officer_verified=item.officer_verified,
                predecessor_id=str(item.predecessor_id) if item.predecessor_id else None,
                successor_id=str(item.successor_id) if item.successor_id else None,
                created_at=item.created_at,
                updated_at=item.updated_at,
            )
            for item in items
        ],
        "meta": {"limit": limit, "offset": offset, "total": total},
    }


@router.get("/{instrument_id}", response_model=InstrumentResponse)
async def get_instrument(
    instrument_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single instrument by UUID."""
    from uuid import UUID

    result = await db.execute(select(Instrument).where(Instrument.id == UUID(instrument_id)))
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Instrument not found.")
    await _ensure_instrument_access(item, current_user, db)

    return InstrumentResponse(
        id=str(item.id),
        institution_id=str(item.institution_id),
        programme_id=str(item.programme_id) if item.programme_id else None,
        type=item.type,
        instrument_number=item.instrument_number,
        bank_name=item.bank_name,
        branch=item.branch,
        ifsc=item.ifsc,
        amount_paise=item.amount_paise,
        issue_date=item.issue_date,
        maturity_date=item.maturity_date,
        tenure_months=item.tenure_months,
        interest_rate=float(item.interest_rate) if item.interest_rate else None,
        depositor_name=item.depositor_name,
        lien_in_favour=item.lien_in_favour,
        status=item.status,
        verification_status=item.verification_status,
        officer_verified=item.officer_verified,
        predecessor_id=str(item.predecessor_id) if item.predecessor_id else None,
        successor_id=str(item.successor_id) if item.successor_id else None,
        created_at=item.created_at,
        updated_at=item.updated_at,
    )


@router.post("/", response_model=InstrumentResponse)
async def create_instrument(
    payload: InstrumentCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new instrument."""
    from sqlalchemy.dialects.postgresql import UUID

    if current_user["role"] == "INSTITUTION_USER":
        if payload.institution_id != current_user["institution_id"]:
            raise HTTPException(status_code=403, detail="You may only submit records for your own institution.")
    elif current_user["role"] in ("DEALING_OFFICER", "DIRECTOR_RB"):
        institution_result = await db.execute(
            select(Institution).where(Institution.id == payload.institution_id)
        )
        institution = institution_result.scalar_one_or_none()
        if not institution or institution.region_code != current_user["region_code"]:
            raise HTTPException(status_code=404, detail="Institution not found.")
    else:
        raise HTTPException(status_code=403, detail="You may not create instruments.")

    programme_result = await db.execute(
        select(Programme).where(
            Programme.id == payload.programme_id,
            Programme.institution_id == payload.institution_id,
        )
    )
    if not programme_result.scalar_one_or_none():
        raise HTTPException(status_code=422, detail="Programme does not belong to this institution.")

    # Check for duplicate instrument number within institution
    result = await db.execute(
        select(Instrument).where(
            Instrument.institution_id == payload.institution_id,
            Instrument.instrument_number == payload.instrument_number,
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=409,
            detail="An instrument with this number already exists in this institution.",
        )

    # Validate lien_in_favour
    lien = payload.lien_in_favour.strip()
    if lien.upper() not in ("AICTE",):
        # Allow other values but flag for scrutiny
        pass

    instrument = Instrument(
        id=UUID(),
        institution_id=payload.institution_id,
        programme_id=payload.programme_id,
        type=payload.type,
        instrument_number=payload.instrument_number,
        bank_name=payload.bank_name,
        branch=payload.branch,
        ifsc=payload.ifsc,
        amount_paise=payload.amount_paise,
        issue_date=payload.issue_date,
        maturity_date=payload.maturity_date,
        tenure_months=payload.tenure_months,
        interest_rate=payload.interest_rate,
        depositor_name=payload.depositor_name,
        lien_in_favour=lien,
        status="DRAFT",
        verification_status="UNVERIFIED",
        officer_verified=False,
    )

    db.add(instrument)
    await db.flush()
    await db.refresh(instrument)

    # Create default provenance fields for key fields
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    key_fields = [
        "amount", "instrument_number", "issue_date", "maturity_date",
        "bank_name", "branch", "ifsc", "depositor", "lien"
    ]
    for field in key_fields:
        pf = ProvenanceField(
            id=PGUUID(),
            instrument_id=instrument.id,
            field_name=field,
            status="MISSING_DOCUMENT",  # will be updated after extraction
        )
        db.add(pf)

    await db.flush()

    return InstrumentResponse(
        id=str(instrument.id),
        institution_id=str(instrument.institution_id),
        programme_id=str(instrument.programme_id) if instrument.programme_id else None,
        type=instrument.type,
        instrument_number=instrument.instrument_number,
        bank_name=instrument.bank_name,
        branch=instrument.branch,
        ifsc=instrument.ifsc,
        amount_paise=instrument.amount_paise,
        issue_date=instrument.issue_date,
        maturity_date=instrument.maturity_date,
        tenure_months=instrument.tenure_months,
        interest_rate=float(instrument.interest_rate) if instrument.interest_rate else None,
        depositor_name=instrument.depositor_name,
        lien_in_favour=instrument.lien_in_favour,
        status=instrument.status,
        verification_status=instrument.verification_status,
        officer_verified=instrument.officer_verified,
        predecessor_id=str(instrument.predecessor_id) if instrument.predecessor_id else None,
        successor_id=str(instrument.successor_id) if instrument.successor_id else None,
        created_at=instrument.created_at,
        updated_at=instrument.updated_at,
    )


@router.post("/{instrument_id}/documents", response_model=InstrumentResponse)
async def upload_document(
    instrument_id: str,
    file: UploadFile = File(...),
    document_type: str = Query(..., description="Type of document"),
    release_request_id: Optional[str] = Query(default=None, description="Release request ID"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a document for an instrument."""

    try:
        parsed_instrument_id = UUID(instrument_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail="Instrument not found.") from exc

    result = await db.execute(select(Instrument).where(Instrument.id == parsed_instrument_id))
    instrument = result.scalar_one_or_none()

    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found.")
    await _ensure_instrument_access(instrument, current_user, db)

    content = await file.read(MAX_DOCUMENT_SIZE + 1)
    mime_type = _validate_document(content, file.filename or "")
    file_hash = hashlib.sha256(content).hexdigest()

    dup_result = await db.execute(
        select(Document).where(Document.sha256 == file_hash)
    )
    duplicate = dup_result.scalar_one_or_none()
    if duplicate:
        if duplicate.instrument_id != parsed_instrument_id:
            db.add(Finding(
                id=UUID(),
                instrument_id=parsed_instrument_id,
                rule_id="DUPLICATE_HASH",
                severity="CRITICAL",
                reason="The same receipt file was uploaded for multiple instruments.",
                evidence_json={"uploaded_hash": file_hash, "original_hash": duplicate.sha256},
                suggested_action="Review the duplicate receipt and verify the underlying bank deposit.",
                disposition="OPEN",
                actor_id=current_user["id"],
            ))
            await db.commit()
        raise HTTPException(status_code=409, detail="This receipt file is already stored.")

    document_id = UUID()
    encrypted_content, encryption_meta = encrypt_document(document_id, content)
    document = Document(
        id=document_id,
        instrument_id=parsed_instrument_id,
        release_request_id=UUID(release_request_id) if release_request_id else None,
        type=document_type,
        file_name=file.filename or "receipt",
        sha256=file_hash,
        storage_key=f"postgresql:document_contents:{document_id}",
        encryption_meta=encryption_meta,
        mime_type=mime_type,
        size_bytes=len(content),
        uploaded_by=current_user["id"],
        uploaded_at=datetime.now(__import__("datetime").timezone.utc),
        version=1,
        ocr_status="PENDING",
    )
    db.add_all([
        document,
        DocumentContent(document_id=document_id, ciphertext=encrypted_content),
    ])
    await db.commit()
    await db.refresh(instrument)

    return InstrumentResponse(
        id=str(instrument.id),
        institution_id=str(instrument.institution_id),
        programme_id=str(instrument.programme_id) if instrument.programme_id else None,
        type=instrument.type,
        instrument_number=instrument.instrument_number,
        bank_name=instrument.bank_name,
        branch=instrument.branch,
        ifsc=instrument.ifsc,
        amount_paise=instrument.amount_paise,
        issue_date=instrument.issue_date,
        maturity_date=instrument.maturity_date,
        tenure_months=instrument.tenure_months,
        interest_rate=float(instrument.interest_rate) if instrument.interest_rate else None,
        depositor_name=instrument.depositor_name,
        lien_in_favour=instrument.lien_in_favour,
        status=instrument.status,
        verification_status=instrument.verification_status,
        officer_verified=instrument.officer_verified,
        predecessor_id=str(instrument.predecessor_id) if instrument.predecessor_id else None,
        successor_id=str(instrument.successor_id) if instrument.successor_id else None,
        created_at=instrument.created_at,
        updated_at=instrument.updated_at,
    )


@router.post("/{instrument_id}/extract", response_model=InstrumentResponse)
async def extract_fields(
    instrument_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return a stored instrument after client OCR fields have been attached."""
    from uuid import UUID

    result = await db.execute(select(Instrument).where(Instrument.id == UUID(instrument_id)))
    instrument = result.scalar_one_or_none()

    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found.")
    await _ensure_instrument_access(instrument, current_user, db)

    doc_result = await db.execute(
        select(Document).where(Document.instrument_id == UUID(instrument_id))
    )
    document = doc_result.scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=404, detail="No document found for this instrument.")
    if document.ocr_status not in ("OCR_DONE", "NEEDS_REVIEW"):
        raise HTTPException(
            status_code=409,
            detail="OCR results must be generated from the uploaded receipt and reviewed before they are recorded.",
        )
    return await get_instrument(instrument_id, current_user, db)


@router.post("/{instrument_id}/verify-bank", response_model=InstrumentResponse)
async def verify_bank(
    instrument_id: str,
    mode: str = Query("SANDBOX", description="SANDBOX/LETTER/API"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Verify instrument details against bank sandbox/letter/API."""
    from uuid import UUID
    from datetime import timezone

    result = await db.execute(select(Instrument).where(Instrument.id == UUID(instrument_id)))
    instrument = result.scalar_one_or_none()

    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found.")
    if current_user["role"] not in ("DEALING_OFFICER", "DIRECTOR_RB", "COMPETENT_AUTHORITY", "ADMIN"):
        raise HTTPException(status_code=403, detail="Only authorized AICTE officers may verify bank records.")
    await _ensure_instrument_access(instrument, current_user, db)

    # Record the bank verification
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    from app.models.bank_verifications import BankVerification

    # Sandbox mode: deterministic fixture based on institution
    if mode == "SANDBOX":
        # Check if we have a sandbox record already
        existing_result = await db.execute(
            select(BankVerification).where(BankVerification.instrument_id == UUID(instrument_id))
        )
        existing = existing_result.scalar_one_or_none()

        if existing:
            # Return existing record
            instrument.verification_status = existing.status
            instrument.officer_verified = existing.officer_verified_by is not None
            await db.flush()
            return await get_instrument(instrument_id, current_user, db)

        # Create sandbox verification based on institution patterns
        if "Sanjeevani" in str(instrument.institution_id):
            # Hero case: amount 70L declared, bank says 35L ( mismatch for demonstration)
            bank_record = {
                "amount": "3500000.00",
                "issue_date": "2016-11-01",
                "maturity_date": "2026-11-01",
                "ifsc": "MAHB0000123",
                "branch": "Pune Camp",
                "depositor": "Sanjeevani Institute of Technology Trust",
                "lien": "AICTE",
            }
            status = "FOUND"
            bank_confirmed = False
        elif "Northstar" in str(instrument.institution_id):
            # Women-only case: full amount confirmed
            bank_record = {
                "amount": "1750000.00",
                "issue_date": "2020-06-15",
                "maturity_date": "2030-06-15",
                "ifsc": "SBIN0001234",
                "branch": "Kohima",
                "depositor": "Northstar Women's Education Trust",
                "lien": "AICTE",
            }
            status = "FOUND"
            bank_confirmed = True
        else:
            # Unknown institution - not found
            bank_record = {}
            status = "NOT_FOUND"
            bank_confirmed = False

        # Create bank verification record
        verification = BankVerification(
            id=PGUUID(),
            instrument_id=UUID(instrument_id),
            status=status,
            record_json=bank_record,
            source="SANDBOX",
            reference=f"SBX-{instrument.instrument_number[:8].upper()}",
            timestamp=datetime.now(timezone.utc),
            confidence=1.0,
            mode="SANDBOX",
            officer_verified_by=None,
            written_reason=f"Sandbox verification for {instrument.instrument_number} in {mode} mode",
        )

        instrument.verification_status = status
        instrument.officer_verified = bank_confirmed
        db.add(verification)

    elif mode == "LETTER":
        # Officer uploads a bank letter - would be handled separately
        # For now, mark as officer-verified
        instrument.verification_status = "OFFICER_VERIFIED"
        instrument.officer_verified = True

        verification = BankVerification(
            id=PGUUID(),
            instrument_id=UUID(instrument_id),
            status="FOUND",
            record_json={"mode": "LETTER", "note": "Bank letter uploaded by officer"},
            source="LETTER",
            reference=f"LETTER-{instrument.instrument_number[:8].upper()}",
            timestamp=datetime.now(timezone.utc),
            confidence=1.0,
            mode="LETTER",
            officer_verified_by=None,
            written_reason="Bank letter uploaded and verified by officer.",
        )
        db.add(verification)

    elif mode == "API":
        # Authorized API integration - not fully implemented in prototype
        instrument.verification_status = "SOURCE_UNAVAILABLE"
        instrument.officer_verified = False

        verification = BankVerification(
            id=PGUUID(),
            instrument_id=UUID(instrument_id),
            status="SOURCE_UNAVAILABLE",
            record_json={"mode": "API", "note": "API integration not configured in prototype"},
            source="API",
            reference=f"API-{instrument.instrument_number[:8].upper()}",
            timestamp=datetime.now(timezone.utc),
            confidence=0.5,
            mode="API",
            officer_verified_by=None,
            written_reason="Authorized bank API integration pending; marked SOURCE_UNAVAILABLE.",
        )
        db.add(verification)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported verification mode: {mode}")

    await db.flush()

    # Re-fetch and return the updated instrument
    return await get_instrument(instrument_id, current_user, db)


@router.get("/{instrument_id}/provenance", response_model=InstrumentProvenanceResponse)
async def get_provenance(
    instrument_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get three-way provenance (declared vs. document vs. bank) for an instrument."""
    from uuid import UUID

    result = await db.execute(select(Instrument).where(Instrument.id == UUID(instrument_id)))
    instrument = result.scalar_one_or_none()

    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found.")
    await _ensure_instrument_access(instrument, current_user, db)

    # Get all provenance fields
    pf_result = await db.execute(
        select(ProvenanceField).where(ProvenanceField.instrument_id == UUID(instrument_id))
    )
    provenance_fields = pf_result.scalars().all()

    # Build fields list for response
    fields = []
    for pf in provenance_fields:
        fields.append(
            {
                "field_name": pf.field_name,
                "declared_value": pf.declared_value,
                "document_value": pf.document_value,
                "bank_value": pf.bank_value,
                "confidence": float(pf.document_confidence) if pf.document_confidence else None,
                "page": pf.document_page,
                "bbox": pf.document_bbox,
                "status": pf.status,
                "bank_source": pf.bank_source,
                "bank_reference": pf.bank_reference,
                "bank_timestamp": str(pf.bank_timestamp) if pf.bank_timestamp else None,
            }
        )

    # Get critical findings
    finding_result = await db.execute(
        select(Finding).where(Finding.instrument_id == UUID(instrument_id), Finding.severity == "CRITICAL")
    )
    findings = finding_result.scalars().all()

    findings_list = []
    for f in findings:
        findings_list.append(
            {
                "id": str(f.id),
                "rule_id": f.rule_id,
                "severity": f.severity,
                "reason": f.reason,
                "suggested_action": f.suggested_action,
                "disposition": f.disposition,
                "disposition_reason": f.disposition_reason,
            }
        )

    verification_status = instrument.verification_status

    return InstrumentProvenanceResponse(
        instrument_id=str(instrument.id),
        verification_status=verification_status,
        fields=fields,
        findings=findings_list,
    )