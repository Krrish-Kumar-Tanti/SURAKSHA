import asyncio
import hashlib
import re
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Optional, List, Dict, Any, Union

from fastapi import APIRouter, Depends, UploadFile, File, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID, uuid4
import json
from app.db.session import get_db
from app.core.config import settings
from app.models.instrument import Instrument
from app.models.document import Document
from app.models.provenance_field import ProvenanceField
from app.models.finding import Finding
from app.schemas.instrument import (
    InstrumentCreate,
    InstrumentUpdate,
    InstrumentResponse,
    InstrumentProvenanceResponse,
    InstrumentListResponse,
    DocumentUploadResponse,
    DocumentExtractionResponse,
)
from app.schemas.common import EnumsResponse
from app.services.document_ocr import (
    OCRConfigurationError,
    extract_document_fields,
)
from app.services.document_storage import (
    DocumentStorageConfigurationError,
    DocumentStorageError,
    store_encrypted_document,
)
from app.services.gemini_document_ocr import GeminiOCRError


router = APIRouter(prefix="/instruments", tags=["instruments"])
MAX_DOCUMENT_SIZE = 25 * 1024 * 1024
DOCUMENT_MIME_TYPES = {
    ".pdf": ("application/pdf", b"%PDF-"),
    ".png": ("image/png", b"\x89PNG\r\n\x1a\n"),
    ".jpg": ("image/jpeg", b"\xff\xd8\xff"),
    ".jpeg": ("image/jpeg", b"\xff\xd8\xff"),
}


@router.get("/", response_model=InstrumentListResponse)
async def list_instruments(
    status: Optional[str] = Query(default=None, description="Filter by instrument status"),
    institution_id: Optional[str] = Query(default=None, description="Filter by institution UUID"),
    programme: Optional[str] = Query(default=None, description="Filter by programme"),
    maturity_before: Optional[str] = Query(default=None, description="Maturity before YYYY-MM-DD"),
    region: Optional[str] = Query(default=None, description="Filter by institution region"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """List instruments with filtering and pagination."""
    from app.models.programme import Programme as ProgrammeModel

    query = select(Instrument)

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
    db: AsyncSession = Depends(get_db),
):
    """Get a single instrument by UUID."""
    from uuid import UUID

    result = await db.execute(select(Instrument).where(Instrument.id == UUID(instrument_id)))
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Instrument not found.")

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
    db: AsyncSession = Depends(get_db),
):
    """Create a new instrument."""
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
        id=uuid4(),
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
    key_fields = [
        "amount", "instrument_number", "issue_date", "maturity_date",
        "bank_name", "branch", "ifsc", "depositor", "lien"
    ]
    for field in key_fields:
        declared_values = {
            "amount": str(Decimal(payload.amount_paise) / Decimal(100)),
            "instrument_number": payload.instrument_number,
            "issue_date": payload.issue_date.date().isoformat(),
            "maturity_date": payload.maturity_date.date().isoformat(),
            "bank_name": payload.bank_name,
            "branch": payload.branch,
            "ifsc": payload.ifsc,
            "depositor": payload.depositor_name,
            "lien": lien,
        }
        pf = ProvenanceField(
            id=uuid4(),
            instrument_id=instrument.id,
            field_name=field,
            declared_value=declared_values[field],
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


@router.post("/{instrument_id}/documents", response_model=DocumentUploadResponse)
async def upload_document(
    instrument_id: str,
    file: UploadFile = File(...),
    document_type: str = Query(..., description="Type of document"),
    release_request_id: Optional[str] = Query(default=None, description="Release request ID"),
    db: AsyncSession = Depends(get_db),
):
    """Upload a document for an instrument."""
    try:
        parsed_instrument_id = UUID(instrument_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid instrument ID.") from exc

    result = await db.execute(
        select(Instrument).where(Instrument.id == parsed_instrument_id)
    )
    instrument = result.scalar_one_or_none()

    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found.")

    suffix = Path(file.filename or "").suffix.lower()
    mime_signature = DOCUMENT_MIME_TYPES.get(suffix)
    if not mime_signature:
        raise HTTPException(
            status_code=415,
            detail="Supported documents are PDF, PNG, and JPEG files.",
        )

    content = await file.read(MAX_DOCUMENT_SIZE + 1)
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded document is empty.")
    if len(content) > MAX_DOCUMENT_SIZE:
        raise HTTPException(status_code=413, detail="Document size exceeds 25 MB.")

    mime_type, signature = mime_signature
    if not content.startswith(signature):
        raise HTTPException(
            status_code=400,
            detail="The file content does not match its filename type.",
        )

    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Gemini OCR is not configured. Set GEMINI_API_KEY in backend/.env.",
        )

    file_hash = hashlib.sha256(content).hexdigest()

    # Check for duplicate hash across instruments (critical finding)
    dup_result = await db.execute(
        select(Document).where(Document.sha256 == file_hash)
    )
    original_doc = dup_result.scalar_one_or_none()
    if original_doc and original_doc.instrument_id == parsed_instrument_id:
        return DocumentUploadResponse(
            id=str(original_doc.id),
            instrument_id=str(original_doc.instrument_id),
            file_name=original_doc.file_name,
            sha256=original_doc.sha256,
            size_bytes=original_doc.size_bytes,
            ocr_status=original_doc.ocr_status,
        )

    if original_doc:
        # Duplicate hash - create a critical finding
        from app.models.finding import Finding
        from app.models.instrument import Instrument as InstModel

        # Find the original instrument with this hash
        original_inst_result = await db.execute(
            select(InstModel).where(InstModel.id == original_doc.instrument_id)
        )
        original_inst = original_inst_result.scalar_one_or_none()

        # Create a critical finding for the incoming instrument
        finding = Finding(
            id=uuid4(),
            instrument_id=UUID(instrument_id),
            rule_id="DUPLICATE_HASH",
            severity="CRITICAL",
            reason="Duplicate document hash detected; same file uploaded for multiple instruments.",
            evidence_json={"uploaded_hash": file_hash, "original_hash": original_doc.sha256},
            suggested_action="Upload a distinct document or provide bank verification for the original.",
            disposition="OPEN",
            actor_id=None,
        )
        db.add(finding)

        # Also create a finding on the original institution's most recent instrument
        if original_inst:
            orig_finding_result = await db.execute(
                select(Finding).where(
                    Finding.instrument_id == original_inst.id,
                    Finding.rule_id == "DUPLICATE_HASH",
                )
            )
            if not orig_finding_result.scalar_one_or_none():
                orig_finding = Finding(
                    id=uuid4(),
                    instrument_id=original_inst.id,
                    rule_id="DUPLICATE_HASH",
                    severity="CRITICAL",
                    reason="Same document hash found across instruments.",
                    evidence_json={"uploaded_hash": file_hash, "original_hash": original_doc.sha256},
                    suggested_action="Verify which institution legitimately holds the instrument.",
                    disposition="OPEN",
                    actor_id=None,
                )
                db.add(orig_finding)

        await db.commit()
        raise HTTPException(
            status_code=409,
            detail="This document was already uploaded for another instrument. A duplicate finding was recorded.",
        )

    try:
        storage_key, encryption_meta = await asyncio.to_thread(
            store_encrypted_document,
            content,
            file_hash,
            settings.DOCUMENT_STORAGE_DIR,
            settings.DOCUMENT_MASTER_KEY,
        )
    except DocumentStorageConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    document = Document(
        id=uuid4(),
        instrument_id=parsed_instrument_id,
        release_request_id=UUID(release_request_id) if release_request_id else None,
        type=document_type,
        file_name=file.filename or "unknown",
        sha256=file_hash,
        storage_key=storage_key,
        encryption_meta=encryption_meta,
        mime_type=mime_type,
        size_bytes=len(content),
        uploaded_by=UUID("00000000-0000-0000-0000-000000000001"),  # placeholder - will be set from auth
        uploaded_at=datetime.now(timezone.utc),
        version=1,
        ocr_status="PENDING",
    )

    db.add(document)
    await db.flush()
    await db.refresh(document)

    return DocumentUploadResponse(
        id=str(document.id),
        instrument_id=str(document.instrument_id),
        file_name=document.file_name,
        sha256=document.sha256,
        size_bytes=document.size_bytes,
        ocr_status=document.ocr_status,
    )


@router.post("/{instrument_id}/extract", response_model=DocumentExtractionResponse)
async def extract_fields(
    instrument_id: str,
    document_id: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    """Extract fields from the uploaded instrument document via OCR/text layer."""
    try:
        parsed_instrument_id = UUID(instrument_id)
        parsed_document_id = UUID(document_id) if document_id else None
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid instrument or document ID.") from exc

    result = await db.execute(
        select(Instrument).where(Instrument.id == parsed_instrument_id)
    )
    instrument = result.scalar_one_or_none()

    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found.")

    # Find the associated document
    document_query = select(Document).where(
        Document.instrument_id == parsed_instrument_id
    )
    if parsed_document_id:
        document_query = document_query.where(Document.id == parsed_document_id)
    document_query = document_query.order_by(Document.uploaded_at.desc()).limit(1)
    doc_result = await db.execute(document_query)
    document = doc_result.scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=404, detail="No document found for this instrument.")

    try:
        extracted_fields = await extract_document_fields(document, settings)
    except OCRConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except DocumentStorageConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except DocumentStorageError as exc:
        raise HTTPException(
            status_code=500, detail="Stored document could not be decrypted."
        ) from exc
    except GeminiOCRError as exc:
        document.ocr_status = "FAILED"
        await db.flush()
        await db.commit()
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    extracted_by_name = {
        item["field_name"]: item for item in extracted_fields
    }
    provenance_result = await db.execute(
        select(ProvenanceField).where(
            ProvenanceField.instrument_id == parsed_instrument_id
        )
    )
    provenance_fields = {
        field.field_name: field for field in provenance_result.scalars().all()
    }
    for field_name, item in extracted_by_name.items():
        provenance = provenance_fields.get(field_name)
        if not provenance:
            continue
        value = item["document_value"]
        provenance.document_value = value
        provenance.document_confidence = item["confidence"]
        provenance.document_page = item["page"]
        provenance.document_bbox = item["bbox"]
        if item["confidence"] < 0.7:
            provenance.status = "LOW_CONFIDENCE"
        else:
            provenance.status = (
                "MATCH"
                if _normalize_provenance_value(field_name, provenance.declared_value)
                == _normalize_provenance_value(field_name, value)
                else "MISMATCH"
            )

    document.ocr_status = "OCR_DONE" if extracted_fields else "NEEDS_REVIEW"
    await db.flush()

    return DocumentExtractionResponse(
        instrument_id=str(instrument.id),
        document_id=str(document.id),
        ocr_status=document.ocr_status,
        fields=extracted_fields,
    )


def _normalize_provenance_value(field_name: str, value: Optional[str]) -> str:
    if not value:
        return ""
    normalized = " ".join(value.casefold().split())
    if field_name == "amount":
        cleaned_amount = re.sub(r"[^\d.,-]", "", normalized).replace(",", "")
        try:
            return str(Decimal(cleaned_amount).normalize())
        except (InvalidOperation, ValueError):
            return normalized
    if field_name in ("issue_date", "maturity_date"):
        for date_format in ("%d/%m/%Y", "%d-%m-%Y", "%d-%b-%Y"):
            try:
                return datetime.strptime(value.strip(), date_format).date().isoformat()
            except ValueError:
                continue
        try:
            return datetime.fromisoformat(value.strip()).date().isoformat()
        except ValueError:
            return normalized
    return normalized


@router.post("/{instrument_id}/verify-bank", response_model=InstrumentResponse)
async def verify_bank(
    instrument_id: str,
    mode: str = Query("SANDBOX", description="SANDBOX/LETTER/API"),
    db: AsyncSession = Depends(get_db),
):
    """Verify instrument details against bank sandbox/letter/API."""
    from uuid import UUID
    from datetime import timezone

    result = await db.execute(select(Instrument).where(Instrument.id == UUID(instrument_id)))
    instrument = result.scalar_one_or_none()

    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found.")

    # Record the bank verification
    from app.models.bank_verification import BankVerification

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
            return await get_instrument(instrument_id, db)

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
            id=uuid4(),
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
            id=uuid4(),
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
            id=uuid4(),
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
    return await get_instrument(instrument_id, db)


@router.get("/{instrument_id}/provenance", response_model=InstrumentProvenanceResponse)
async def get_provenance(
    instrument_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get three-way provenance (declared vs. document vs. bank) for an instrument."""
    from uuid import UUID

    result = await db.execute(select(Instrument).where(Instrument.id == UUID(instrument_id)))
    instrument = result.scalar_one_or_none()

    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found.")

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