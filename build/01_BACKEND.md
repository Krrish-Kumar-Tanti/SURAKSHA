# 01 — BACKEND ULTIMATE
## SURAKSHA · SIH26265 · Security Deposit / FDR Control Tower

> **Pack version:** 1.0
> **Owner:** Backend Lead
> **Readers:** all four owners; frontend and data/QA must treat this file as the contract spine.
> **Status:** implementation-ready specification.
> **Scope:** SIH 36-hour prototype, not production AICTE deployment.
> **Policy authority:** this file encodes `context.md` §4 and `26265.md` §4. If this file conflicts with those, those win.
> **Hard rule:** no real bank, AICTE, CPGRAMS, DigiLocker, eSign, APAAR, PFMS, or SMS integration is claimed. Everything external is `SIMULATED`, `MOCK`, or `SANDBOX`.

---

## 0. How to use this file

Read in this order:

1. §1 product boundary and non-negotiables.
2. §2 architecture and conventions.
3. §3 policy source of truth.
4. §4 database contract.
5. §5 API contract.
6. §6 domain algorithms and workflows.
7. §7 audit/security/integrations.
8. §8 code tree and implementation order.
9. §9 acceptance tests and handoff.

Do not invent fields, routes, statuses, or policy rules outside this file. If something is missing, add it to §10 open questions and route it to the integrator.

**Pack-wide authorities:**

| Domain | Authority |
|---|---|
| Policy, schema, API, backend behavior | this file |
| UX, screens, components | `02_FRONTEND.md` |
| Seed data, fixtures, tests, acceptance | `03_DATA_QA.md` |
| Narrative, PPT, demo, ownership, runbook | `04_DELIVERY.md` |

---

## 1. Product boundary

### 1.1 What this backend must prove

The backend is the compliance brain of SURAKSHA. It must prove:

1. an instrument exists and is real;
2. its declared values, document values, and bank values agree or disagree with evidence;
3. the required amount is correct under the selected APH/addendum policy pack;
4. the instrument remains pledged through its 10-year lifecycle;
5. release is blocked until every required clearance is recorded;
6. every decision is attributable and tamper-evident.

### 1.2 What it must not become

- a payment processor;
- a bank core-banking system;
- an OCR research project;
- a general-purpose ERP;
- a blockchain;
- an automatic release or penalty engine;
- a production AICTE system or legal opinion.

### 1.3 Non-negotiables

- Integer paise for money. Never floats.
- ISO dates (`YYYY-MM-DD`) and UTC timestamps.
- Every mutation emits an audit event.
- Every policy result carries a trace and clause citation.
- Every external value is labelled with its source and timestamp.
- Human decisions are explicit, role-gated, and recorded.
- Synthetic data only. No real account numbers, personal data, or secrets.
- A blocked release cannot be overridden by the maker.
- `NOT_FOUND` from a bank is not proof of fraud; route to manual review.
- No automatic adverse action.

---

## 2. Architecture and conventions

### 2.1 Stack

| Layer | Decision |
|---|---|
| API | FastAPI + Python 3.12 |
| ORM | SQLAlchemy 2.x + Alembic |
| Database | Postgres 16 |
| Auth | JWT bearer, HS256, short expiry |
| Jobs | APScheduler in-process for the prototype |
| Documents | Local encrypted store under `var/documents/` |
| PDFs | WeasyPrint or ReportLab |
| Tests | pytest + httpx |
| Deploy | Docker Compose |

### 2.2 Runtime topology

```
React/Vite frontend
       │  REST/JSON  /api/v1
       ▼
FastAPI application
  ├─ auth + RBAC
  ├─ institution/instrument services
  ├─ policy engine
  ├─ document/OCR/provenance
  ├─ bank adapter (sandbox)
  ├─ release graph
  ├─ pledge graph
  ├─ alerts/forecast
  ├─ audit chain
  └─ adapters: AICTE import, complaints, DigiLocker, payments, email
       │
       ├─ Postgres
       └─ encrypted document store
```

### 2.3 Core conventions

| Convention | Rule |
|---|---|
| API prefix | `/api/v1` |
| IDs | UUIDv4 strings, except `policy_packs.id` and `aicte_permanent_id` |
| Money | bigint paise; response includes `amount_display` only as a convenience |
| Dates | `YYYY-MM-DD`; timestamps RFC3339 UTC |
| Pagination | `limit` (default 50, max 200), `offset`; response `{items,total,limit,offset}` |
| Filtering | query params on list endpoints; no ad-hoc JSON filters |
| Sorting | `sort=field` or `sort=-field` |
| Errors | `{ "error": { "code", "message", "details", "trace_id" } }` |
| Errors: validation | HTTP 400 |
| Errors: unauthenticated | HTTP 401 |
| Errors: forbidden | HTTP 403 |
| Errors: missing | HTTP 404 |
| Errors: state/duplicate | HTTP 409 |
| Errors: business rule blocked | HTTP 422 |
| Errors: unexpected | HTTP 500 |
| Idempotency | `Idempotency-Key` supported on POST create/action endpoints; replay returns the original response |
| Audit | every create/update/action/document/decision emits an audit event |

### 2.4 Canonical IDs and enums

Use exactly these values in backend, frontend, tests, and seed data.

```text
Role:
INSTITUTION_USER | DEALING_OFFICER | DIRECTOR_RB | COMPETENT_AUTHORITY |
ACCOUNTS | AUDITOR | ADMIN

InstitutionType:
CO_ED | WOMEN_ONLY | PWD_ONLY

LocationCategory:
NE | JK | LADAKH | ASPIRATIONAL | AN | LAKSHADWEEP | OTHER

BuildingOwnership:
OWNED | LEASED

UniversityType:
AFFILIATED | PRIVATE_UNIVERSITY | DEEMED | GOVERNMENT

ApplicationCategory:
NEW | EXISTING_1_3_3 | NEW_LEVEL_PROGRAMME | UNIVERSITY_NEW_PROGRAMME | OTHER

Programme:
ENGINEERING | PLANNING | APPLIED_ARTS | DESIGN | HMCT | COMPUTER_APPLICATIONS | MANAGEMENT

Level:
DIPLOMA | UG | PG

InstrumentType:
FDR | RTGS | RPGF | BG

InstrumentStatus:
DRAFT | SUBMITTED | UNDER_SCRUTINY | QUERY_RAISED | VERIFIED | ACTIVE |
EXPIRING | MATURED | RENEWAL_DUE | RENEWED | REPLACED | RELEASE_REQUESTED |
CLEARANCES_PENDING | APPROVED | RELEASED | DISCHARGED | CLOSED |
REJECTED | WITHDRAWN | FORFEITED

VerificationStatus:
UNVERIFIED | DOCUMENT_CHECKED | OFFICER_VERIFIED | BANK_CONFIRMED | DISCREPANT | SOURCE_UNAVAILABLE

BankVerificationStatus:
FOUND | NOT_FOUND | ENCASHED | CLOSED | UNSUPPORTED | SOURCE_UNAVAILABLE

FindingSeverity:
CRITICAL | SERIOUS | WARNING

FindingDisposition:
OPEN | ACCEPTED | WAIVED | RESOLVED

ObligationType:
RENEWAL | RELEASE_CLEARANCE | UNDERTAKING | BANK_RECHECK

ObligationStatus:
OPEN | DONE | OVERDUE | CANCELLED

ReleaseRequestType:
MATURITY | EARLY | CLOSURE | PROGRESSIVE_CLOSURE | MERGER

ReleaseStatus:
DRAFT | SUBMITTED | ELIGIBILITY_CHECK | BLOCKED | NEEDS_INFO |
PENDING_SOURCE | ELIGIBLE | MAKER_RECOMMENDED | CHECKER_APPROVED |
CA_APPROVED | NOC_ISSUED | SANCTION_ISSUED | RELEASED | REJECTED | WITHDRAWN

EligibilityResult:
ELIGIBLE | BLOCKED | NEEDS_INFO | PENDING_SOURCE

ClearanceType:
DOCUMENTS | PROVENANCE | PGRC | VIGILANCE | GRANTS | FINANCIAL_EMBEZZLEMENT |
COMPLAINTS_DISCIPLINARY | PROGRESSIVE_CLOSURE | MERGER | TERM_SERVED |
DUES_PENALTIES | BANK_LIEN | RTGS_SANCTION

ClearanceStatus:
PENDING | CLEAR | BLOCKED | NEEDS_INFO | SOURCE_UNAVAILABLE | NOT_APPLICABLE

ReleaseDecision:
RECOMMEND | CHECK | APPROVE | RETURN | REJECT

PledgeEdgeType:
PLEDGED_FOR | RENEWED_FROM | SAME_NUMBER | SAME_HASH | SAME_ACCOUNT | SAME_SIGNATORY

AlertType:
RENEWAL_DUE | MATURITY_DUE | OVERDUE | BANK_RECHECK | RELEASE_BLOCKED | ESCALATION

AuditEntityType:
INSTITUTION | PROGRAMME | INSTRUMENT | DOCUMENT | FINDING | REQUIREMENT |
OBLIGATION | RELEASE_REQUEST | CLEARANCE | USER | SETTING
```

### 2.5 Source labels

Every external or derived value must carry one of:

```text
DECLARED | DOCUMENT | BANK | SYSTEM | OFFICER | MOCK | SANDBOX | ESTIMATE
```

If a UI or report shows a value without one of these, it is a bug.

---

## 3. Policy source of truth

### 3.1 Rule packs

| Pack ID | Academic year | Role |
|---|---|---|
| `APH_2024_27_BASE` | 2024-25 to 2026-27 | Base APH Table 1.4 and clauses |
| `APH_2026_27_ADDENDUM` | 2026-27 | Addendum overlay: 50% concession, leased wording, RPGF release |

The exact official effective date of the addendum is an open question. Do not invent a date. The prototype selects by `academic_year` and overlay pack, not by a fabricated timestamp.

Every rule row must include:

```text
id, pack_id, rule_key, clause, description, rule_type, payload_json,
source_excerpt, source_url, effective_from (nullable), effective_to (nullable),
status: ACTIVE | DRAFT | BLOCKED
```

### 3.2 Table 1.4

Amounts are ₹ lakh in the source; convert to paise in code.

| Programme | Diploma/Post Diploma | UG | PG Diploma/PG Degree |
|---|---:|---:|---:|
| ENGINEERING | 15 | 35 | 15 |
| PLANNING | 15 | 15 | 15 |
| APPLIED_ARTS | 15 | 15 | 15 |
| DESIGN | 15 | 15 | 15 |
| HMCT | 15 | 15 | 15 |
| COMPUTER_APPLICATIONS | — | 5 | 15 |
| MANAGEMENT | — | 5 | 15 |

`—` means not applicable; reject the combination with `POLICY_COMBINATION_INVALID`.

### 3.3 Requirement algorithm

Order matters:

```text
base = table_1_4[programme][level]
if concession applies:
    base = base * 0.50
if building_ownership == LEASED:
    base = base * 2.00
if exemption applies:
    required = 0
else:
    required = max(0, base - eligible_existing_credit)
```

Concession applies when:

```text
location_category in {NE, JK, LADAKH, ASPIRATIONAL, AN, LAKSHADWEEP}
OR institution_type in {WOMEN_ONLY, PWD_ONLY}
```

The trace must show every step, the input values, the clause, and the pack.

### 3.4 Exemptions

| Case | Result | Clause |
|---|---|---|
| Government / Government-aided | exempt | APH 1.12 / 4.10(a) |
| Central / State / Government Deemed University | exempt | 4.10(a) |
| Existing institution under 1.3.3 for more than 5 years with regulatory bodies | exempt | 1.12(i) |
| Private University / Private Deemed University more than 10 years with UGC | exempt | 4.10(b) |
| NOC already issued for earlier FDR release | no new deposit | 1.12(iii) |
| University starts a new programme/level | **not exempt** for that programme/level | 4.10(c) |

Do not treat “existing college” as a blanket exemption. `application_category` and years must be explicit.

### 3.5 Ten-year hold and interest

- Deposit remains with AICTE for 10 years.
- Interest is retained by AICTE.
- Only principal is refundable.
- Track `hold_start_date`, `hold_end_date`, `principal_paise`, `interest_rate`, and `interest_retained` separately.
- Never include interest in the release amount.
- Extension/forfeiture is a human decision; do not compute it automatically.

### 3.6 Penalty engine

All penalties are advisory calculations until a human approves.

| Rule key | Situation | Calculation | Source |
|---|---|---|---|
| `PENALTY_LATE_10` | Late deposit up to 31 May | 10% of required deposit | 2.25(f) |
| `PENALTY_LATE_20` | Late deposit up to 31 July | 20% of required deposit | 2.25(f) |
| `PENALTY_WITHDRAWAL` | Beyond 31 July | Recommend approval withdrawal | 2.25(f) |
| `PENALTY_EARLY_ENCASH` | FDR encashed before maturity / not deposited at LoA | 10% of FDR value | 7.7 |
| `PENALTY_CLOSURE_10` | Closure release | 10% of deposit | 2.21(h) |
| `PENALTY_CLOSURE_50` | No EoA for preceding 6 years and AICTE closes | 50% of deposit | 2.21(i) |
| `PENALTY_MANUAL` | Extension / forfeiture | Competent-authority discretion | 1.12(v) |

### 3.7 Release rules

Official Clause 6.46 nodes:

```text
DOCUMENTS
PGRC
VIGILANCE
GRANTS
FINANCIAL_EMBEZZLEMENT       (conditional)
COMPLAINTS_DISCIPLINARY      (conditional: converted university)
PROGRESSIVE_CLOSURE           (conditional, and not needed if matured)
MERGER                        (conditional)
RTGS_SANCTION                 (only for RTGS)
```

System-level controls, clearly labelled:

```text
TERM_SERVED
DUES_PENALTIES
BANK_LIEN
```

Do **not** add DTE NOC, anti-ragging, faculty salary, zero-arrears, or a universal “zero complaints” node as APH 6.46 requirements.

### 3.8 Joint deposit wording

If the UI or seed data describes the joint FDR, use:

> “FDR/deposit in the joint name of the Secretary of the Trust/Society/Company and AICTE.”

Do not use “Trust Chairman + Regional Officer.” That wording is not supported by Affidavit 6.

### 3.9 Official circular

The AICTE circular titled “Release of FDR / Security Deposit Upon Completion of Maturity Period -reg” is `[UNVERIFIED]` until the official PDF is downloaded. Do not quote its instructions as verified. The prototype can support the pain point without citing it as a rule.

---

## 4. Database contract

### 4.1 Schema rules

- Postgres 16.
- Use `timestamptz` for timestamps.
- Use `date` for date-only values.
- Use `bigint` paise for money.
- Add `created_at` and `updated_at` to mutable tables.
- Use foreign keys with explicit `ON DELETE RESTRICT`.
- Use `check` constraints for enum-like text columns.
- Index every foreign key and every common filter: `institution_id`, `instrument_id`, `status`, `maturity_date`, `due_date`, `sha256`, `instrument_number`, `event_type`, `created_at`.
- `audit_events` is append-only. The application role has `INSERT` and `SELECT`, not `UPDATE` or `DELETE`.

### 4.2 DDL

```sql
create extension if not exists "pgcrypto";

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  display_name text not null,
  role text not null check (role in (
    'INSTITUTION_USER','DEALING_OFFICER','DIRECTOR_RB',
    'COMPETENT_AUTHORITY','ACCOUNTS','AUDITOR','ADMIN'
  )),
  region_code text,
  institution_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table institutions (
  id uuid primary key default gen_random_uuid(),
  aicte_permanent_id text not null unique,
  name text not null,
  trust_name text not null,
  region_code text not null,
  state_code text not null,
  district text not null,
  location_category text not null check (location_category in (
    'NE','JK','LADAKH','ASPIRATIONAL','AN','LAKSHADWEEP','OTHER'
  )),
  institution_type text not null check (institution_type in (
    'CO_ED','WOMEN_ONLY','PWD_ONLY'
  )),
  building_ownership text not null check (building_ownership in ('OWNED','LEASED')),
  university_type text not null check (university_type in (
    'AFFILIATED','PRIVATE_UNIVERSITY','DEEMED','GOVERNMENT'
  )),
  application_category text not null check (application_category in (
    'NEW','EXISTING_1_3_3','NEW_LEVEL_PROGRAMME','UNIVERSITY_NEW_PROGRAMME','OTHER'
  )),
  established_year integer not null,
  regulatory_years integer not null default 0,
  ugc_years integer not null default 0,
  prior_release_noc boolean not null default false,
  approval_status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table users
  add constraint users_institution_fk
  foreign key (institution_id) references institutions(id);

create table programmes (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id),
  programme text not null check (programme in (
    'ENGINEERING','PLANNING','APPLIED_ARTS','DESIGN','HMCT',
    'COMPUTER_APPLICATIONS','MANAGEMENT'
  )),
  level text not null check (level in ('DIPLOMA','UG','PG')),
  approved_intake integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table policy_packs (
  id text primary key,
  label text not null,
  academic_year text not null,
  source_url text not null,
  effective_from date,
  effective_to date,
  status text not null check (status in ('ACTIVE','DRAFT','BLOCKED'))
);

create table policy_rules (
  id uuid primary key default gen_random_uuid(),
  pack_id text not null references policy_packs(id),
  rule_key text not null,
  clause text not null,
  description text not null,
  rule_type text not null,
  payload_json jsonb not null default '{}'::jsonb,
  source_excerpt text not null,
  source_url text not null,
  effective_from date,
  effective_to date,
  status text not null check (status in ('ACTIVE','DRAFT','BLOCKED')),
  unique (pack_id, rule_key)
);

create table requirements (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id),
  programme_id uuid references programmes(id),
  level text not null check (level in ('DIPLOMA','UG','PG')),
  pack_id text not null references policy_packs(id),
  base_amount_paise bigint not null,
  concession_factor numeric(5,4) not null default 1.0000,
  leased_multiplier numeric(4,2) not null default 1.00,
  exemption_applied boolean not null default false,
  exemption_reason text,
  existing_credit_paise bigint not null default 0,
  required_amount_paise bigint not null,
  trace_json jsonb not null,
  computed_at timestamptz not null default now()
);

create table instruments (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id),
  programme_id uuid references programmes(id),
  type text not null check (type in ('FDR','RTGS','RPGF','BG')),
  instrument_number text not null,
  bank_name text not null,
  branch text not null,
  ifsc text not null,
  amount_paise bigint not null check (amount_paise > 0),
  issue_date date not null,
  maturity_date date not null,
  tenure_months integer not null,
  interest_rate numeric(5,2),
  depositor_name text not null,
  lien_in_favour text not null,
  status text not null check (status in (
    'DRAFT','SUBMITTED','UNDER_SCRUTINY','QUERY_RAISED','VERIFIED','ACTIVE',
    'EXPIRING','MATURED','RENEWAL_DUE','RENEWED','REPLACED','RELEASE_REQUESTED',
    'CLEARANCES_PENDING','APPROVED','RELEASED','DISCHARGED','CLOSED',
    'REJECTED','WITHDRAWN','FORFEITED'
  )),
  predecessor_id uuid references instruments(id),
  successor_id uuid references instruments(id),
  verification_status text not null default 'UNVERIFIED' check (verification_status in (
    'UNVERIFIED','DOCUMENT_CHECKED','OFFICER_VERIFIED','BANK_CONFIRMED',
    'DISCREPANT','SOURCE_UNAVAILABLE'
  )),
  officer_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (institution_id, instrument_number)
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  instrument_id uuid references instruments(id),
  release_request_id uuid,
  type text not null,
  file_name text not null,
  sha256 char(64) not null,
  storage_key text not null,
  encryption_meta jsonb not null default '{}'::jsonb,
  mime_type text not null,
  size_bytes bigint not null,
  uploaded_by uuid not null references users(id),
  uploaded_at timestamptz not null default now(),
  version integer not null default 1,
  ocr_status text not null default 'PENDING' check (ocr_status in (
    'PENDING','TEXT_LAYER','OCR_DONE','NEEDS_REVIEW','FAILED'
  ))
);

create index documents_sha256_idx on documents(sha256);
create index documents_instrument_idx on documents(instrument_id);
create index documents_release_idx on documents(release_request_id);

create table provenance_fields (
  id uuid primary key default gen_random_uuid(),
  instrument_id uuid not null references instruments(id),
  field_name text not null,
  declared_value text,
  document_value text,
  bank_value text,
  document_confidence numeric(5,4),
  document_page integer,
  document_bbox jsonb,
  bank_source text,
  bank_reference text,
  bank_timestamp timestamptz,
  status text not null check (status in (
    'MATCH','MISMATCH','MISSING_DOCUMENT','MISSING_BANK','LOW_CONFIDENCE'
  )),
  created_at timestamptz not null default now(),
  unique (instrument_id, field_name)
);

create table findings (
  id uuid primary key default gen_random_uuid(),
  instrument_id uuid not null references instruments(id),
  rule_id text not null,
  severity text not null check (severity in ('CRITICAL','SERIOUS','WARNING')),
  field_name text,
  reason text not null,
  evidence_json jsonb not null default '{}'::jsonb,
  suggested_action text not null,
  disposition text not null default 'OPEN' check (disposition in (
    'OPEN','ACCEPTED','WAIVED','RESOLVED'
  )),
  disposition_reason text,
  actor_id uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table obligations (
  id uuid primary key default gen_random_uuid(),
  instrument_id uuid not null references instruments(id),
  institution_id uuid not null references institutions(id),
  type text not null check (type in (
    'RENEWAL','RELEASE_CLEARANCE','UNDERTAKING','BANK_RECHECK'
  )),
  due_date date not null,
  status text not null default 'OPEN' check (status in (
    'OPEN','DONE','OVERDUE','CANCELLED'
  )),
  escalation_level integer not null default 0,
  owner_id uuid references users(id),
  fingerprint text not null unique,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table release_requests (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id),
  instrument_id uuid not null references instruments(id),
  request_type text not null check (request_type in (
    'MATURITY','EARLY','CLOSURE','PROGRESSIVE_CLOSURE','MERGER'
  )),
  financial_embezzlement_flag boolean not null default false,
  requested_by uuid not null references users(id),
  requested_at timestamptz not null default now(),
  status text not null default 'DRAFT' check (status in (
    'DRAFT','SUBMITTED','ELIGIBILITY_CHECK','BLOCKED','NEEDS_INFO',
    'PENDING_SOURCE','ELIGIBLE','MAKER_RECOMMENDED','CHECKER_APPROVED',
    'CA_APPROVED','NOC_ISSUED','SANCTION_ISSUED','RELEASED','REJECTED','WITHDRAWN'
  )),
  eligibility_result text check (eligibility_result in (
    'ELIGIBLE','BLOCKED','NEEDS_INFO','PENDING_SOURCE'
  )),
  decision text,
  decided_by uuid references users(id),
  decided_at timestamptz,
  noc_number text,
  sanction_order_number text,
  notes text
);

alter table documents
  add constraint documents_release_fk
  foreign key (release_request_id) references release_requests(id);

create table clearances (
  id uuid primary key default gen_random_uuid(),
  release_request_id uuid not null references release_requests(id),
  type text not null check (type in (
    'DOCUMENTS','PROVENANCE','PGRC','VIGILANCE','GRANTS','FINANCIAL_EMBEZZLEMENT',
    'COMPLAINTS_DISCIPLINARY','PROGRESSIVE_CLOSURE','MERGER','TERM_SERVED',
    'DUES_PENALTIES','BANK_LIEN','RTGS_SANCTION'
  )),
  status text not null default 'PENDING' check (status in (
    'PENDING','CLEAR','BLOCKED','NEEDS_INFO','SOURCE_UNAVAILABLE','NOT_APPLICABLE'
  )),
  source text not null default 'MOCK',
  reference text,
  verified_by uuid references users(id),
  verified_at timestamptz,
  notes text,
  is_official boolean not null default true,
  required boolean not null default true,
  unique (release_request_id, type)
);

create table bank_verifications (
  id uuid primary key default gen_random_uuid(),
  instrument_id uuid not null references instruments(id),
  status text not null check (status in (
    'FOUND','NOT_FOUND','ENCASHED','CLOSED','UNSUPPORTED','SOURCE_UNAVAILABLE'
  )),
  record_json jsonb not null default '{}'::jsonb,
  source text not null,
  reference text,
  timestamp timestamptz not null default now(),
  confidence numeric(5,4),
  mode text not null check (mode in ('API','LETTER','SANDBOX')),
  officer_verified_by uuid references users(id),
  officer_verified_at timestamptz,
  written_reason text
);

create table pledge_edges (
  id uuid primary key default gen_random_uuid(),
  from_instrument_id uuid not null references instruments(id),
  to_entity_type text not null check (to_entity_type in (
    'INSTITUTION','APPROVAL','BANK','DOCUMENT','SIGNATORY'
  )),
  to_entity_id text not null,
  edge_type text not null check (edge_type in (
    'PLEDGED_FOR','RENEWED_FROM','SAME_NUMBER','SAME_HASH',
    'SAME_ACCOUNT','SAME_SIGNATORY'
  )),
  confidence numeric(5,4) not null default 1.0,
  evidence_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table alerts (
  id uuid primary key default gen_random_uuid(),
  instrument_id uuid not null references instruments(id),
  type text not null check (type in (
    'RENEWAL_DUE','MATURITY_DUE','OVERDUE','BANK_RECHECK',
    'RELEASE_BLOCKED','ESCALATION'
  )),
  severity text not null check (severity in ('INFO','WARNING','CRITICAL')),
  due_date date not null,
  escalation_level integer not null default 0,
  status text not null default 'OPEN' check (status in (
    'OPEN','ACKNOWLEDGED','RESOLVED','CANCELLED'
  )),
  fingerprint text not null unique,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table audit_events (
  seq bigserial primary key,
  event_type text not null,
  actor_id uuid references users(id),
  actor_role text,
  entity_type text not null,
  entity_id text not null,
  payload_json jsonb not null,
  prev_hash char(64) not null,
  hash char(64) not null,
  created_at timestamptz not null default now()
);

create index audit_entity_idx on audit_events(entity_type, entity_id);
create index audit_created_idx on audit_events(created_at);
create index instruments_maturity_idx on instruments(maturity_date);
create index instruments_status_idx on instruments(status);
create index obligations_due_idx on obligations(due_date, status);
create index alerts_status_idx on alerts(status, severity);
create index clearances_request_idx on clearances(release_request_id);

create table system_settings (
  key text primary key,
  value_json jsonb not null,
  updated_at timestamptz not null default now()
);
```

### 4.3 Seed datasets

The backend must expose a deterministic seed command:

```bash
python scripts/seed.py --dataset demo_v1 --reset
```

`demo_v1` creates:

| Entity | Purpose |
|---|---|
| Sanjeevani Institute of Technology (`1-12345678`) | Hero case, leased engineering UG, ₹70L, amount mismatch |
| Northstar Women’s Institute of Technology | Contrast, Nagaland women-only, owned, ₹17.5L |
| Doon Technical Campus | Fraud case, duplicate instrument number/hash |
| Bank sandbox records | Found/not found/encashed/closed fixtures |
| Policy packs/rules | Base and addendum |
| Users | One per role, synthetic passwords in dev only |

**Data/QA owns the exact fixture values.** Backend must not hard-code them in services.

---

## 5. API contract

### 5.1 Auth

```http
POST /api/v1/auth/login
Content-Type: application/json

{"email":"officer@example.test","password":"demo-password"}
```

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "officer@example.test",
    "display_name": "Demo Officer",
    "role": "DEALING_OFFICER",
    "region_code": "WEST",
    "institution_id": null
  }
}
```

`GET /api/v1/me` returns the same `user`.

JWT claims: `sub`, `role`, `region_code`, `institution_id`, `exp`, `iat`.

### 5.2 Institutions

```http
GET /api/v1/institutions?q=&region=&limit=50&offset=0
GET /api/v1/institutions/{id}
POST /api/v1/institutions
PATCH /api/v1/institutions/{id}
GET /api/v1/institutions/{id}/requirements?programme_id={uuid}&academic_year=2026-27
```

`GET /institutions/{id}/requirements` response:

```json
{
  "institution_id": "uuid",
  "programme_id": "uuid",
  "level": "UG",
  "pack_id": "APH_2026_27_ADDENDUM",
  "base_amount_paise": 350000000,
  "concession_factor": "0.5000",
  "leased_multiplier": "2.00",
  "exemption_applied": false,
  "existing_credit_paise": 0,
  "required_amount_paise": 350000000,
  "required_amount_display": "₹35,00,000",
  "trace": [
    {"step": "base", "label": "Table 1.4: Engineering UG", "clause": "APH Table 1.4", "amount_paise": 350000000},
    {"step": "concession", "label": "NE / women-only concession", "clause": "Addendum 2026-27 Item 10", "factor": "0.50", "amount_paise": 175000000},
    {"step": "leased", "label": "Leased building/land multiplier", "clause": "Addendum 2026-27 Item 11", "factor": "2.00", "amount_paise": 350000000},
    {"step": "required", "label": "Required deposit", "amount_paise": 350000000}
  ],
  "computed_at": "2026-10-25T00:00:00Z"
}
```

### 5.3 Policy

```http
GET /api/v1/policy/packs
GET /api/v1/policy/packs/{pack_id}/rules
GET /api/v1/policy/diff?base=APH_2024_27_BASE&overlay=APH_2026_27_ADDENDUM
POST /api/v1/policy/calculate
```

`POST /policy/calculate` body:

```json
{
  "institution_id": "uuid",
  "programme_id": "uuid",
  "level": "UG",
  "academic_year": "2026-27",
  "existing_credit_paise": 0
}
```

It returns the same shape as the requirements response but does not persist. A persisted requirement is created when an instrument is submitted or when the officer clicks “Save calculation.”

### 5.4 Instruments and documents

```http
POST /api/v1/instruments
GET  /api/v1/instruments?status=&institution_id=&maturity_before=&region=&limit=50&offset=0
GET  /api/v1/instruments/{id}
POST /api/v1/instruments/{id}/documents
POST /api/v1/instruments/{id}/extract
POST /api/v1/instruments/{id}/verify-bank
GET  /api/v1/instruments/{id}/provenance
GET  /api/v1/instruments/{id}/lineage
POST /api/v1/instruments/{id}/renew
POST /api/v1/findings/{id}/disposition
```

`POST /instruments` body:

```json
{
  "institution_id": "uuid",
  "programme_id": "uuid",
  "type": "FDR",
  "instrument_number": "FDR-SIT-2016-001",
  "bank_name": "Bank of Maharashtra",
  "branch": "Pune Camp",
  "ifsc": "MAHB0000123",
  "amount_paise": 700000000,
  "issue_date": "2016-11-01",
  "maturity_date": "2026-11-01",
  "tenure_months": 120,
  "interest_rate": 6.5,
  "depositor_name": "Sanjeevani Education Trust",
  "lien_in_favour": "AICTE"
}
```

`POST /instruments/{id}/documents` is `multipart/form-data` with `file`, `type`, and optional `release_request_id`.

`POST /instruments/{id}/extract` response:

```json
{
  "instrument_id": "uuid",
  "document_id": "uuid",
  "ocr_status": "TEXT_LAYER",
  "fields": [
    {
      "field_name": "amount",
      "document_value": "7000000.00",
      "confidence": 0.98,
      "page": 1,
      "bbox": {"x": 0.12, "y": 0.34, "w": 0.31, "h": 0.05}
    }
  ]
}
```

`POST /instruments/{id}/verify-bank` body:

```json
{"mode": "SANDBOX"}
```

Response:

```json
{
  "instrument_id": "uuid",
  "status": "FOUND",
  "record": {
    "amount": "3500000.00",
    "issue_date": "2016-11-01",
    "maturity_date": "2026-11-01",
    "ifsc": "MAHB0000123",
    "branch": "Pune Camp",
    "depositor": "Sanjeevani Institute of Technology Trust",
    "lien": "AICTE"
  },
  "source": "SANDBOX",
  "reference": "SBX-2026-0001",
  "timestamp": "2026-10-25T00:00:00Z",
  "confidence": 1.0,
  "mode": "SANDBOX"
}
```

`GET /instruments/{id}/provenance` response:

```json
{
  "instrument_id": "uuid",
  "verification_status": "DISCREPANT",
  "fields": [
    {
      "field_name": "amount",
      "declared_value": "7000000.00",
      "document_value": "7000000.00",
      "bank_value": "3500000.00",
      "status": "MISMATCH",
      "document_confidence": 0.98,
      "document_page": 1,
      "document_bbox": {"x": 0.12, "y": 0.34, "w": 0.31, "h": 0.05},
      "bank_source": "SANDBOX",
      "bank_reference": "SBX-2026-0001",
      "bank_timestamp": "2026-10-25T00:00:00Z"
    }
  ],
  "findings": [
    {
      "id": "uuid",
      "rule_id": "AMOUNT_MISMATCH",
      "severity": "CRITICAL",
      "reason": "Declared/document amount ₹70,00,000; bank amount ₹35,00,000.",
      "suggested_action": "Raise query and obtain a corrected FDR or bank confirmation.",
      "disposition": "OPEN",
      "evidence_json": {"page": 1, "bbox": {"x": 0.12, "y": 0.34, "w": 0.31, "h": 0.05}}
    }
  ]
}
```

`POST /findings/{id}/disposition` body:

```json
{"disposition": "WAIVED", "reason": "Bank corrected its record; fresh letter attached."}
```

Critical findings may be waived only by `DIRECTOR_RB`, `COMPETENT_AUTHORITY`, or `ADMIN`, with a reason. If the waiver is supported by a fresh bank letter, record `OFFICER_VERIFIED`, never `BANK_CONFIRMED`; the original bank sandbox value and finding remain in history.

### 5.5 Release requests

```http
POST /api/v1/release-requests
GET  /api/v1/release-requests?status=&institution_id=&limit=50&offset=0
GET  /api/v1/release-requests/{id}
GET  /api/v1/release-requests/{id}/eligibility
PUT  /api/v1/release-requests/{id}/clearances/{type}
POST /api/v1/release-requests/{id}/decision
GET  /api/v1/release-requests/{id}/decision-document
```

`POST /release-requests` body:

```json
{
  "instrument_id": "uuid",
  "request_type": "MATURITY",
  "financial_embezzlement_flag": false,
  "notes": "Release requested after the 10-year term."
}
```

On create, in one transaction:

1. set the instrument status to `RELEASE_REQUESTED`;
2. create the request with status `ELIGIBILITY_CHECK`;
3. build the required clearance nodes from §6.5;
4. evaluate the graph;
5. persist `eligibility_result` and set the request status to the result (`ELIGIBLE`, `BLOCKED`, `NEEDS_INFO`, or `PENDING_SOURCE`);
6. emit `RELEASE_REQUESTED` and `ELIGIBILITY_EVALUATED` audit events.

Every clearance change re-evaluates the graph and updates the request status to the new result. `DOCUMENTS`, `PROVENANCE`, `TERM_SERVED`, `DUES_PENALTIES`, and `BANK_LIEN` are system-owned nodes and cannot be manually cleared. `PROVENANCE` is set from critical-finding dispositions; `TERM_SERVED` is `PENDING` until the demo clock reaches the instrument's `hold_end_date`, then becomes `CLEAR` and triggers re-evaluation.

`GET /release-requests/{id}/eligibility` response:

```json
{
  "release_request_id": "uuid",
  "result": "BLOCKED",
  "instrument_id": "uuid",
  "request_type": "MATURITY",
  "nodes": [
    {"type": "DOCUMENTS", "status": "CLEAR", "is_official": true, "required": true, "source": "SYSTEM", "reference": "DOC-SET-OK"},
    {"type": "PROVENANCE", "status": "BLOCKED", "is_official": false, "required": true, "source": "SYSTEM", "reference": "OPEN-CRITICAL"},
    {"type": "PGRC", "status": "PENDING", "is_official": true, "required": true, "source": "MOCK", "reference": null},
    {"type": "VIGILANCE", "status": "PENDING", "is_official": true, "required": true, "source": "MOCK", "reference": null},
    {"type": "GRANTS", "status": "CLEAR", "is_official": true, "required": true, "source": "MOCK", "reference": "GRANTS/2026/77"},
    {"type": "FINANCIAL_EMBEZZLEMENT", "status": "NOT_APPLICABLE", "is_official": true, "required": false, "source": "SYSTEM", "reference": null},
    {"type": "COMPLAINTS_DISCIPLINARY", "status": "NOT_APPLICABLE", "is_official": true, "required": false, "source": "SYSTEM", "reference": null},
    {"type": "PROGRESSIVE_CLOSURE", "status": "NOT_APPLICABLE", "is_official": true, "required": false, "source": "SYSTEM", "reference": null},
    {"type": "MERGER", "status": "NOT_APPLICABLE", "is_official": true, "required": false, "source": "SYSTEM", "reference": null},
    {"type": "RTGS_SANCTION", "status": "NOT_APPLICABLE", "is_official": true, "required": false, "source": "SYSTEM", "reference": null},
    {"type": "TERM_SERVED", "status": "PENDING", "is_official": false, "required": true, "source": "SYSTEM", "reference": "10Y-CLOCK"},
    {"type": "DUES_PENALTIES", "status": "CLEAR", "is_official": false, "required": true, "source": "SYSTEM", "reference": "NO-DUES"},
    {"type": "BANK_LIEN", "status": "CLEAR", "is_official": false, "required": true, "source": "SANDBOX", "reference": "SBX-2026-0001"}
  ],
  "blockers": ["PROVENANCE", "PGRC", "VIGILANCE", "TERM_SERVED"],
  "evaluated_at": "2026-10-25T00:00:00Z"
}
```

`PUT /release-requests/{id}/clearances/{type}` body:

```json
{
  "status": "CLEAR",
  "reference": "PGRC/2026/0912",
  "source": "MOCK",
  "notes": "No pending complaint."
}
```

`POST /release-requests/{id}/decision` body:

```json
{"action": "RECOMMEND", "notes": "Documents and clearances verified."}
```

Rules:

- `RECOMMEND` requires `DEALING_OFFICER` or `DIRECTOR_RB`; status becomes `MAKER_RECOMMENDED`.
- `CHECK` requires `DIRECTOR_RB`; actor must not be the maker; status becomes `CHECKER_APPROVED`.
- `APPROVE` requires `COMPETENT_AUTHORITY`; status becomes `CA_APPROVED`; then the system issues NOC/sanction.
- `RETURN` returns to `NEEDS_INFO` with reason.
- `REJECT` sets `REJECTED`.
- If eligibility is not `ELIGIBLE`, `APPROVE` returns HTTP 422 `RELEASE_BLOCKED`.
- FDR/RPGF/BG: `noc_number`; RTGS: `sanction_order_number`.
- Every decision emits an audit event.

### 5.6 Dashboards, graphs, reports, audit

```http
GET  /api/v1/dashboard/portfolio?region=&programme=
GET  /api/v1/dashboard/forecast?from=2026-10-01&to=2027-12-31&bucket=quarter
GET  /api/v1/graph/pledges?institution_id=
GET  /api/v1/reports/{type}?format=json|csv
GET  /api/v1/audit?entity_type=&entity_id=&limit=100&offset=0
GET  /api/v1/audit/verify
POST /api/v1/admin/time-machine
GET  /api/v1/health
GET  /api/v1/meta/enums
```

`GET /dashboard/portfolio` response:

```json
{
  "kpis": {
    "active_instruments": 42,
    "amount_held_paise": 18750000000,
    "amount_at_risk_paise": 700000000,
    "expiring_90d": 5,
    "pending_release": 3,
    "pending_verification": 7
  },
  "maturity_buckets": [
    {"bucket": "2026-Q4", "amount_paise": 3500000000, "count": 5}
  ],
  "at_risk": [
    {"instrument_id": "uuid", "instrument_number": "FDR-SIT-2016-001", "institution_name": "Sanjeevani Institute of Technology", "severity": "CRITICAL", "reason": "Amount mismatch", "amount_paise": 700000000}
  ],
  "recent_activity": []
}
```

`GET /dashboard/forecast` response:

```json
{
  "label": "ESTIMATE",
  "buckets": [
    {"bucket": "2026-Q4", "maturing_paise": 3500000000, "renewals_paise": 0, "releases_paise": 0, "unresolved_paise": 700000000}
  ],
  "at_risk_paise": 700000000
}
```

`GET /graph/pledges` response:

```json
{
  "nodes": [
    {"id": "inst:uuid", "type": "INSTITUTION", "label": "Sanjeevani Institute of Technology"},
    {"id": "instrument:uuid", "type": "INSTRUMENT", "label": "FDR-SIT-2016-001"}
  ],
  "edges": [
    {"id": "edge:uuid", "from": "instrument:uuid", "to": "institution:other-uuid", "type": "SAME_NUMBER", "label": "Duplicate instrument number", "confidence": 1.0}
  ]
}
```

`POST /admin/time-machine` body:

```json
{"target_date": "2026-11-01", "reason": "Demo maturity"}
```

Only `ADMIN` or `DIRECTOR_RB`; writes an audit event; never mutates the database dates themselves.

### 5.7 Error shape

```json
{
  "error": {
    "code": "RELEASE_BLOCKED",
    "message": "Release cannot be approved until the required clearances, the 10-year term, and the critical-discrepancy check are satisfied.",
    "details": {"blockers": ["PROVENANCE", "PGRC", "VIGILANCE", "TERM_SERVED"]},
    "trace_id": "req_01J..."
  }
}
```

Canonical codes:

```text
AUTH_INVALID
AUTH_EXPIRED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
STATE_CONFLICT
RELEASE_BLOCKED
DUPLICATE_INSTRUMENT
DUPLICATE_FILE
POLICY_COMBINATION_INVALID
POLICY_AMBIGUOUS
SOURCE_UNAVAILABLE
BANK_NOT_FOUND
AUDIT_CHAIN_BROKEN
RATE_LIMITED
```

---

## 6. Domain algorithms and workflows

### 6.1 Requirement calculation

```python
def calculate_requirement(inst, programme, level, academic_year, existing_credit_paise=0):
    pack = select_pack(academic_year)
    base = table_1_4(programme, level) * LAKH_IN_PAISE
    trace = [step("base", base, "APH Table 1.4")]

    concession = (
        inst.location_category in CONCESSION_LOCATIONS
        or inst.institution_type in {"WOMEN_ONLY", "PWD_ONLY"}
    )
    factor = Decimal("0.50") if concession else Decimal("1.00")
    if concession:
        base = int(Decimal(base) * factor)
        trace.append(step("concession", base, "Addendum 2026-27 Item 10", factor))

    leased_factor = Decimal("2.00") if inst.building_ownership == "LEASED" else Decimal("1.00")
    if leased_factor != 1:
        base = int(Decimal(base) * leased_factor)
        trace.append(step("leased", base, "Addendum 2026-27 Item 11", leased_factor))

    exempt, reason = exemption_for(inst, programme, level)
    if exempt:
        trace.append(step("exemption", 0, reason))
        required = 0
    else:
        required = max(0, base - existing_credit_paise)
        trace.append(step("required", required, "Computed requirement"))

    return required, trace
```

`exemption_for`:

```text
GOVERNMENT university_type -> exempt
PRIVATE_UNIVERSITY or DEEMED and ugc_years > 10 and application_category != NEW_LEVEL_PROGRAMME and != UNIVERSITY_NEW_PROGRAMME -> exempt
EXISTING_1_3_3 and regulatory_years > 5 -> exempt
prior_release_noc -> no new deposit
otherwise -> not exempt
```

Rules:

- `application_category` controls the “new programme/level” exception.
- If the institution is both government and new programme, follow 4.10(c) only if the clause applies to universities; for the prototype, show the ambiguity and route to review.
- Never round intermediate values; round only for display.
- All thresholds and factors come from `policy_rules`, not hard-coded service constants, except the enum values.

### 6.2 Instrument state machine

Allowed transitions:

```text
DRAFT -> SUBMITTED | WITHDRAWN
SUBMITTED -> UNDER_SCRUTINY | REJECTED
UNDER_SCRUTINY -> QUERY_RAISED | VERIFIED | REJECTED
QUERY_RAISED -> UNDER_SCRUTINY | WITHDRAWN
VERIFIED -> ACTIVE | MATURED
ACTIVE -> EXPIRING | MATURED | RELEASE_REQUESTED
EXPIRING -> MATURED | RENEWAL_DUE | RELEASE_REQUESTED
MATURED -> RENEWAL_DUE | RELEASE_REQUESTED | RELEASED
RENEWAL_DUE -> RENEWED | REPLACED | RELEASE_REQUESTED
RENEWED -> ACTIVE
REPLACED -> ACTIVE
RELEASE_REQUESTED -> CLEARANCES_PENDING | WITHDRAWN
CLEARANCES_PENDING -> APPROVED | NEEDS_INFO | BLOCKED
APPROVED -> RELEASED | DISCHARGED
RELEASED -> CLOSED
DISCHARGED -> CLOSED
```

Side exits: `REJECTED`, `WITHDRAWN`, `FORFEITED` (forfeiture only by `COMPETENT_AUTHORITY`).

Every transition checks role and emits audit.

### 6.3 Document intake and provenance

Upload:

1. stream file to a temporary path;
2. compute SHA-256;
3. reject if `sha256` already exists for another instrument with a critical duplicate finding;
4. encrypt with AES-256-GCM using a per-file data key wrapped by `DOCUMENT_MASTER_KEY`;
5. store ciphertext and metadata;
6. persist document row;
7. emit `DOCUMENT_UPLOADED`.

Extraction:

1. try PDF text layer;
2. fallback to Tesseract;
3. if both fail, `NEEDS_REVIEW`;
4. extract only these fields: `amount`, `instrument_number`, `issue_date`, `maturity_date`, `bank_name`, `branch`, `ifsc`, `depositor`, `lien`.
5. store values and evidence; never overwrite the document.

Comparison rules:

| Rule ID | Field | Severity | Condition |
|---|---|---|---|
| `AMOUNT_MISMATCH` | amount | CRITICAL | declared/document/bank differ |
| `NUMBER_MISMATCH` | instrument_number | CRITICAL | values differ |
| `DATE_MISMATCH` | issue/maturity | SERIOUS | values differ |
| `BANK_MISMATCH` | bank/branch/ifsc | SERIOUS | values differ |
| `DEPOSITOR_MISMATCH` | depositor | SERIOUS | not trust/society/company |
| `LIEN_MISSING` | lien | CRITICAL | not in favour of AICTE |
| `TENURE_SHORT` | maturity/tenure | SERIOUS | < required 10 years unless policy exception |
| `DUPLICATE_NUMBER` | instrument_number | CRITICAL | same number across institutions |
| `DUPLICATE_HASH` | document | CRITICAL | same file hash across instruments |
| `MISSING_DOCUMENT` | document set | WARNING | required document absent |
| `BANK_NOT_FOUND` | bank | CRITICAL | bank says not found/encashed/closed |

Duplicate findings attach to the incoming/later instrument, not the original: Doon is blocked by the SIT duplicate; SIT remains the legitimate holder and is not blocked solely because a copy exists. The pledge graph still links both.

A finding is not a verdict. It has evidence, suggested action, disposition, and an audit trail. Disposition of a `CRITICAL` finding re-evaluates the `PROVENANCE` node of any open release request for that instrument.

### 6.4 Bank adapter

Interface:

```python
class BankVerifier(Protocol):
    def verify(self, instrument: Instrument, mode: str) -> BankVerificationResult: ...
```

Modes:

- `API`: authorized integration (not in prototype);
- `LETTER`: officer uploads a bank letter and records verified fields;
- `SANDBOX`: deterministic fixture keyed by instrument number.

Rules:

- `SOURCE_UNAVAILABLE` and `NOT_FOUND` never auto-reject.
- `BANK_CONFIRMED` is set only by an authorized bank API response.
- `OFFICER_VERIFIED` is the correct label for a bank letter or officer-recorded confirmation, including a Director/CA waiver.
- Re-verify at most every 30 days; each check creates a `bank_verifications` row and an audit event.
- Do not expose real bank data; all sandbox values are synthetic.

### 6.5 Release graph

Build required nodes by request type:

```text
Always official: DOCUMENTS, PGRC, VIGILANCE, GRANTS
financial_embezzlement_flag: FINANCIAL_EMBEZZLEMENT
institution is converted university: COMPLAINTS_DISCIPLINARY
request_type PROGRESSIVE_CLOSURE and not matured: PROGRESSIVE_CLOSURE
request_type MERGER: MERGER
instrument.type RTGS: RTGS_SANCTION
Always system: PROVENANCE, TERM_SERVED, DUES_PENALTIES, BANK_LIEN
```

`PROVENANCE` is a system check, not an APH Clause 6.46 clearance. It is `CLEAR` only when there is no `CRITICAL` finding with disposition `OPEN` or `ACCEPTED`; `WAIVED` and `RESOLVED` count as satisfied. Critical waiver remains role-gated and reason-required.

`DOCUMENTS` is clear only when the release document set is complete: application, Affidavit 6, FDR/RPGF proof or RTGS payment proof, latest LoA/EoA.

Evaluation order:

```text
if any required node is BLOCKED -> BLOCKED
else if any required node is NEEDS_INFO -> NEEDS_INFO
else if any required node is SOURCE_UNAVAILABLE -> PENDING_SOURCE
else if any required node is PENDING -> BLOCKED
else -> ELIGIBLE
```

A node is required if `required=true`; `NOT_APPLICABLE` is treated as satisfied.

Maker/checker/approver:

- Maker: `DEALING_OFFICER` or `DIRECTOR_RB`; cannot be the same user as checker/approver.
- Checker: `DIRECTOR_RB`.
- Approver: `COMPETENT_AUTHORITY`.
- Segregation is enforced server-side, not just hidden in UI.

### 6.6 Pledge graph

Build edges on create/update/renew:

- `PLEDGED_FOR` instrument → institution/approval.
- `RENEWED_FROM` successor → predecessor.
- `SAME_NUMBER` instrument → instrument with same normalized number.
- `SAME_HASH` document → document with same SHA-256.
- `SAME_ACCOUNT` instrument → instrument with same refund account (if captured).
- `SAME_SIGNATORY` instrument → instrument with same depositor/signatory.

Detection queries:

1. duplicate instrument number across institutions;
2. duplicate file hash across instruments;
3. one instrument pledged to more than one institution/approval;
4. maturity arithmetic inconsistent with issue date + tenure;
5. bank/IFSC mismatch between declared and bank record;
6. post-acceptance encashment.

Output must be explainable: edge type, evidence, confidence, affected institutions.

### 6.7 Alerts and time machine

Daily idempotent job, using the demo clock:

- T-90/60/30/15/7/0 maturity/renewal reminders while the instrument is `ACTIVE`, `EXPIRING`, `RELEASE_REQUESTED`, or `RENEWAL_DUE`; stop after `RELEASED`/`CLOSED`.
- Overdue notice every 7 days after maturity for instruments not yet released/closed.
- Escalation: day 1 L1 dealing officer, day 15 L2 Director, day 30 L3 Competent Authority.
- Bank re-check every 30 days.
- Auto-resolve alerts when the underlying condition clears.

Fingerprint:

```text
instrument:{instrument_id}:{alert_type}:{due_date}:{escalation_level}
```

Unique constraint makes the job idempotent.

Time machine:

- Stored in `system_settings.demo_clock`.
- `POST /admin/time-machine` changes only the demo clock, not record dates.
- All date-based jobs read the demo clock in `DEMO_MODE`.
- When the clock crosses a deposit's `hold_end_date`, set the system `TERM_SERVED` clearance to `CLEAR` and re-evaluate any open release request.
- Every clock change is audited.

### 6.8 Forecast and reports

At-risk definition:

```text
critical open finding
OR resolution status in {MATURED, RENEWAL_DUE} past due
OR bank verification status in {NOT_FOUND, ENCASHED, CLOSED, SOURCE_UNAVAILABLE}
OR release blocked by a required node
```

Buckets: month or quarter, using maturity date. Forecast is labelled `ESTIMATE`.

Reports:

```text
active | expiring | matured | renewed | released | pending
bank_wise | region_wise | programme_wise
missing_documents | overdue | audit | release_turnaround | forecast
```

Every report must drill down to records and respect RBAC.

### 6.9 NOC / sanction document

On final approval:

- FDR/RPGF/BG: NOC number `AICTE/RB/NOC/{year}/{seq}`.
- RTGS: sanction order `AICTE/RB/SANCTION/{year}/{seq}`.
- PDF includes: institution, instrument, amount in words and figures, principal only, interest retained, clearance references, decision actors, audit hash, QR/verification token (optional), and “synthetic demo” label.
- Store the document and hash it in audit.
- No real AICTE seal or signature; use a demo watermark.

---

## 7. Audit, security, integrations

### 7.1 Audit chain

Canonical event payload:

```json
{
  "event_type": "RELEASE_APPROVED",
  "actor_id": "uuid",
  "actor_role": "COMPETENT_AUTHORITY",
  "entity_type": "RELEASE_REQUEST",
  "entity_id": "uuid",
  "timestamp": "2026-10-25T00:00:00Z",
  "data": {}
}
```

Hash:

```text
canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
hash = sha256((prev_hash + "|" + canonical).encode("utf-8")).hexdigest()
```

- Genesis `prev_hash = "0" * 64`.
- Append-only.
- Verification walks from genesis and returns `valid`, `first_broken_seq`, `checked`.
- Export includes `seq`, `event_type`, `entity`, `actor`, `timestamp`, `prev_hash`, `hash`.
- A deliberate tamper fixture must break verification.

### 7.2 RBAC

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

Institution scoping is enforced in SQLAlchemy queries, not only in UI.

### 7.3 Security

- Passwords: Argon2id or bcrypt cost 12; never log.
- JWT secret from env; 1-hour expiry; no refresh token in prototype.
- Documents: AES-256-GCM; unique nonce; key from env; no public bucket; signed short-lived download endpoint.
- PII: mask account numbers and emails in logs; no raw request bodies in logs.
- CORS: only configured frontend origin.
- Rate limit login and upload endpoints.
- Secrets: `.env` only; `.env.example` committed.
- Audit events must not contain secrets or full document text.
- All external adapters have timeouts and never block the request indefinitely.

### 7.4 Integrations

| Adapter | Prototype behavior | Label |
|---|---|---|
| AICTE approval import | CSV/JSON fixture adapter | `MOCK` |
| Bank verifier | Sandbox fixtures + letter upload | `SANDBOX` |
| PGRC/complaints | Mock service with reference IDs | `MOCK` |
| Vigilance | Mock clearance | `MOCK` |
| Grants | Mock clearance | `MOCK` |
| DigiLocker/eSign | Hash/consent stub | `MOCK` |
| APAAR/ABC | Not used in 26265; do not claim | `MOCK` |
| Payments/RTGS | Proof upload + UTR field | `SIMULATED` |
| Email/SMS | Console/email log | `SIMULATED` |

Each adapter must implement a stable interface and expose its mode in the response.

---

## 8. Code tree and implementation order

### 8.1 Repository tree

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── errors.py
│   │   ├── deps.py
│   │   ├── enums.py
│   │   └── audit.py
│   ├── db/
│   │   ├── session.py
│   │   └── base.py
│   ├── models/
│   │   ├── institution.py
│   │   ├── instrument.py
│   │   ├── document.py
│   │   ├── provenance.py
│   │   ├── policy.py
│   │   ├── release.py
│   │   ├── audit.py
│   │   └── alert.py
│   ├── schemas/
│   │   ├── common.py
│   │   ├── auth.py
│   │   ├── institution.py
│   │   ├── instrument.py
│   │   ├── policy.py
│   │   ├── release.py
│   │   └── dashboard.py
│   ├── api/v1/
│   │   ├── router.py
│   │   └── routes/
│   │       ├── auth.py
│   │       ├── institutions.py
│   │       ├── policy.py
│   │       ├── instruments.py
│   │       ├── releases.py
│   │       ├── dashboards.py
│   │       ├── graphs.py
│   │       ├── audits.py
│   │       └── admin.py
│   ├── services/
│   │   ├── policy_engine.py
│   │   ├── requirement_service.py
│   │   ├── instrument_service.py
│   │   ├── document_service.py
│   │   ├── provenance_service.py
│   │   ├── bank_service.py
│   │   ├── release_graph.py
│   │   ├── release_service.py
│   │   ├── pledge_graph.py
│   │   ├── alert_service.py
│   │   ├── forecast_service.py
│   │   ├── audit_service.py
│   │   └── report_service.py
│   ├── adapters/
│   │   ├── bank_sandbox.py
│   │   ├── aicte_import.py
│   │   ├── complaints_mock.py
│   │   ├── digilocker_mock.py
│   │   └── notifications_mock.py
│   └── jobs/
│       ├── scheduler.py
│       └── daily_lifecycle.py
├── migrations/
│   └── versions/
├── scripts/
│   ├── seed.py
│   ├── reset_demo.py
│   └── verify_audit.py
├── Dockerfile
├── pyproject.toml
└── .env.example
```

**Test location:** all automated tests live at repository root `tests/`, owned by Data/QA per `03_DATA_QA.md` §8. The backend tree above contains production code only; do not add a second `backend/tests/` tree.

### 8.2 Implementation order

| Step | Build | Must pass |
|---|---|---|
| B0 | config, DB, migrations, auth, audit skeleton | `/health`, login, audit genesis |
| B1 | institutions, programmes, requirements, policies | Table 1.4 cases, concession, leased, exemptions |
| B2 | instruments, documents, extraction, provenance | upload, hash, mismatch, finding |
| B3 | bank adapter, release graph, clearances | blocked/eligible, maker-checker |
| B4 | pledge graph, alerts, forecast, reports | duplicate, T-7, forecast |
| B5 | NOC PDF, time machine, exports | demo path, audit verify |

### 8.3 Environment

```text
APP_ENV=development
DATABASE_URL=postgresql+psycopg://suraksha:suraksha@localhost:5432/suraksha
JWT_SECRET=change-me-in-dev
DOCUMENT_MASTER_KEY=base64-32-byte-key
CORS_ORIGINS=http://localhost:5173
DEMO_MODE=true
SEED_DATASET=demo_v1
```

### 8.4 Run commands

```bash
docker compose up -d db
alembic upgrade head
python scripts/seed.py --dataset demo_v1 --reset
uvicorn app.main:app --reload --port 8000
pytest -q
```

---

## 9. Acceptance tests

The backend is not done until these pass:

### Policy

- Engineering UG owned = ₹35L.
- Engineering UG leased = ₹70L.
- Engineering UG NE owned = ₹17.5L.
- Engineering UG NE leased = ₹35L.
- Engineering UG women-only owned = ₹17.5L.
- Engineering UG PwD-only leased = ₹35L.
- Management UG = ₹5L.
- Computer Applications UG = ₹5L.
- Engineering Diploma = ₹15L.
- Government = ₹0.
- Existing 1.3.3 >5 years = ₹0.
- Private university >10 UGC = ₹0.
- New programme at >10-year university = required.
- Prior release NOC = ₹0.
- Partial credit is subtracted after multipliers.
- Policy pack selection by academic year.
- Each result has a clause trace.

### Release

- All clear = `ELIGIBLE`.
- PGRC pending = `BLOCKED`.
- Vigilance missing = `BLOCKED`.
- Grants pending = `BLOCKED`.
- Embezzlement flag without NOC = `BLOCKED`.
- Converted university with complaint = `BLOCKED`.
- Progressive closure missing certificate = `BLOCKED`.
- Progressive closure matured = certificate not required.
- Merger missing certificate = `BLOCKED`.
- RTGS routes to sanction, not NOC.
- Maker cannot check/approve own request.
- Approval while blocked returns HTTP 422 `RELEASE_BLOCKED`.

### Provenance

- Amount mismatch = CRITICAL.
- Instrument number mismatch = CRITICAL.
- Date mismatch = SERIOUS.
- IFSC mismatch = SERIOUS.
- Depositor mismatch = SERIOUS.
- Lien missing = CRITICAL.
- Tenure short = SERIOUS.
- Duplicate number = CRITICAL.
- Duplicate hash = CRITICAL.
- Missing document = WARNING.
- Bank `NOT_FOUND` = manual review.

### Audit/security

- Tamper breaks the chain at the first altered event.
- Append-only is enforced by DB grants.
- Institution scoping works.
- Region scoping works.
- Release roles are separated.
- PII is masked in logs.
- Expired document URL is rejected.
- No secrets in repo.

### Contract

- `GET /meta/enums` matches §2.4.
- Every endpoint in §5 exists.
- Every error code in §5.7 is implemented.
- Every mutation writes an audit event.
- OpenAPI schema validates.

---

## 10. Open questions and handoff

### 10.1 Open policy questions

1. Exact official effective date of the 2026-27 addendum — do not fabricate.
2. Whether a university new programme that is also government is exempt — route to human review.
3. AICTE circular instructions on matured FDRs — `[UNVERIFIED]` until PDF obtained.
4. Exact API availability for banks/PGRC/eSign/APAAR — assume MoU-gated and mock.
5. Whether BG is in scope for the demo — support type in the model, but do not make it a demo dependency.

### 10.2 Handoff prompt

```text
You are the Backend Lead for SURAKSHA, SIH26265.

Read `build/01_BACKEND.md` completely. Also read `build/03_DATA_QA.md` for fixtures and tests, and `build/02_FRONTEND.md` for the API client expectations.

Build only the `backend/` tree in §8.1. Do not edit the frontend, data/QA, or delivery files. Tests live at repository root `tests/` and are owned by Data/QA; run them but do not edit them. Do not invent endpoints, fields, statuses, or policy rules. Use integer paise, UUIDs, UTC timestamps, and the exact enums in §2.4.

Implement in the order B0–B5. After each step run the tests in §9. Every mutation must write a hash-chained audit event. Every policy result must include a clause trace. Every external adapter must be labelled MOCK/SANDBOX and must never be described as live.

Definition of done:
- `docker compose up` works.
- migrations apply from scratch.
- `python scripts/seed.py --dataset demo_v1 --reset` is idempotent.
- policy, release, provenance, audit tests pass.
- OpenAPI matches §5.
- no secrets committed.
- no unsourced claim in code comments or responses.

If a contract is missing, stop and add it to §10.1; do not guess.
```

---

*End of backend contract. Frontend and data/QA must not redefine §2.4, §4, or §5.*
