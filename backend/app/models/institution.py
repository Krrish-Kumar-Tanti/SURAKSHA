from sqlalchemy import Column, String, Integer, Boolean, Date, DateTime, Text, BigInteger, CheckConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timezone


class Institution(Base):
    __tablename__ = "institutions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    aicte_permanent_id = Column(String(20), nullable=False, unique=True)
    name = Column(String(500), nullable=False)
    trust_name = Column(String(500), nullable=False)
    region_code = Column(String(10), nullable=False)
    state_code = Column(String(10), nullable=False)
    district = Column(String(100), nullable=False)
    location_category = Column(
        String(20),
        nullable=False,
    )
    institution_type = Column(
        String(20),
        nullable=False,
    )
    building_ownership = Column(
        String(10),
        nullable=False,
    )
    university_type = Column(
        String(20),
        nullable=False,
    )
    application_category = Column(
        String(30),
        nullable=False,
    )
    established_year = Column(Integer, nullable=False)
    regulatory_years = Column(Integer, nullable=False, default=0)
    ugc_years = Column(Integer, nullable=False, default=0)
    prior_release_noc = Column(Boolean, nullable=False, default=False)
    approval_status = Column(String(50), nullable=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "location_category IN ('NE','JK','LADAKH','ASPIRATIONAL','AN','LAKSHADWEEP','OTHER')",
            name="chk_location_category",
        ),
        CheckConstraint(
            "institution_type IN ('CO_ED','WOMEN_ONLY','PWD_ONLY')",
            name="chk_institution_type",
        ),
        CheckConstraint(
            "building_ownership IN ('OWNED','LEASED')",
            name="chk_building_ownership",
        ),
        CheckConstraint(
            "university_type IN ('AFFILIATED','PRIVATE_UNIVERSITY','DEEMED','GOVERNMENT')",
            name="chk_university_type",
        ),
        CheckConstraint(
            "application_category IN ('NEW','EXISTING_1_3_3','NEW_LEVEL_PROGRAMME','UNIVERSITY_NEW_PROGRAMME','OTHER')",
            name="chk_application_category",
        ),
    )

    users = relationship("User", back_populates="institution", cascade="all, delete-orphan")
    programmes = relationship("Programme", back_populates="institution", cascade="all, delete-orphan")