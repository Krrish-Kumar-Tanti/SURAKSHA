from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, BigInteger, JSON, CheckConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timezone


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    region_code = Column(String(10), nullable=True)
    institution_id = Column(UUID(as_uuid=True), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "role IN ('INSTITUTION_USER','DEALING_OFFICER','DIRECTOR_RB','COMPETENT_AUTHORITY','ACCOUNTS','AUDITOR','ADMIN')",
            name="chk_user_role",
        ),
    )

    institution = relationship(
        "Institution",
        back_populates="users",
        primaryjoin="foreign(User.institution_id) == Institution.id",
        foreign_keys="User.institution_id",
        uselist=False,
    )
    uploaded_documents = relationship("Document", back_populates="uploader")
    bank_verifications_recorded = relationship(
        "BankVerification",
        back_populates="officer",
        foreign_keys="BankVerification.officer_verified_by",
    )
    obligations_created = relationship("Obligation", back_populates="owner")
    clearances_verified = relationship("Clearance", back_populates="verifier")
    findings_actor = relationship("Finding", back_populates="actor")
    release_requests_created = relationship(
        "ReleaseRequest",
        back_populates="requester",
        foreign_keys="ReleaseRequest.requested_by",
    )