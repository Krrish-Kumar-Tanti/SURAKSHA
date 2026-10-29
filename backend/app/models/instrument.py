from sqlalchemy import Column, String, Integer, Boolean, Date, DateTime, Text, BigInteger, UUID, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from datetime import datetime, timezone
from app.db.base import Base


class Instrument(Base):
    __tablename__ = "instruments"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(PGUUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    programme_id = Column(PGUUID(as_uuid=True), ForeignKey("programmes.id", ondelete="SET NULL"), nullable=True)
    type = Column(String(10), nullable=False)
    instrument_number = Column(String(100), nullable=False)
    bank_name = Column(String(200), nullable=False)
    branch = Column(String(200), nullable=False)
    ifsc = Column(String(20), nullable=False)
    amount_paise = Column(BigInteger, nullable=False, comment="paise, integer")
    issue_date = Column(Date, nullable=False)
    maturity_date = Column(Date, nullable=False)
    tenure_months = Column(Integer, nullable=False)
    interest_rate = Column(String(10), nullable=True)  # stored as string "6.50"
    depositor_name = Column(String(500), nullable=False)
    lien_in_favour = Column(String(200), nullable=False)
    status = Column(String(30), nullable=False)
    predecessor_id = Column(PGUUID(as_uuid=True), ForeignKey("instruments.id", ondelete="SET NULL"), nullable=True)
    successor_id = Column(PGUUID(as_uuid=True), ForeignKey("instruments.id", ondelete="SET NULL"), nullable=True)
    verification_status = Column(String(30), nullable=False, default="UNVERIFIED")
    officer_verified = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "type IN ('FDR','RTGS','RPGF','BG')",
            name="chk_instrument_type",
        ),
        CheckConstraint(
            "status IN ('DRAFT','SUBMITTED','UNDER_SCRUTINY','QUERY_RAISED','VERIFIED','ACTIVE','EXPIRING','MATURED','RENEWAL_DUE','RENEWED','REPLACED','RELEASE_REQUESTED','CLEARANCES_PENDING','APPROVED','RELEASED','DISCHARGED','CLOSED','REJECTED','WITHDRAWN','FORFEITED')",
            name="chk_instrument_status",
        ),
        CheckConstraint(
            "verification_status IN ('UNVERIFIED','DOCUMENT_CHECKED','OFFICER_VERIFIED','BANK_CONFIRMED','DISCREPANT','SOURCE_UNAVAILABLE')",
            name="chk_verification_status",
        ),
        # One unique instrument number per institution
        __import__("sqlalchemy").schema.UniqueConstraint("institution_id", "instrument_number", name="uq_inst_instrument_number"),
    )

    institution = relationship("Institution", back_populates="instruments")
    programme = relationship("Programme", back_populates="instruments")
    documents = relationship("Document", back_populates="instrument", cascade="all, delete-orphan")
    provenance_fields = relationship("ProvenanceField", back_populates="instrument", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="instrument", cascade="all, delete-orphan")
    obligations = relationship("Obligation", back_populates="instrument", cascade="all, delete-orphan")
    bank_verifications = relationship("BankVerification", back_populates="instrument", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="instrument", cascade="all, delete-orphan")
    release_requests = relationship("ReleaseRequest", back_populates="instrument", cascade="all, delete-orphan")
    pledge_edges_from = relationship(
        "PledgeEdge", foreign_keys="PledgeEdge.from_instrument_id", back_populates="from_instrument", cascade="all, delete-orphan"
    )