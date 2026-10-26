# Unnati Sharma — Time Machine / Maturity Alert Job (§6.7)
# File: jobs/daily_lifecycle.md
# SURAKSHA SIH26265 — Backend Deliverable

# Daily idempotent job (APScheduler):
# - Read `system_settings.demo_clock` when DEMO_MODE=true; else system time.
# - Reminders: T-90/60/30/15/7/0 for ACTIVE/EXPIRING/RELEASE_REQUESTED/RENEWAL_DUE instruments.
# - Stop after RELEASED/CLOSED.
# - Overdue every 7 days after maturity for unreleased/unclosed.
# - Escalation: day 1 L1 (DEALING_OFFICER), day 15 L2 (DIRECTOR_RB), day 30 L3 (COMPETENT_AUTHORITY).
# - Bank re-check every 30 days.
# - Auto-resolve when underlying condition clears.

# Fingerprint:
# instrument:{instrument_id}:{alert_type}:{due_date}:{escalation_level}
# Unique constraint makes job idempotent.

# Time machine endpoint: POST /admin/time-machine (ADMIN or DIRECTOR_RB only)
# Changes `system_settings.demo_clock`, writes audit event, never mutates record dates directly.
# When clock crosses `hold_end_date`: set system `TERM_SERVED` clearance CLEAR; re-evaluate open release requests.
