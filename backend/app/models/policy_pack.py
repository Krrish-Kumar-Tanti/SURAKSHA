from sqlalchemy import Column, String, Date, CheckConstraint, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timezone
from app.db.base import Base


class PolicyPack(Base):
    __tablename__ = "policy_packs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    label = Column(String(100), nullable=False)
    academic_year = Column(String(15), nullable=False)
    source_url = Column(Text, nullable=False)
    effective_from = Column(Date, nullable=True)
    effective_to = Column(Date, nullable=True)
    status = Column(String(15), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "status IN ('ACTIVE','DRAFT','BLOCKED')",
            name="chk_policy_pack_status",
        ),
    )