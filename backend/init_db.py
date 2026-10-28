import asyncio
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.base import Base
from app.db.session import engine
# Import all models to ensure they are registered with Base.metadata
from app.models.user import User
from app.models.institution import Institution
from app.models.programme import Programme
from app.models.instrument import Instrument
from app.models.document import Document
from app.models.bank_verification import BankVerification
from app.models.provenance_field import ProvenanceField
from app.models.obligation import Obligation
from app.models.requirement import Requirement
from app.models.clearance import Clearance
from app.models.finding import Finding
from app.models.alert import Alert
from app.models.pledge_edge import PledgeEdge
from app.models.audit_event import AuditEvent
from app.models.release_request import ReleaseRequest
from app.models.system_setting import SystemSetting
from app.models.policy_pack import PolicyPack
from app.models.policy_rule import PolicyRule

async def init_tables():
    print(f"Connecting to database with tables: {list(Base.metadata.tables.keys())}")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✓ All SURAKSHA database tables successfully created in PostgreSQL!")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_tables())
