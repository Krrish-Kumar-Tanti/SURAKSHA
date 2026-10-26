# Unnati Sharma — Forecast / At-Risk Report (§6.8)
# File: services/forecast_service.md
# SURAKSHA SIH26265 — Backend Deliverable

# At-risk definition:
# critical open finding OR resolution status {MATURED, RENEWAL_DUE} past due
# OR bank verification {NOT_FOUND, ENCASHED, CLOSED, SOURCE_UNAVAILABLE}
# OR release blocked by required node.

# Buckets: month or quarter by maturity_date. Forecast labelled ESTIMATE.
# Every number drills to records. Reports respect RBAC. Every metric linked to audit.
