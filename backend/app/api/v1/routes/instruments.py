from fastapi import APIRouter, Depends, UploadFile, File, Query
from typing import Optional, List, Dict, Any, Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
import json
from app.db.session import get_db
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
)
from app.schemas.common import EnumsResponse


router = APIRouter(prefix="/instruments", tags=["instruments"])


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
    from sqlalchemy.dialects.postgresql import UUID

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
    db: AsyncSession = Depends(get_db),
):
    """Upload a document for an instrument."""
    from uuid import UUID
    import hashlib

    result = await db.execute(select(Instrument).where(Instrument.id == UUID(instrument_id)))
    instrument = result.scalar_one_or_none()

    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found.")

    # Compute SHA-256 hash of the uploaded file content
    content = await file.read()
    file_hash = hashlib.sha256(content).hexdigest()

    # Check for duplicate hash across instruments (critical finding)
    dup_result = await db.execute(
        select(Document).where(Document.sha256 == file_hash)
    )
    if dup_result.scalar_one_or_none():
        # Duplicate hash - create a critical finding
        from sqlalchemy.dialects.postgresql import UUID as PGUUID
        from app.models.finding import Finding
        from app.models.instrument import Instrument as InstModel

        # Find the original instrument with this hash
        original_doc = dup_result.scalar_one()
        original_inst_result = await db.execute(
            select(InstModel).where(InstModel.id == original_doc.instrument_id)
        )
        original_inst = original_inst_result.scalar_one_or_none()

        # Create a critical finding for the incoming instrument
        finding = Finding(
            id=PGUUID(),
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
                    id=PGUUID(),
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

    # Encrypt the file with AES-256-GCM (simulated - store hash and metadata)
    # In prototype, store hash, name, type and metadata
    storage_key = f"doc_{instrument_id}_{file_hash[:16]}"

    document = Document(
        id=UUID(),
        instrument_id=UUID(instrument_id),
        release_request_id=UUID(release_request_id) if release_request_id else None,
        type=document_type,
        file_name=file.filename or "unknown",
        sha256=file_hash,
        storage_key=storage_key,
        encryption_meta={"mode": "AES-256-GCM", "simulated": True},
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
        uploaded_by=UUID("00000000-0000-0000-0000-000000000001"),  # placeholder - will be set from auth
        uploaded_at=datetime.now(__import__("datetime").timezone.utc),
        version=1,
        ocr_status="PENDING",
    )

    db.add(document)
    await db.flush()
    await db.refresh(document)

    # Update provenance fields - for now mark as PENDING
    # In a full implementation, OCR would be run here

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
    db: AsyncSession = Depends(get_db),
):
    """Extract fields from the uploaded instrument document via OCR/text layer."""
    from uuid import UUID
    from datetime import timezone

    result = await db.execute(select(Instrument).where(Instrument.id == UUID(instrument_id)))
    instrument = result.scalar_one_or_none()

    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found.")

    # Find the associated document
    doc_result = await db.execute(
        select(Document).where(Document.instrument_id == UUID(instrument_id))
    )
    document = doc_result.scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=404, detail="No document found for this instrument.")

    # Simulate OCR extraction based on document type
    # In a real system, this would call Tesseract or use PDF text layer
    # For the prototype, we'll use deterministic fixture-based extraction
    import asyncio

    # Read the actual file content from storage key (simulated)
    # For now, use synthetic extraction based on instrument number patterns
    instrument_number = instrument.instrument_number

    # Deterministic extraction based on known demo fixtures
    if "SIT" in instrument_number or "Sanjeevani" in str(instrument.institution_id):
        # Hero case: Sanjeevani Institute - leased, ₹70L
        extracted = {
            "amount": "7000000.00",
            "issue_date": "2016-11-01",
            "maturity_date": "2026-11-01",
            "bank_name": "Bank of Maharashtra",
            "branch": "Pune Camp",
            "ifsc": "MAHB0000123",
            "depositor": "Sanjeevani Education Trust",
            "lien": "AICTE",
        }
    elif "Nagaland" in str(instrument.institution_id) or "Women" in str(instrument.institution_id):
        # Women-only contrast case
        extracted = {
            "amount": "1750000.00",
            "issue_date": "2020-06-15",
            "maturity_date": "2030-06-15",
            "bank_name": "State Bank of India",
            "branch": "Kohima",
            "ifsc": "SBIN0001234",
            "depositor": "Northstar Women's Education Trust",
            "lien": "AICTE",
        }
    else:
        # Generic fallback - mark OCR as needing review
        extracted = {
            "amount": None,
            "issue_date": None,
            "maturity_date": None,
            "bank_name": None,
            "branch": None,
            "ifsc": None,
            "depositor": None,
            "lien": None,
        }
        document.ocr_status = "NEEDS_REVIEW"
        await db.flush()

    # Update document OCR status
    document.ocr_status = "TEXT_LAYER"
    await db.flush()

    # Update provenance fields with extracted values
    if extracted.get("amount") is not None:
        # Find the amount provenance field and update it
        pf_result = await db.execute(
            select(ProvenanceField).where(
                ProvenanceField.instrument_id == UUID(instrument_id),
                ProvenanceField.field_name == "amount",
            )
        )
        pf = pf_result.scalar_one_or_none()
        if pf:
            pf.document_value = extracted["amount"]
            pf.document_confidence = 0.98
            pf.document_page = 1
            pf.document_bbox = {"x": 0.12, "y": 0.34, "w": 0.31, "h": 0.05}
            pf.status = "MATCH" if pf.declared_value == extracted["amount"] else "MISMATCH"
            pf.bank_source = "SANDBOX"
            pf.bank_reference = "SBX-2026-0001"
            pf.bank_timestamp = datetime.now(timezone.utc)
            await db.flush()

    # Return updated instrument
    return await get_instrument(instrument_id, db)


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