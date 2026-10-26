# Unnati Sharma — Acceptance Tests (§9) + Open Questions (§10)
# File: unnati_output/acceptance_and_open.md
# SURAKSHA SIH26265 — Backend Deliverable

# §9 Acceptance Tests (selected, from 01_BACKEND.md §9):
# Policy: Engineering UG owned=35L; leased=70L; NE owned=17.5L; NE leased=35L; govt=0; new programme at >10yr uni=required.
# Release: all clear=ELIGIBLE; PGRC pending=BLOCKED; Vigilance missing=BLOCKED; Grants pending=BLOCKED; embezzlement without NOC=BLOCKED; converted university complaint=BLOCKED; progressive closure missing cert=BLOCKED; progressive closure matured=cert not needed; merger missing=BLOCKED; RTGS=sanction; maker cannot approve own; blocked approval=422.
# Provenance: amount mismatch=CRITICAL; number mismatch=CRITICAL; date mismatch=SERIOUS; IFSC mismatch=SERIOUS; depositor mismatch=SERIOUS; lien missing=CRITICAL; tenure short=SERIOUS; duplicate number=CRITICAL; duplicate hash=CRITICAL; missing doc=WARNING; bank NOT_FOUND=manual review.
# Audit: tamper breaks chain at first altered event; append-only enforced; PII masked; no secrets committed.

# §10 Open Questions (exact 12 from spec §10):
# 1. Exact official effective date of 2026-27 addendum — do not fabricate.
# 2. Government + new programme exemption ambiguity — route to human review.
# 3. AICTE FDR-release circular — [UNVERIFIED] until official PDF downloaded.
# 4. Bank/PGRC/eSign/APAAR API — assume MoU-gated; mock only.
# 5. BG scope — support in model, not demo dependency.
# 6. Policy version selection — by academic_year, not fabricated timestamp.
# 7. Interest retention — principal only refunded; interest tracked separately.
# 8. Extension/forfeiture — human decision only; not auto-computed.
# 9. Duplicate pledge detection — edge evidence explainable; original holder not blocked solely by copy.
# 10. Demonstration clock — time machine changes demo clock only; never mutates record dates.
# 11. Integration labels — every adapter response must expose mode (MOCK/SANDBOX/SIMULATED).
# 12. No real PII or bank account data — synthetic data only; synthetic demo banner on every screen.
