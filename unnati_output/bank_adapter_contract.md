# Unnati Sharma — Bank Adapter Interface + Sandbox (§6.4)
# File: adapters/bank_adapter_contract.md
# SURAKSHA SIH26265 — Backend Deliverable

# Protocol / interface (Python):
# class BankVerifier(Protocol):
#     def verify(self, instrument: Instrument, mode: str) -> BankVerificationResult: ...

# Modes:
# - API: authorized (not in prototype)
# - LETTER: officer uploads bank letter + records verified fields
# - SANDBOX: deterministic fixtures keyed by instrument number

# Rules:
# - SOURCE_UNAVAILABLE / NOT_FOUND never auto-reject; route to manual review.
# - BANK_CONFIRMED set only by authorized bank API.
# - OFFICER_VERIFIED for letter/officer-recorded confirmation (Director/CA waiver allowed with reason).
# - Re-verify at most every 30 days; each check creates bank_verifications row + audit event.
# - Sandbox values synthetic; never claim live integration.
# - Timeout on all adapter calls; never block request indefinitely.
