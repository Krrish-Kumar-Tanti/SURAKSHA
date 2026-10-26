from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID as UUIDType
from datetime import datetime, timezone
from app.core.config import settings
from app.models.instrument import Instrument as InstrumentModel


class BankVerificationResult:
    """Result structure from bank verification."""
    def __init__(self, status: str, record: Optional[Dict] = None, 
                 source: str = "MOCK", reference: Optional[str] = None,
                 confidence: Optional[float] = None, mode: str = "SANDBOX"):
        self.status = status
        self.record = record or {}
        self.source = source
        self.reference = reference
        self.confidence = confidence
        self.mode = mode


class BankService:
    """Bank verification service with SANDBOX/LETTER/API modes."""
    
    @staticmethod
    async def verify(instrument_id: str, mode: str = "SANDBOX", db: AsyncSession = None) -> BankVerificationResult:
        """Verify instrument details against bank.
        
        Modes:
        - API: authorized integration (not in prototype)
        - LETTER: officer uploads bank letter and records verified fields
        - SANDBOX: deterministic fixture keyed by instrument number
        """
        from sqlalchemy.dialects.postgresql import UUID as PGUUID
        from app.models.instrument import Instrument as InstModel
        
        result = await db.execute(select(InstModel).where(InstModel.id == UUIDType(instrument_id)))
        instrument = result.scalar_one_or_none()
        
        if not instrument:
            return BankVerificationResult(
                status="NOT_FOUND", mode=mode,
                reference=f"INST-{instrument_id[:8].upper()}"
            )
        
        if mode == "SANDBOX":
            # Deterministic fixture based on instrument number patterns
            inst_num = instrument.instrument_number
            
            if "SIT" in inst_num or "Sanjeevani" in str(instrument.institution_id):
                # Hero case: Sanjeevani Institute
                record = {
                    "amount": "3500000.00",
                    "issue_date": "2016-11-01",
                    "maturity_date": "2026-11-01",
                    "ifsc": "MAHB0000123",
                    "branch": "Pune Camp",
                    "depositor": "Sanjeevani Institute of Technology Trust",
                    "lien": "AICTE"
                }
                status = "FOUND"
                confidence = 1.0
                ref = "SBX-2026-0001"
                
            elif "Northstar" in str(instrument.institution_id):
                # Women-only contrast case
                record = {
                    "amount": "1750000.00",
                    "issue_date": "2020-06-15",
                    "maturity_date": "2030-06-15",
                    "ifsc": "SBIN0001234",
                    "branch": "Kohima",
                    "depositor": "Northstar Women's Education Trust",
                    "lien": "AICTE"
                }
                status = "FOUND"
                confidence = 1.0
                ref = "SBX-NST-0001"
                
            else:
                # Unknown institution
                record = {}
                status = "NOT_FOUND"
                confidence = 0.5
                ref = None
                
            return BankVerificationResult(
                status=status, record=record, source="SANDBOX",
                reference=ref, confidence=confidence, mode=mode
            )
            
        elif mode == "LETTER":
            # Officer-uploaded bank letter - mark officer-verified
            return BankVerificationResult(
                status="FOUND", record={"mode": "LETTER", "note": "Bank letter uploaded by officer"},
                source="LETTER", reference=f"LETTER-{instrument_id[:8].upper()}",
                confidence=1.0, mode=mode
            )
            
        elif mode == "API":
            # Authorized API - not fully configured in prototype
            return BankVerificationResult(
                status="SOURCE_UNAVAILABLE", record={"mode": "API", "note": "API integration pending"},
                source="API", reference=f"API-{instrument_id[:8].upper()}",
                confidence=0.5, mode=mode
            )
            
        else:
            return BankVerificationResult(
                status="UNSUPPORTED", mode=mode,
                reference=f"UNKNOWN-{instrument_id[:8].upper()}"
            )
    
    @staticmethod
    async def re_verify(instrument_id: str, db: AsyncSession) -> Dict[str, Any]:
        """Re-verify bank record (max once per 30 days)."""
        from app.models.bank_verifications import BankVerification
        from sqlalchemy.dialects.postgresql import UUID as PGUUID
        from datetime import timedelta
        
        # Check if we already verified within 30 days
        last_result = await db.execute(
            select(BankVerification).where(
                BankVerification.instrument_id == UUIDType(instrument_id)
            ).order_by(BankVerification.timestamp.desc())
        )
        last_verification = last_result.scalar_one_or_none()
        
        if last_verification:
            age = datetime.now(timezone.utc) - last_verification.timestamp
            if age < timedelta(days=30):
                # Return cached result, still valid
                return {
                    "status": "CACHED",
                    "status_value": last_verification.status,
                    "cached_at": last_verification.timestamp.isoformat(),
                    "skip_reason": "Within 30-day re-verify window"
                }
        
        # Perform fresh verification
        verification_result = await BankService.verify(instrument_id, "SANDBOX", db)
        
        # Create bank verification record
        verification = BankVerification(
            id=PGUUID(),
            instrument_id=UUIDType(instrument_id),
            status=verification_result.status,
            record_json=verification_result.record,
            source=verification_result.source,
            reference=verification_result.reference,
            timestamp=datetime.now(timezone.utc),
            confidence=verification_result.confidence,
            mode=verification_result.mode,
            officer_verified_by=None,
            written_reason=f"Bank re-verification at {verification_result.timestamp}"
        )
        
        db.add(verification)
        
        return {
            "status": "FRESH",
            "status_value": verification_result.status,
            "record": verification_result.record,
            "mode": verification_result.mode,
            "just_performed": True
        }