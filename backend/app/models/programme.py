from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, BigInteger, UUID, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timezone


class Programme(Base):
    __tablename__ = "programmes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    programme = Column(String(30), nullable=False)
    level = Column(String(10), nullable=False)
    approved_intake = Column(Integer, nullable=False, default=0)
    active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "programme IN ('ENGINEERING','PLANNING','APPLIED_ARTS','DESIGN','HMCT','COMPUTER_APPLICATIONS','MANAGEMENT')",
            name="chk_programme",
        ),
        CheckConstraint(
            "level IN ('DIPLOMA','UG','PG')",
            name="chk_level",
        ),
    )

    institution = relationship("Institution", back_populates="programmes")