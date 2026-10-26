from sqlalchemy import Column, String, Text, Date, CheckConstraint, JSON, UUID
import uuid
from datetime import datetime, timezone
from app.db.base import Base


class PolicyRule(Base):
    __tablename__ = "policy_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pack_id = Column(UUID(as_uuid=True), nullable=False)
    rule_key = Column(String(50), nullable=False)
    clause = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    rule_type = Column(String(50), nullable=False)
    payload_json = Column(JSON, nullable=False, default="{}")
    source_excerpt = Column(Text, nullable=False)
    source_url = Column(Text, nullable=False)
    effective_from = Column(Date, nullable=True)
    effective_to = Column(Date, nullable=True)
    status = Column(String(15), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "status IN ('ACTIVE','DRAFT','BLOCKED')",
            name="chk_policy_rule_status",
        ),
        __import__("sqlalchemy").schema.UniqueConstraint("pack_id", "rule_key", name="uq_policy_rules_pack_key"),
    )