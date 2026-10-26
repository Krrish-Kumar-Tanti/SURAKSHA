# Unnati Sharma — RBAC Matrix (§7.2)
# File: security/rbac_matrix.md
# SURAKSHA SIH26265 — Backend Deliverable

## Capability Table (exact from 01_BACKEND.md §7.2)

| Capability | INSTITUTION_USER | DEALING_OFFICER | DIRECTOR_RB | COMPETENT_AUTHORITY | ACCOUNTS | AUDITOR | ADMIN |
|---|---|---|---|---|---|---|---|
| Own institution read | yes | region | all | all | all | all | all |
| Create instrument | own | no | no | no | no | no | yes |
| Upload document | own | no | no | no | no | no | yes |
| Extract/compare | own | region | all | all | read | read | yes |
| Disposition warning | no | region | all | all | no | no | yes |
| Disposition critical | no | no | all | all | no | no | yes |
| Set clearance | no | region | all | all | no | no | yes |
| Maker recommend | no | region | all | no | no | no | yes |
| Checker | no | no | all | no | no | no | yes |
| Final approve | no | no | no | all | no | no | yes |
| Release letter | no | no | no | no | all | read | yes |
| Audit read | own entity | region | all | all | all | all | all |
| Time machine | no | no | demo | no | no | no | yes |

## Enforcement Rule
- Scoping enforced in SQLAlchemy queries, not only UI.
- Every endpoint checks `actor_role` from JWT claims against this matrix.
