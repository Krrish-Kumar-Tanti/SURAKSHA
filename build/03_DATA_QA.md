# 03 — DATA / QA ULTIMATE
## SURAKSHA · SIH26265 · Security Deposit / FDR Control Tower

> **Pack version:** 1.0
> **Owner:** Data/QA Lead
> **Readers:** all four owners.
> **Status:** implementation-ready specification.
> **Scope:** SIH 36-hour prototype. All data is synthetic.
> **Authority:** `01_BACKEND.md` owns schema, API, policy behavior, and enums. This file owns seed/fixtures, expected outputs, tests, acceptance, and QA gates.
> **Hard rule:** tests must prove behavior, not just exist. No invented pass counts. No real institution, bank account, or personal data.

---

## 0. How to use this file

1. Read `01_BACKEND.md` §2.4 (enums), §3 (policy), §4 (schema), §5 (API), §6 (algorithms), §9 (acceptance).
2. Build the `demo_v1` dataset in §2 exactly.
3. Run the policy matrix in §3.
4. Run the provenance/bank fixtures in §4.
5. Run the release scenarios in §5.
6. Run the audit, RBAC, and contract tests in §6.
7. Use §7 as the QA gate and bug process.
8. Give the handoff prompt in §8 to the Data/QA agent.

No one may change a fixture value without updating:
- this file,
- the backend seed script,
- the frontend mock if used,
- the demo script in `04_DELIVERY.md`.

---

## 1. Non-negotiables

- All institutions, people, emails, instruments, and bank records are synthetic.
- No real account numbers, phone numbers, Aadhaar/APAAR IDs, or personal data.
- Use fixed UUIDs for demo entities so screenshots, tests, and reports are stable.
- Use integer paise, never floats.
- Use the exact enums from `01_BACKEND.md` §2.4.
- Every test must have a specific expected result and a failure message that names the rule.
- Do not assert unverified policy facts. If a case is ambiguous, assert `NEEDS_REVIEW` or `POLICY_AMBIGUOUS`.
- Do not count a skipped test as passed.
- Do not claim “100% coverage”; report actual line/branch coverage and the specific scenarios covered.

---

## 2. `demo_v1` seed dataset

### 2.1 Deterministic IDs

Use these fixed UUIDs in seed data and tests:

| Entity | ID |
|---|---|
| SIT institution | `11111111-1111-4111-8111-111111111111` |
| Northstar institution | `22222222-2222-4222-8222-222222222222` |
| Doon institution | `33333333-3333-4333-8333-333333333333` |
| SIT Engineering UG programme | `11111111-1111-4111-8111-111111111101` |
| Northstar Engineering UG programme | `22222222-2222-4222-8222-222222222201` |
| Doon Engineering UG programme | `33333333-3333-4333-8333-333333333301` |
| SIT FDR | `aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa` |
| Northstar FDR | `bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb` |
| Doon FDR | `cccccccc-cccc-4ccc-8ccc-cccccccccccc` |
| SIT FDR document | `aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01` |
| Doon duplicate document | `cccccccc-cccc-4ccc-8ccc-cccccccccc01` |
| SIT release request | `dddddddd-dddd-4ddd-8ddd-dddddddddddd` |
| Audit genesis event | `seq=1` |

Stable user IDs are optional; use one per role:

| Role | Email | Password (dev only) |
|---|---|---|
| `INSTITUTION_USER` | `registrar@sit.example.test` | `demo-password` |
| `DEALING_OFFICER` | `officer@aicte.example.test` | `demo-password` |
| `DIRECTOR_RB` | `director@aicte.example.test` | `demo-password` |
| `COMPETENT_AUTHORITY` | `ca@aicte.example.test` | `demo-password` |
| `ACCOUNTS` | `accounts@aicte.example.test` | `demo-password` |
| `AUDITOR` | `auditor@aicte.example.test` | `demo-password` |
| `ADMIN` | `admin@aicte.example.test` | `demo-password` |

Never use these passwords outside local demo.

### 2.2 Institutions

| Field | SIT | Northstar | Doon |
|---|---|---|---|
| `aicte_permanent_id` | `1-12345678` | `1-87654321` | `1-55550001` |
| Name | Sanjeevani Institute of Technology | Northstar Women’s Institute of Technology | Doon Technical Campus |
| Trust | Sanjeevani Education Trust | Northstar Women’s Education Society | Doon Technical Education Trust |
| Region | WEST | NORTH_EAST | NORTH |
| State | Maharashtra | Nagaland | Uttarakhand |
| District | Pune | Kohima | Dehradun |
| `location_category` | `OTHER` | `NE` | `OTHER` |
| `institution_type` | `CO_ED` | `WOMEN_ONLY` | `CO_ED` |
| `building_ownership` | `LEASED` | `OWNED` | `OWNED` |
| `university_type` | `AFFILIATED` | `AFFILIATED` | `AFFILIATED` |
| `application_category` | `OTHER` | `NEW` | `OTHER` |
| `established_year` | 2016 | 2026 | 2018 |
| `regulatory_years` | 10 | 0 | 8 |
| `ugc_years` | 0 | 0 | 0 |
| `prior_release_noc` | false | false | false |
| `approval_status` | `APPROVED` | `APPROVED` | `APPROVED` |

**SIT:** hero case. Existing institution with a legacy 2016 FDR; Engineering UG, leased, non-concession; `application_category=OTHER` so the 1.3.3 exemption is not triggered. The ₹70L policy trace is the historical requirement for that deposit; the demo is release-focused.
**Northstar:** contrast case. New institution; Engineering UG, owned, Nagaland women-only. Required ₹17.5L.
**Doon:** fraud case. Existing institution; owns/uses the same FDR number and file hash as SIT.

### 2.3 Programmes

| Institution | Programme | Level | Intake |
|---|---|---|---:|
| SIT | `ENGINEERING` | `UG` | 240 |
| Northstar | `ENGINEERING` | `UG` | 120 |
| Doon | `ENGINEERING` | `UG` | 180 |

### 2.4 Instruments

| Field | SIT FDR | Northstar FDR | Doon FDR |
|---|---|---|---|
| `type` | `FDR` | `FDR` | `FDR` |
| `instrument_number` | `FDR-SIT-2016-001` | `FDR-NWIT-2026-001` | `FDR-SIT-2016-001` |
| Bank | Bank of Maharashtra | State Bank of India | Bank of Maharashtra |
| Branch | Pune Camp | Kohima Main | Dehradun Main |
| IFSC | `MAHB0000123` | `SBIN0001234` | `MAHB0000123` |
| Amount | ₹70,00,000 | ₹17,50,000 | ₹70,00,000 |
| `amount_paise` | `700000000` | `175000000` | `700000000` |
| Issue date | 2016-11-01 | 2026-04-01 | 2018-06-01 |
| Maturity date | 2026-11-01 | 2036-04-01 | 2028-06-01 |
| Tenure | 120 months | 120 months | 120 months |
| Interest | 6.50% | 6.75% | 6.50% |
| Depositor | Sanjeevani Education Trust | Northstar Women’s Education Society | Doon Technical Education Trust |
| Lien | AICTE | AICTE | AICTE |
| Status | `RELEASE_REQUESTED` | `ACTIVE` | `UNDER_SCRUTINY` |
| Verification | `DISCREPANT` | `OFFICER_VERIFIED` | `DISCREPANT` |
| `officer_verified` | false | true | false |

**Important:** Doon’s duplicate number is intentional. The database allows duplicate numbers across institutions so the pledge graph can detect them.

Ten-year term clocks: SIT `2016-11-01 → 2026-11-01`; Northstar `2026-04-01 → 2036-04-01`; Doon `2018-06-01 → 2028-06-01`. `TERM_SERVED` evaluates against `hold_end_date`, not the instrument maturity date.

Northstar’s bank sandbox matches, but it is still sandbox evidence: label it `OFFICER_VERIFIED`, never `BANK_CONFIRMED`.

### 2.5 Documents

| Document | Instrument | Type | SHA-256 | OCR |
|---|---|---|---|---|
| SIT FDR scan | SIT | `FDR` | `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2` | `TEXT_LAYER` |
| Doon copy | Doon | `FDR` | `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2` | `TEXT_LAYER` |
| Northstar FDR scan | Northstar | `FDR` | `b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3` | `TEXT_LAYER` |
| SIT Affidavit 6 | SIT | `AFFIDAVIT_6` | `c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4` | `TEXT_LAYER` |
| SIT latest LoA | SIT | `LOA` | `d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5` | `TEXT_LAYER` |
| SIT release application | SIT release | `RELEASE_APPLICATION` | `e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6` | `TEXT_LAYER` |

The shared hash between SIT and Doon is intentional. The duplicate-hash finding is critical and attaches to Doon, the later record; SIT remains the original legitimate holder.

### 2.6 Provenance — SIT

| Field | Declared | Document | Bank | Status |
|---|---|---|---|---|
| `amount` | `7000000.00` | `7000000.00` | `3500000.00` | `MISMATCH` |
| `instrument_number` | `FDR-SIT-2016-001` | `FDR-SIT-2016-001` | `FDR-SIT-2016-001` | `MATCH` |
| `issue_date` | `2016-11-01` | `2016-11-01` | `2016-11-01` | `MATCH` |
| `maturity_date` | `2026-11-01` | `2026-11-01` | `2026-11-01` | `MATCH` |
| `bank_name` | `Bank of Maharashtra` | `Bank of Maharashtra` | `Bank of Maharashtra` | `MATCH` |
| `branch` | `Pune Camp` | `Pune Camp` | `Pune Camp` | `MATCH` |
| `ifsc` | `MAHB0000123` | `MAHB0000123` | `MAHB0000123` | `MATCH` |
| `depositor` | `Sanjeevani Education Trust` | `Sanjeevani Education Trust` | `Sanjeevani Education Trust` | `MATCH` |
| `lien` | `AICTE` | `AICTE` | `AICTE` | `MATCH` |

SIT document evidence:

```json
{
  "field_name": "amount",
  "document_value": "7000000.00",
  "document_confidence": 0.98,
  "document_page": 1,
  "document_bbox": {"x": 0.12, "y": 0.34, "w": 0.31, "h": 0.05}
}
```

### 2.7 Provenance — Northstar

| Field | Declared | Document | Bank | Status |
|---|---|---|---|---|
| `amount` | `1750000.00` | `1750000.00` | `1750000.00` | `MATCH` |
| `instrument_number` | `FDR-NWIT-2026-001` | `FDR-NWIT-2026-001` | `FDR-NWIT-2026-001` | `MATCH` |
| `issue_date` | `2026-04-01` | `2026-04-01` | `2026-04-01` | `MATCH` |
| `maturity_date` | `2036-04-01` | `2036-04-01` | `2036-04-01` | `MATCH` |
| `bank_name` | `State Bank of India` | `State Bank of India` | `State Bank of India` | `MATCH` |
| `branch` | `Kohima Main` | `Kohima Main` | `Kohima Main` | `MATCH` |
| `ifsc` | `SBIN0001234` | `SBIN0001234` | `SBIN0001234` | `MATCH` |
| `depositor` | `Northstar Women’s Education Society` | `Northstar Women’s Education Society` | `Northstar Women’s Education Society` | `MATCH` |
| `lien` | `AICTE` | `AICTE` | `AICTE` | `MATCH` |

### 2.8 Findings

| Rule | Instrument | Severity | Disposition | Evidence |
|---|---|---|---|---|
| `AMOUNT_MISMATCH` | SIT | `CRITICAL` | `OPEN` | bank amount ₹35L; declared/document ₹70L |
| `DUPLICATE_NUMBER` | Doon | `CRITICAL` | `OPEN` | same `FDR-SIT-2016-001` as SIT; Doon is the later record |
| `DUPLICATE_HASH` | Doon | `CRITICAL` | `OPEN` | same document SHA-256 as SIT; Doon is the later record |
| `BANK_NOT_FOUND` | Doon | `CRITICAL` | `OPEN` | sandbox status `NOT_FOUND` |
| `MISSING_DOCUMENT` | Northstar | `WARNING` | `OPEN` | latest LoA not uploaded |

Negative control: Doon’s 2018→2028 is exactly 10 years; no `TENURE_SHORT` finding should exist.

### 2.9 Bank sandbox fixtures

| Query | Response |
|---|---|
| `FDR-SIT-2016-001` | `FOUND`, amount `3500000.00`, same dates/IFSC/depositor/lien; ref `SBX-2026-0001` |
| `FDR-NWIT-2026-001` | `FOUND`, amount `1750000.00`; ref `SBX-2026-0002` |
| Doon lookup by its own instrument ID | `NOT_FOUND`; ref `SBX-2026-0003` |
| `UNKNOWN-*` | `UNSUPPORTED`; ref `SBX-2026-0004` |
| `SBX-DOWN` | `SOURCE_UNAVAILABLE`; ref `SBX-2026-0005` |

The SIT bank response deliberately disagrees with the declared amount. This is the demo’s critical mismatch.

### 2.10 Policy packs and rules

`APH_2024_27_BASE`:

- Table 1.4.
- Exemptions 1.12(i), 1.12(iii), 4.10.
- 10-year hold and interest retention.
- Penalties 2.25(f), 7.7, 2.21(h)/(i).
- Clause 6.46 release nodes.

`APH_2026_27_ADDENDUM`:

- Item 10: 50% concession.
- Item 11: leased ×2.
- Item 28: late-deposit cross-reference.
- Items 36–37: RPGF/RTGS release language.

The rules are data, not hard-coded UI. The policy engine must produce a trace.

### 2.11 Release request — SIT

| Field | Value |
|---|---|
| `request_type` | `MATURITY` |
| `financial_embezzlement_flag` | false |
| `status` | `BLOCKED` |
| `eligibility_result` | `BLOCKED` |
| `documents` | application, Affidavit 6, FDR proof, latest LoA |
| `PROVENANCE` | `BLOCKED`, ref `AMOUNT_MISMATCH` |
| `PGRC` | `PENDING` |
| `VIGILANCE` | `PENDING` |
| `GRANTS` | `CLEAR`, ref `GRANTS/2026/77` |
| `FINANCIAL_EMBEZZLEMENT` | `NOT_APPLICABLE` |
| `COMPLAINTS_DISCIPLINARY` | `NOT_APPLICABLE` |
| `PROGRESSIVE_CLOSURE` | `NOT_APPLICABLE` |
| `MERGER` | `NOT_APPLICABLE` |
| `RTGS_SANCTION` | `NOT_APPLICABLE` |
| `TERM_SERVED` | `PENDING` |
| `DUES_PENALTIES` | `CLEAR` |
| `BANK_LIEN` | `CLEAR`, ref `SBX-2026-0001` |

Expected blockers: `PROVENANCE`, `PGRC`, `VIGILANCE`, `TERM_SERVED`. `PROVENANCE` is a system check, not an APH 6.46 clearance.

Creation order: the release request starts at `ELIGIBILITY_CHECK`; the instrument becomes `RELEASE_REQUESTED`; after graph evaluation the request is persisted as `BLOCKED`. Do not seed a `SUBMITTED` release request.

### 2.12 Clearance fixtures

| Action | Reference | Result |
|---|---|---|
| Clear PGRC | `PGRC/2026/0912` | `CLEAR` |
| Clear Vigilance | `VIG/2026/0441` | `CLEAR` |
| Clear Grants | `GRANTS/2026/77` | already `CLEAR` |
| Bank lien | `SBX-2026-0001` | already `CLEAR` |
| Time machine | `2026-11-01` | `TERM_SERVED` clears; request remains blocked on `PROVENANCE` |
| Resolve/waive SIT amount finding | `WAIVED`, ref `FIND-SIT-AMOUNT-01` | `PROVENANCE` clears; request becomes `ELIGIBLE`; instrument becomes `OFFICER_VERIFIED` |
| Maker | dealing officer | `MAKER_RECOMMENDED` |
| Checker | director | `CHECKER_APPROVED` |
| Approver | competent authority | `CA_APPROVED` |
| NOC | `AICTE/RB/NOC/2026/0042` | `NOC_ISSUED` |
| Release | accounts | `RELEASED` |

The waiver is an explicit exception. It does not rewrite the bank sandbox record: the original ₹35L bank value remains, the finding remains visible, and the release evidence is labelled `OFFICER_VERIFIED`, not `BANK_CONFIRMED`.

### 2.13 Audit seed

Seed at least these events in order:

1. `SEED_LOADED`
2. `INSTITUTION_CREATED` ×3
3. `INSTRUMENT_SUBMITTED` ×3
4. `DOCUMENT_UPLOADED` ×6
5. `PROVENANCE_COMPUTED`
6. `FINDING_CREATED`
7. `BANK_VERIFICATION_RECORDED`
8. `RELEASE_REQUESTED`
9. `ELIGIBILITY_EVALUATED`

Every event must chain from the previous hash. Do not insert seed events directly with fake hashes; use the audit service or a seed helper that computes the chain.

### 2.14 Alerts and time machine

Seed demo clock: `2026-10-25`.

Expected for SIT:

| Date | Expected |
|---|---|
| 2026-10-25 | T-7 reminder for 2026-11-01 maturity |
| 2026-11-01 | maturity event; `TERM_SERVED` clears; open release re-evaluates; maturity alert |
| 2026-11-15 | L2 Director escalation |
| 2026-11-30 | L3 Competent Authority final notice |
| Renewal | successor `FDR-SIT-2026-002` linked to predecessor |

Alert fingerprints must be unique; rerunning the daily job on the same date must not duplicate alerts.

---

## 3. Policy test matrix

Use `pytest.mark.parametrize`. Every row asserts `required_amount_paise` and trace steps.

| # | Programme | Level | Location | Type | Building | Exemption | Expected ₹ | Expected paise |
|---:|---|---|---|---|---|---|---:|---:|
| 1 | ENGINEERING | UG | OTHER | CO_ED | OWNED | none | 35L | 350000000 |
| 2 | ENGINEERING | UG | OTHER | CO_ED | LEASED | none | 70L | 700000000 |
| 3 | ENGINEERING | UG | NE | CO_ED | OWNED | none | 17.5L | 175000000 |
| 4 | ENGINEERING | UG | NE | CO_ED | LEASED | none | 35L | 350000000 |
| 5 | ENGINEERING | UG | OTHER | WOMEN_ONLY | OWNED | none | 17.5L | 175000000 |
| 6 | ENGINEERING | UG | OTHER | PWD_ONLY | LEASED | none | 35L | 350000000 |
| 7 | MANAGEMENT | UG | OTHER | CO_ED | OWNED | none | 5L | 50000000 |
| 8 | COMPUTER_APPLICATIONS | UG | OTHER | CO_ED | OWNED | none | 5L | 50000000 |
| 9 | ENGINEERING | DIPLOMA | OTHER | CO_ED | OWNED | none | 15L | 150000000 |
| 10 | ENGINEERING | PG | OTHER | CO_ED | OWNED | none | 15L | 150000000 |
| 11 | ENGINEERING | UG | OTHER | CO_ED | OWNED | government | 0 | 0 |
| 12 | ENGINEERING | UG | OTHER | CO_ED | OWNED | existing 1.3.3 >5 years | 0 | 0 |
| 13 | ENGINEERING | UG | OTHER | CO_ED | OWNED | private university >10 UGC | 0 | 0 |
| 14 | ENGINEERING | UG | OTHER | CO_ED | OWNED | prior release NOC | 0 | 0 |
| 15 | ENGINEERING | UG | OTHER | CO_ED | OWNED | new programme at >10-year university | 35L | 350000000 |
| 16 | ENGINEERING | UG | NE | WOMEN_ONLY | LEASED | none | 35L | 350000000 |
| 17 | ENGINEERING | UG | OTHER | CO_ED | LEASED | existing credit ₹10L | 60L | 600000000 |

Additional assertions:

- Applying the base pack and addendum pack gives the expected difference only for concession/leased cases.
- Partial credit is subtracted after multipliers.
- `—` Table 1.4 combinations return `POLICY_COMBINATION_INVALID`.
- Unknown `programme`/`level` returns validation error.
- Every trace step has `step`, `label`, `clause`, `amount_paise`.
- No float rounding drift.

Penalty tests:

| Rule | Input | Expected |
|---|---|---|
| Late 10% | deposit ₹70L, payment 2026-05-20 | ₹7L |
| Late 20% | payment 2026-06-15 | ₹14L |
| Withdrawal | payment 2026-08-01 | `WITHDRAWAL_RECOMMENDED`, human decision |
| Early encash | FDR ₹70L | ₹7L |
| Closure 10% | deposit ₹70L | ₹7L |
| Closure 50% | deposit ₹70L | ₹35L |
| Extension/forfeiture | any | `MANUAL_DECISION_REQUIRED` |

---

## 4. Provenance and bank tests

### 4.1 Field comparisons

| Test | Fixture | Expected |
|---|---|---|
| Amount mismatch | SIT | `AMOUNT_MISMATCH`, CRITICAL |
| Instrument number mismatch | alter bank value | `NUMBER_MISMATCH`, CRITICAL |
| Date mismatch | alter maturity | `DATE_MISMATCH`, SERIOUS |
| IFSC mismatch | alter bank IFSC | `BANK_MISMATCH`, SERIOUS |
| Depositor mismatch | alter depositor | `DEPOSITOR_MISMATCH`, SERIOUS |
| Lien missing | bank lien = `NONE` | `LIEN_MISSING`, CRITICAL |
| Tenure short | issue 2020-01-01, maturity 2025-01-01 | `TENURE_SHORT`, SERIOUS |
| Duplicate number | Doon, matched against SIT | `DUPLICATE_NUMBER`, CRITICAL on Doon |
| Duplicate hash | Doon, matched against SIT | `DUPLICATE_HASH`, CRITICAL on Doon |
| Missing document | Northstar | `MISSING_DOCUMENT`, WARNING |
| Bank not found | Doon | `BANK_NOT_FOUND`, CRITICAL |
| Source unavailable | `SBX-DOWN` | `SOURCE_UNAVAILABLE`; no auto-reject |
| Low OCR confidence | confidence 0.42 | `NEEDS_REVIEW`; no finding until human review |

### 4.2 Disposition tests

- `OPEN` → `RESOLVED` by `DEALING_OFFICER` for warning.
- `OPEN` → `WAIVED` by `DIRECTOR_RB` for critical, with reason.
- `INSTITUTION_USER` cannot waive a critical finding.
- `WAIVED` without reason returns 400.
- Every disposition writes audit.
- Waiving does not delete the finding or evidence.

### 4.3 Upload tests

- PDF text layer succeeds.
- Image-only PDF falls back to OCR or `NEEDS_REVIEW`.
- SHA-256 is deterministic.
- Same file uploaded twice to the same instrument creates a version, not a duplicate critical finding.
- Same file uploaded to two institutions creates a critical duplicate-hash finding on the later record.
- File over the configured size limit is rejected.
- Unsupported MIME type is rejected.
- Encrypted at rest: raw file bytes are not readable from the storage path.
- Signed download URL expires.
- No public bucket.

---

## 5. Release tests

### 5.1 Eligibility matrix

| Scenario | Expected |
|---|---|
| All required clear | `ELIGIBLE` |
| Open critical finding | `BLOCKED`; blockers include `PROVENANCE` |
| Critical finding waived/resolved | `PROVENANCE` clear; other nodes decide |
| Serious/warning finding only | does not block release by itself |
| PGRC pending | `BLOCKED`; blockers include PGRC |
| Vigilance pending | `BLOCKED`; blockers include VIGILANCE |
| Grants pending | `BLOCKED` |
| Embezzlement flag + NOC missing | `BLOCKED` |
| Embezzlement flag + NOC clear | `ELIGIBLE` |
| Converted university + complaint pending | `BLOCKED` |
| Converted university + no complaint | `ELIGIBLE` |
| Progressive closure + certificate missing | `BLOCKED` |
| Progressive closure + matured | `PROGRESSIVE_CLOSURE = NOT_APPLICABLE`, other nodes decide |
| Merger + certificate missing | `BLOCKED` |
| Merger + certificate clear | `ELIGIBLE` |
| RTGS | `RTGS_SANCTION` required; no NOC |
| FDR/RPGF/BG | NOC path; no sanction order |
| Source unavailable | `PENDING_SOURCE`, not `BLOCKED` |
| Needs info | `NEEDS_INFO` |
| Bank not found | `BLOCKED` or `NEEDS_INFO` according to node status; never auto-reject |

### 5.2 Decision tests

- Maker cannot check own request.
- Checker cannot approve; `COMPETENT_AUTHORITY` must approve.
- Approve while blocked → HTTP 422 `RELEASE_BLOCKED`.
- `RETURN` requires reason.
- `REJECT` requires reason.
- Approve FDR → NOC number.
- Approve RTGS → sanction order.
- NOC PDF contains principal only, not interest.
- NOC PDF includes synthetic-demo watermark.
- Initial SIT state is instrument `RELEASE_REQUESTED`, request `BLOCKED`, blockers `PROVENANCE` + PGRC + Vigilance + `TERM_SERVED`.
- After PGRC/Vigilance clear, request remains `BLOCKED` on `PROVENANCE` and `TERM_SERVED`.
- With the critical amount finding `WAIVED`, `PROVENANCE` clears but `TERM_SERVED` still blocks until 2026-11-01.
- Once both are satisfied, the request becomes `ELIGIBLE`.
- Release request status transitions match §6.5 of backend.
- Every decision writes audit.

### 5.3 Document-set tests

`DOCUMENTS` is `CLEAR` only when all are present:

- application/request letter;
- Affidavit 6;
- FDR/RPGF proof or RTGS payment proof;
- latest LoA/EoA.

If one is missing, `DOCUMENTS = NEEDS_INFO` and blockers include `DOCUMENTS`.

---

## 6. Audit, security, contract, and demo tests

### 6.1 Audit

- Genesis hash is `0` × 64.
- Appending events produces a valid chain.
- Recomputing every hash passes.
- Tampering with event 3's payload makes `verify` fail at seq 3.
- Deleting an event makes verification fail.
- Reordering events makes verification fail.
- Export contains all hashes.
- Audit actor and role are correct.
- No secrets or full document text in payload.

### 6.2 RBAC

| Test | Expected |
|---|---|
| Institution user reads another institution | 403 |
| Institution user uploads to another institution | 403 |
| Dealing officer reads another region | 403 |
| Director reads all regions | 200 |
| Auditor can read audit but cannot mutate | 403 on mutation |
| Accounts can generate release letter but cannot approve | 403 |
| Admin can time-travel | 200 |
| Institution user can time-travel | 403 |

### 6.3 Contract

- OpenAPI validates against the server.
- Every endpoint in `01_BACKEND.md` §5 exists.
- Every error code in §5.7 is reachable in tests.
- Response shapes match examples.
- `GET /meta/enums` matches the canonical enums.
- Pagination defaults and max are enforced.
- Idempotency key replay returns the same response.

### 6.4 Security

- Password hash is not plaintext.
- JWT rejects tampered token/expired token.
- Document URL expiry is enforced.
- Upload MIME/size checks work.
- SQL injection probes fail safely.
- No secrets in repo.
- CORS rejects unlisted origin.
- Login rate limit works.

### 6.5 Demo

The following must pass twice in a row:

1. Portfolio loads with SIT ₹70L, at-risk amount, expiring count.
2. SIT upload/extract shows declared/document ₹70L, bank ₹35L.
3. Evidence drawer shows page/bbox.
4. Policy trace shows 35L → ×2 = 70L; Northstar shows 35L → 50% = 17.5L.
5. Release graph starts blocked on `PROVENANCE`, PGRC, Vigilance and `TERM_SERVED`.
6. Clear PGRC/Vigilance; graph remains blocked on `PROVENANCE` + `TERM_SERVED`.
7. Time machine reaches 2026-11-01; `TERM_SERVED` clears; graph remains blocked on `PROVENANCE`.
8. As Director/CA, waive the critical amount finding with a reason; `PROVENANCE` clears; graph becomes ELIGIBLE.
9. Time machine advances to 2026-11-15/30; L2/L3 escalation and forecast appear.
10. Maker/checker/approver; NOC issued.
11. Pledge graph shows SIT/Doon duplicate.
12. Audit verify passes; tamper test can fail visibly.
13. Fallback video plays if live app fails.

---

## 7. Acceptance matrix and QA gate

### 7.1 PS requirement → evidence

| PS requirement | Backend evidence | Frontend evidence | Test |
|---|---|---|---|
| Central repository | institutions/instruments APIs | Portfolio, Institution 360 | `test_institutions_api`, `test_instruments_api` |
| Document management | document upload/hash/encrypt | upload wizard, evidence drawer | upload/security tests |
| Verification/discrepancy | provenance + findings | three-way screen | provenance tests |
| Validity/maturity tracking | obligations, alerts, time machine | calendar/clock | lifecycle tests |
| Renewal/replacement | lineage, renewal action | renewal flow | lineage tests |
| Release/refund workflow | release graph, clearances | release screen | release matrix |
| Alerts/escalation | alerts + fingerprints | alert feed | idempotency tests |
| Dashboard/reports | portfolio/forecast/reports | dashboard | demo tests |
| Audit/access control | hash chain + RBAC | audit verify, role views | audit/RBAC tests |
| Integration/data security | adapters + encryption | simulated labels | security tests |

### 7.2 Release gate

Do not distribute or demo until:

- [ ] migrations apply from scratch;
- [ ] seed is idempotent;
- [ ] all policy matrix rows pass;
- [ ] all release matrix rows pass;
- [ ] all provenance rules pass;
- [ ] audit tamper test fails correctly and clean chain passes;
- [ ] all RBAC rows pass;
- [ ] frontend consumes real API shapes;
- [ ] 7-minute demo passes twice;
- [ ] fallback video exists;
- [ ] all claims in `04_DELIVERY.md` have sources/labels;
- [ ] no P0 bugs.

### 7.3 Bug severity

| Severity | Definition | Action |
|---|---|---|
| P0 | demo blocked, wrong release, data loss, security hole | fix before demo; no exceptions |
| P1 | incorrect policy result, missing provenance evidence, broken audit verify | fix before distribution |
| P2 | visual polish, copy, non-critical filter | fix if time |

No “works on my machine” closures. Include command, fixture, expected, actual, screenshot/log.

### 7.4 Test reporting

Report:

```text
collected:
passed:
failed:
skipped:
duration:
coverage line/branch:
demo run 1: pass/fail
demo run 2: pass/fail
```

Do not write “all tests passed” without the command and output. Do not invent a test count.

---

## 8. Data/QA code tree and handoff

```text
tests/
├── conftest.py
├── fixtures/
│   ├── demo_v1.py
│   ├── institutions.json
│   ├── instruments.json
│   ├── provenance.json
│   ├── release.json
│   └── audit.json
├── unit/
│   ├── test_policy_engine.py
│   ├── test_penalties.py
│   ├── test_release_graph.py
│   ├── test_provenance_rules.py
│   ├── test_pledge_graph.py
│   └── test_audit_chain.py
├── integration/
│   ├── test_institutions_api.py
│   ├── test_instruments_api.py
│   ├── test_release_api.py
│   ├── test_dashboard_api.py
│   └── test_rbac.py
├── contract/
│   ├── test_openapi_contract.py
│   ├── test_error_codes.py
│   └── test_frontend_contract.py
├── e2e/
│   ├── test_demo_path.py
│   └── test_time_machine.py
└── security/
    ├── test_auth.py
    ├── test_documents.py
    └── test_headers.py
```

Handoff prompt:

```text
You are the Data/QA Lead for SURAKSHA, SIH26265.

Read `build/01_BACKEND.md` §2.4, §3, §4, §5, §6, §9 and this entire file.

Build `tests/` and seed fixtures only. Do not edit backend services or frontend components. Use the fixed IDs and values in §2. If a test fails because the backend contract is missing, report the exact endpoint/field and do not weaken the test.

Priority:
1. policy matrix,
2. release matrix,
3. provenance rules,
4. audit chain,
5. RBAC,
6. demo path.

Definition of done:
- `pytest -q` runs from a clean DB.
- seed reset is idempotent.
- every row in §3–§6 has a test.
- the 7-minute path is covered end-to-end.
- report actual counts, not claims.
- no test skipped without a written reason.

Do not invent pass counts. Do not claim 100% coverage.
```

---

*End of Data/QA contract. Fixtures are canonical for demos; schema/API remain in `01_BACKEND.md`.*
