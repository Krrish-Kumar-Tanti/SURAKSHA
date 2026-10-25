# 02 — FRONTEND ULTIMATE
## SURAKSHA · SIH26265 · Security Deposit / FDR Control Tower

> **Pack version:** 1.0
> **Owner:** Frontend Lead
> **Readers:** all four owners.
> **Status:** implementation-ready specification.
> **Scope:** SIH 36-hour prototype. All data is synthetic.
> **Authority:** `01_BACKEND.md` owns enums, schema, API, policy, and backend behavior. This file owns UX, screens, components, client state, and interaction contracts.
> **Hard rule:** no invented API fields, no fake integrations, no “live bank” language, and no color-only status.

---

## 0. How to use this file

1. Read `01_BACKEND.md` §2.4, §3, §5, and §6.
2. Read `03_DATA_QA.md` §2 for fixtures.
3. Build the frontend tree in §9.
4. Implement P0 screens first: portfolio, submission, provenance, policy trace, release graph, time machine, audit.
5. Wire to real API as soon as endpoints exist; use typed mock data only until then.
6. Do not wait for backend to start visual work. Do not ship mock data in the final demo if the API exists.

**Pack-wide authorities:**

| Domain | Authority |
|---|---|
| Policy, schema, API, backend behavior | `01_BACKEND.md` |
| UX, screens, components | this file |
| Seed data, fixtures, tests | `03_DATA_QA.md` |
| Narrative, PPT, demo, ownership, runbook | `04_DELIVERY.md` |

---

## 1. Product feel

### 1.1 Design direction

A serious regulatory/financial control tower. Calm, audit-grade, evidence-forward. Not a crypto dashboard, not a generic admin template.

- **Mood:** trustworthy, precise, quiet confidence.
- **Density:** data-dense but readable; 8px spacing grid.
- **Motion:** minimal; animate graph/chain only when it explains something.
- **Language:** plain English; clauses cited; no jargon without a tooltip.
- **Demo honesty:** every screen carries `Synthetic data · Simulated integrations` in the shell.

### 1.2 Visual tokens

```text
Color:
--bg:            #0b1220
--surface:       #111a2b
--surface-2:     #172338
--border:        #26364f
--text:          #e8eef8
--muted:         #9fb0c7
--navy:          #0f2747
--teal:          #1fb6a6   verified / active
--amber:         #e0a326   warning / expiring / pending
--red:           #e05b5b   critical / blocked
--green:         #3fbf7f   clear / released
--gray:          #6f7f95   closed / not applicable
--focus:         #7cc7ff

Type:
--font-ui:       Inter, system-ui, sans-serif
--font-mono:     JetBrains Mono, ui-monospace, monospace
--display:       28/34 semibold
--h1:            22/28 semibold
--h2:            18/24 semibold
--body:          14/20 regular
--small:         12/16 regular
--numeric:       tabular-nums

Spacing: 4, 8, 12, 16, 24, 32, 48
Radius: 8 (cards), 6 (controls), 999 (chips)
Shadow: subtle, max one elevation level
```

### 1.3 Status semantics

Never use color alone. Every status has a label and icon/text.

| Status family | Color | Use |
|---|---|---|
| Verified / active / clear | teal / green | `VERIFIED`, `ACTIVE`, `CLEAR`, `ELIGIBLE`, `BANK_CONFIRMED`, `OFFICER_VERIFIED` (always show source) |
| Warning / expiring / pending | amber | `EXPIRING`, `PENDING`, `NEEDS_INFO` |
| Critical / blocked | red | `BLOCKED`, `CRITICAL`, `DISCREPANT` |
| Neutral / closed | gray | `CLOSED`, `NOT_APPLICABLE` |
| Source unavailable | violet/orange hatch + label | `SOURCE_UNAVAILABLE` |

Never render a sandbox result as `BANK_CONFIRMED`; sandbox is `SANDBOX`/`DISCREPANT`, and letter/officer confirmation is `OFFICER_VERIFIED`.

### 1.4 Accessibility

- WCAG AA contrast.
- Full keyboard path for forms, tables, drawers, graphs (table fallback).
- Visible focus ring.
- `aria-live` for async status.
- No hover-only evidence.
- Tables use `<th scope="col">`.
- Charts have a table alternative.
- Reduced-motion preference respected.
- Every graph has an accessible “List view.”

---

## 2. App shell and routes

### 2.1 Route map

| Route | Screen | Roles | Priority |
|---|---|---|---|
| `/login` | Login | public | P0 |
| `/` | Portfolio / home | all authenticated | P0 |
| `/institutions/:id` | Institution 360 | officer/director/CA/auditor | P2 |
| `/instruments/new` | Submission wizard | institution/admin | P0 |
| `/instruments/:id` | Instrument detail | scoped roles | P0 |
| `/instruments/:id/provenance` | Three-way provenance | officer/director/CA/auditor | P0 |
| `/policy` | Policy trace + diff | all | P0 |
| `/releases` | Clearance queue | officer/director/CA/accounts/auditor | P1 |
| `/releases/:id` | Release eligibility graph | officer/director/CA/auditor | P0 |
| `/time-machine` | Time machine / calendar | director/admin/institution read | P0 |
| `/audit` | Audit verify | auditor/director/admin | P0 |
| `/pledge-graph` | Pledge graph | director/auditor/admin | P1 |
| `/forecast` | Maturity forecast | director/CA/auditor | P1 |
| `/reports` | Reports | scoped roles | P2 |
| `/settings` | Profile/role/demo | admin | P2 |

### 2.2 Shell

- Left nav, collapsible.
- Top bar: product mark, role switcher, demo clock, search, help, user menu.
- Demo banner below top bar: `Synthetic data · Simulated integrations`.
- Main content max-width 1440, fluid.
- Global toast region.
- Global connection status: `API connected` / `Demo data` / `Offline`.
- No role switcher in production; in demo, role switcher is explicit and labelled `DEMO`.
- Search: institution name/ID, instrument number, release ID.

### 2.3 Role-based navigation

| Role | Default | Visible |
|---|---|---|
| `INSTITUTION_USER` | My deposits | Portfolio (own), instruments, submit, releases (own), policy |
| `DEALING_OFFICER` | Work queue | Portfolio (region), instruments, provenance, releases, policy |
| `DIRECTOR_RB` | Portfolio | All + pledge graph, forecast, time machine |
| `COMPETENT_AUTHORITY` | Release queue | Portfolio, releases, forecast, audit read |
| `ACCOUNTS` | Release letters | Released list, NOC/sanction, reports |
| `AUDITOR` | Audit | Portfolio read, audit, reports, pledge read |
| `ADMIN` | Admin | Everything, time machine, demo reset |

### 2.4 API client

Create `src/lib/api.ts` with typed functions. Never fetch ad hoc in components.

```text
login(email, password)
me()
listInstitutions(params)
getInstitution(id)
getRequirement(institutionId, programmeId, academicYear)
listPolicyPacks()
getPolicyRules(packId)
diffPolicy(base, overlay)
calculatePolicy(body)
createInstrument(body)
listInstruments(params)
getInstrument(id)
uploadDocument(instrumentId, file, type)
extractInstrument(id)
verifyBank(id, mode)
getProvenance(id)
getLineage(id)
renewInstrument(id, body)
disposeFinding(id, body)
createRelease(body)
listReleases(params)
getRelease(id)
getEligibility(id)
setClearance(id, type, body)
decideRelease(id, body)
getDecisionDocument(id)
getPortfolio(params)
getForecast(params)
getPledgeGraph(params)
getAudit(params)
verifyAudit()
setTimeMachine(body)
getReports(type, params)
getEnums()
```

Rules:

- Base URL from `VITE_API_BASE_URL`, default `http://localhost:8000/api/v1`.
- JWT in memory + `sessionStorage` for demo; never `localStorage` for production.
- Attach `Authorization: Bearer`.
- Normalize errors to `{code,message,details,traceId}`.
- 401 → clear session, redirect login.
- 403 → permission panel, not blank.
- 422 `RELEASE_BLOCKED` → show blockers from `details.blockers`.
- Use AbortController for navigation.
- No retry storms; one explicit “Retry” button.
- Every response type generated from OpenAPI if possible; otherwise mirror `01_BACKEND.md`.

### 2.5 Global UI states

For every data screen:

| State | UI |
|---|---|
| Loading | skeleton rows/cards; no layout shift |
| Empty | specific message + next action; no lorem ipsum |
| Error | reason, retry, `trace_id` |
| Forbidden | “You do not have access to this institution/region” |
| Stale | timestamp + refresh; never silently show old ₹ |
| Demo | `Synthetic data` badge |
| Simulated | `SIMULATED` / `MOCK` / `SANDBOX` badge next to source |

---

## 3. Screen 1 — Portfolio / home

**Purpose:** show the ₹ story in 10 seconds.

### Layout

- Page title: `Security deposit control tower`.
- Scope line: region/all + academic year + demo clock.
- KPI row:
  - Active instruments.
  - ₹ held.
  - ₹ at risk.
  - Expiring in 90 days.
  - Pending release.
  - Pending verification.
- Maturity chart: ₹ by quarter.
- At-risk table: instrument, institution, severity, reason, amount, action.
- Recent activity / audit feed.
- “View forecast” and “View pledge graph” links.

### Data

- `GET /dashboard/portfolio`.
- `GET /audit?limit=8` for activity.
- `GET /meta/enums` for labels.

### Interactions

- KPI click → filtered instrument/release list.
- At-risk row → instrument detail/provenance.
- Chart bar → forecast filtered to bucket.
- Role switch refreshes scope.

### Acceptance

- Shows SIT ₹70L and critical amount mismatch in at-risk.
- ₹ at risk is a sum, not a count.
- Every KPI drills down.
- No number without a timestamp/scope.
- Empty state not shown when demo data is seeded.

---

## 4. Screen 2 — Instrument submission wizard

**Purpose:** let an institution submit an FDR with an immediate policy requirement.

### Steps

1. **Institution & programme** — institution (own for institution user), programme, level, academic year.
2. **Instrument declared values** — type, number, bank/branch/IFSC, amount, issue/maturity, tenure, interest, depositor, lien.
3. **Documents** — FDR, Affidavit 6, latest LoA/EoA, release application if applicable.
4. **Review & submit** — requirement card, declared values, documents, confirmation.

### Right rail

Requirement card:

```text
Table 1.4 base:        ₹35,00,000
Concession:            — / 50%
Leased multiplier:     ×2
Existing credit:       —
Required:              ₹70,00,000
Why this number?       clause links
```

### Interactions

- “Why this number?” opens policy trace in a drawer.
- Upload progress per file; retry; remove before submit.
- Inline validation; no dead ends.
- Save draft.
- Submit disabled until required fields and at least FDR document are present.
- On success: instrument detail with status `SUBMITTED`.

### Acceptance

- SIT path: programme Engineering UG, leased, Maharashtra → ₹70L.
- Northstar path: Engineering UG, owned, Nagaland, women-only → ₹17.5L.
- Changing location/type/ownership recalculates only after explicit “Recalculate”; show a “stale” chip if fields changed.
- No amount typed as float in UI state; format from paise.
- Upload uses SHA-256 server-side; UI never computes a security hash.
- Validation messages name the field.

---

## 5. Screen 3 — Three-way provenance

**Purpose:** prove field-level agreement or disagreement with evidence.

### Layout

- Header: instrument number, institution, verification status, source labels.
- Three columns: `Declared` | `Document` | `Bank`.
- Rows: amount, instrument number, issue date, maturity date, bank/branch/IFSC, depositor, lien.
- Mismatch row: severity chip + “Why?”.
- Right/bottom evidence drawer:
  - document preview with page/bbox highlight;
  - OCR confidence;
  - bank source/ref/timestamp;
  - finding reason and suggested action;
  - disposition controls.
- Footer actions:
  - `Accept finding` (warning/serious, role-gated)
  - `Raise query`
  - `Waive with reason` (critical only director/CA)
  - `Verify with bank` (sandbox/letter)
  - `Re-run extraction`

### Data

- `GET /instruments/{id}/provenance`
- `POST /instruments/{id}/verify-bank`
- `POST /instruments/{id}/extract`
- `POST /findings/{id}/disposition`

### Acceptance

- SIT amount row shows declared ₹70L, document ₹70L, bank ₹35L.
- Mismatch is not a black-box score; row shows exact reason.
- Evidence drawer shows page 1 and bbox.
- Bank source is `SANDBOX`; label visible.
- Critical finding cannot be waived by institution user; button disabled with reason.
- `SOURCE_UNAVAILABLE` is a neutral “review” state, not fraud.
- List fallback accessible keyboard.

---

## 6. Screen 4 — Policy trace and diff

**Purpose:** show why the number is the number.

### Layout

- Selector: institution, programme, level, academic year.
- Toggles for location category, institution type, building ownership (only if role allows what-if; otherwise read-only).
- Trace card: base → concession → leased → exemption/credit → required.
- Each step: amount, factor, clause, source link, effective pack.
- “Policy diff” tab: base APH vs 2026-27 addendum.
- “Open clause” drawer with excerpt and source URL.
- “Save calculation” / “Use in submission.”

### Data

- `GET /institutions/{id}/requirements`
- `POST /policy/calculate`
- `GET /policy/packs`
- `GET /policy/packs/{id}/rules`
- `GET /policy/diff?base=APH_2024_27_BASE&overlay=APH_2026_27_ADDENDUM`

### Acceptance

- SIT: 35L → leased ×2 → 70L.
- Northstar: 35L → 50% → 17.5L.
- Engineering UG NE leased: 35L.
- Clause citation visible on every step.
- No “illustrative/editable norms” language.
- Policy diff shows 50% concession, leased wording, RPGF release items.
- If pack selection is ambiguous, show `NEEDS_REVIEW`, not a guessed number.

---

## 7. Screen 5 — Release eligibility graph

**Purpose:** make release safety visible.

### Layout

- Left: release request summary, instrument, amount, term, request type, document set.
- Center: graph of clearance nodes.
- Right: result panel:
  - `ELIGIBLE`, `BLOCKED`, `NEEDS_INFO`, `PENDING_SOURCE`;
  - blockers list;
  - exact missing reference;
  - decision history.
- Node states: clear/green, pending/amber, blocked/red, not applicable/gray, source unavailable/hatched.
- Nodes:
  - Documents;
  - Provenance (system check; open critical findings);
  - PGRC;
  - Vigilance;
  - Grants;
  - Financial embezzlement (conditional);
  - Complaints/disciplinary (conditional);
  - Progressive closure (conditional);
  - Merger (conditional);
  - RTGS sanction (conditional);
  - Term served (system);
  - Dues/penalties (system);
  - Bank lien (system).

### Interactions

- Click node → source/reference/evidence. The Provenance node opens the underlying finding.
- Clear PGRC/Vigilance in demo → recompute.
- As Director/CA, waive/resolve the critical finding with a reason → recompute Provenance.
- Attempt approve while blocked → disabled + blocker reason.
- Role switch to demonstrate maker/checker/CA.
- “View document set” drawer.
- Accessible list view with same data.

### Acceptance

- SIT starts `BLOCKED` with `PROVENANCE`, PGRC, Vigilance and `TERM_SERVED`.
- Clearing PGRC/Vigilance leaves `PROVENANCE` and `TERM_SERVED` visible.
- Time machine to maturity clears `TERM_SERVED`; as Director/CA, waiving the critical finding with a reason clears `PROVENANCE` → `ELIGIBLE`.
- `PROVENANCE` is labelled “System check” and is not shown as APH 6.46.
- Maker cannot approve; UI reflects role but backend also enforces.
- Approve while blocked would return 422; UI must never send it (and must handle it if it does).
- Official vs system nodes are visibly distinguished.
- No DTE/anti-ragging/faculty-salary node.
- Every node has a reference or “not applicable” reason.

---

## 8. Screen 6 — Time machine and maturity calendar

**Purpose:** show that the system runs the calendar before the calendar runs the institution.

### Layout

- Demo clock control: `Today: 25 Oct 2026` + “Advance 90 days” + date picker (admin/director only).
- Timeline: T-90, T-60, T-30, T-15, T-7, T-0.
- Instrument card: SIT FDR, ₹70L, maturity 1 Nov 2026.
- Alert feed: reminder, overdue, L1/L2/L3.
- Renewal action: create successor, show lineage.
- Forecast preview.
- “Reset demo clock” (admin).

### Data

- `GET /dashboard/forecast`
- `GET /instruments?maturity_before=`
- `GET /audit?entity_type=INSTRUMENT`
- `POST /admin/time-machine`
- `POST /instruments/{id}/renew`

### Acceptance

- At 2026-10-25: T-7 reminder.
- At 2026-11-01: maturity event; `TERM_SERVED` clears and the open release re-evaluates.
- At 2026-11-15: L2 Director.
- At 2026-11-30: L3 CA.
- Renewal creates `FDR-SIT-2026-002` linked to predecessor.
- Alert rerun does not duplicate.
- Clock change is audited.
- Time machine is labelled `DEMO`.

---

## 9. Screen 7 — Audit verify

**Purpose:** make tamper-evidence tangible.

### Layout

- Chain table: seq, event type, actor, entity, timestamp, prev hash, hash.
- “Verify chain” button.
- Result panel: valid/invalid, first broken seq, checked count, timestamp.
- Export CSV.
- Filter by entity/event/actor.
- No UI action may mutate the audit chain. Tamper detection is proven by the backend fixture/test, not by a demo button.

### Data

- `GET /audit`
- `GET /audit/verify`
- `GET /reports/audit?format=csv`

### Acceptance

- Clean chain: `valid=true`.
- Tampered chain: `valid=false`, `first_broken_seq` visible.
- Export includes hashes.
- No event payload contains secrets or full document text.
- Auditor can read; cannot mutate.

---

## 10. Screen 8 — Pledge graph

**Purpose:** show a fraud vector a spreadsheet cannot.

### Layout

- Graph: institutions, instruments, banks, documents, signatories.
- Edges: pledged for, renewed from, same number, same hash, same account, same signatory.
- Red edge for duplicate number/hash.
- Side panel: “Potential duplicate pledge — coordination required.”
- Explanation: shared instrument number, shared file hash, affected institutions.
- Actions: open instrument, open evidence, block acceptance/release (role-gated).

### Data

- `GET /graph/pledges`
- `GET /instruments/{id}/provenance`

### Acceptance

- SIT + Doon share `FDR-SIT-2016-001`.
- SIT + Doon share file hash; Doon is the later record and carries the critical duplicate finding.
- Side panel names both institutions.
- Edge click shows evidence.
- Graph has list fallback.
- No graph library dependency required; React Flow or SVG both acceptable.

---

## 11. Screen 9 — Maturity cash-flow forecast

**Purpose:** let a director see ₹ maturing, renewing, releasing, unresolved.

### Layout

- Date range and bucket controls.
- Stacked bar: maturing, renewals, releases, unresolved.
- At-risk total card.
- Table: instrument, institution, maturity, amount, status, action.
- Filters: region, bank, programme.
- Export CSV/JSON.
- `ESTIMATE` label.

### Data

- `GET /dashboard/forecast`
- `GET /reports/forecast?format=csv`

### Acceptance

- SIT maturity appears in Q4 2026.
- At-risk total includes SIT mismatch.
- Click bar filters table.
- Export matches visible rows.
- Label `ESTIMATE` visible; no “projected savings” claim.

---

## 12. Screen 10 — Clearance queue / maker-checker

**Purpose:** make release decisions auditable and separated.

### Layout

- Queue table: request, institution, instrument, amount, status, maker, checker, approver, SLA.
- Filters: status, request type, region.
- Detail drawer: eligibility summary, blockers, documents, decision history.
- Actions by role:
  - maker: recommend / return;
  - checker: check / return;
  - CA: approve / reject;
  - accounts: generate release letter.
- Segregation-of-duties warning when the same user would act twice.

### Data

- `GET /release-requests`
- `GET /release-requests/{id}`
- `GET /release-requests/{id}/eligibility`
- `POST /release-requests/{id}/decision`

### Acceptance

- Maker cannot check/approve own request.
- Blocked request cannot be approved.
- NOC/sanction appears only after approval.
- Decision reason required for return/reject.
- Every action shows in audit.

---

## 13. P2 screens

### Institution 360

- Institution profile, programmes, instruments, documents, findings, releases, alerts.
- Link to pledge graph and forecast.
- No duplicate data entry.

### Reports

- Active, expiring, matured, renewed, released, pending, bank-wise, region-wise, programme-wise, missing documents, overdue, audit, release turnaround.
- CSV/JSON; PDF only if time.
- Every report has scope, generated_at, synthetic label.

### Policy diff

- Side-by-side base vs addendum.
- What changed, clause, effective pack.
- Read-only; no editing.

---

## 14. Shared component library

| Component | Contract |
|---|---|
| `AppShell` | nav, top bar, banner, outlet |
| `RoleSwitcher` | demo-only; role enum |
| `DemoClock` | current date, advance, reset |
| `StatusChip` | status enum + label + icon |
| `SeverityChip` | CRITICAL/SERIOUS/WARNING |
| `SourceBadge` | DECLARED/DOCUMENT/BANK/SYSTEM/MOCK/SANDBOX/ESTIMATE |
| `KpiCard` | label, value, delta/context, drill-down |
| `DataTable` | columns, sort, filter, pagination, empty/error |
| `EvidenceDrawer` | document preview, bbox, metadata, findings |
| `DocumentViewer` | PDF/image, page, bbox overlay, zoom |
| `PolicyTraceCard` | steps, factors, clauses |
| `TraceStep` | label, amount, factor, clause, source |
| `ReleaseGraph` | nodes, edges, result, blockers, list view |
| `GraphNode` | type, status, label, reference |
| `GraphLegend` | status semantics |
| `PledgeGraph` | nodes/edges, duplicate highlight, list view |
| `Timeline` | T-minus milestones, alerts |
| `DecisionPanel` | result, blockers, role actions |
| `MakerCheckerBar` | maker/checker/approver state |
| `SimulatedBadge` | external adapter label |
| `EmptyState` | title, reason, action |
| `ErrorState` | code, message, trace_id, retry |
| `PermissionState` | role explanation |
| `SyntheticBanner` | always visible in demo |
| `ConfirmDialog` | destructive/decision actions |
| `ReasonDialog` | required reason for waive/return/reject |
| `ExportButton` | CSV/JSON/PDF |
| `HelpPopover` | clause/source explanation |

Component rules:

- Props typed; no `any`.
- No business logic in visual components.
- Status → color mapping in one file.
- All money formatting in one `formatMoney(paise)` helper.
- All dates in one `formatDate` helper; display IST for demo but store UTC.
- All API errors through one `ApiError` type.
- All tables include accessible captions.

---

## 15. Frontend code tree

```text
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── format.ts
│   │   ├── errors.ts
│   │   ├── enums.ts
│   │   └── mock/
│   │       ├── portfolio.ts
│   │       ├── provenance.ts
│   │       ├── release.ts
│   │       └── audit.ts
│   ├── state/
│   │   ├── session.ts
│   │   ├── demoClock.ts
│   │   └── query.ts
│   ├── components/
│   │   ├── shell/
│   │   ├── data/
│   │   ├── policy/
│   │   ├── provenance/
│   │   ├── release/
│   │   ├── graphs/
│   │   ├── audit/
│   │   └── common/
│   ├── screens/
│   │   ├── Login.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Institution360.tsx
│   │   ├── InstrumentWizard.tsx
│   │   ├── InstrumentDetail.tsx
│   │   ├── Provenance.tsx
│   │   ├── PolicyTrace.tsx
│   │   ├── ReleaseQueue.tsx
│   │   ├── ReleaseDetail.tsx
│   │   ├── TimeMachine.tsx
│   │   ├── PledgeGraph.tsx
│   │   ├── Forecast.tsx
│   │   ├── Audit.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   └── styles/
│       ├── tokens.css
│       └── global.css
├── tests/
│   ├── unit/
│   ├── components/
│   └── e2e/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

### 15.1 Environment

```text
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_DEMO_MODE=true
VITE_APP_NAME=SURAKSHA
```

### 15.2 Implementation order

| Step | Build | Acceptance |
|---|---|---|
| F0 | shell, tokens, login, session | login/logout, role nav |
| F1 | portfolio + data table + KPI | SIT at-risk card |
| F2 | submission wizard + policy trace | ₹70L and ₹17.5L paths |
| F3 | provenance + evidence drawer | SIT amount mismatch |
| F4 | release graph + queue | blocked → eligible |
| F5 | time machine + audit | T-7, verify |
| F6 | pledge graph + forecast | duplicate, Q4 bucket |
| F7 | reports + polish | demo twice |

### 15.3 Testing

- Vitest + React Testing Library for components.
- Playwright for the 7-minute path.
- Contract test against OpenAPI.
- Accessibility: axe on P0 screens.
- No snapshot-only tests for critical business states.
- Mock service worker only for early standalone work; final demo uses real API.

---

## 16. Copy and claim guardrails

### Use

- “Policy trace.”
- “Declared vs document vs bank.”
- “SIMULATED / SANDBOX.”
- “The graph blocks release until the required clearances, the 10-year term, and the critical-discrepancy check are satisfied.”
- “₹70 lakh required for this leased Engineering UG institution.”
- “System check” for dues/lien.
- “Estimate” for forecast.

### Do not use

- “The bank API confirms.”
- “AICTE integrated.”
- “Legally decides.”
- “Zero complaints required for every release.”
- “100% accurate.”
- “500%–1000%.”
- “75% superior.”
- “AI fraud score.”
- “Blockchain.”
- “Guaranteed release.”
- “Real-time bank balance.”
- “DTE/anti-ragging clearance” as 6.46.

### Error microcopy

```text
Release blocked
This deposit is not eligible for approval yet. One or more required clearances or the 10-year term is still pending.
[View blockers] [Return to queue]
```

```text
Bank source unavailable
The sandbox did not return a result. This is not evidence of fraud. Route to manual review.
```

```text
Permission required
Only the Director/Competent Authority can waive a critical finding. The reason and actor will be audited.
```

---

## 17. Handoff prompt

```text
You are the Frontend Lead for SURAKSHA, SIH26265.

Read `build/01_BACKEND.md` §2.4, §5, §6 and this entire file. Read `build/03_DATA_QA.md` §2 for fixtures.

Build only `frontend/`. Do not edit backend, data/QA, or delivery files. Do not invent API fields or status values. Use the exact enums in `01_BACKEND.md` §2.4.

Start with F0–F3: shell, login, portfolio, submission, policy trace, provenance. Then F4–F7: release graph, time machine, audit, pledge graph, forecast.

Rules:
- Every screen must handle loading, empty, error, forbidden, stale, and demo states.
- Every simulated source must show a label.
- Every status must have text, not only color.
- Every graph must have an accessible list view.
- Do not wait for backend; use typed mocks, then switch to the real API.
- Do not claim a live bank/AICTE integration.

Definition of done:
- P0 screens work on `demo_v1`.
- Playwright 7-minute path passes twice.
- axe smoke passes on P0 screens.
- no console errors on the demo path.
- no mock data in the final demo if the API is available.
- no unsourced claim in UI copy.

If a contract is missing, stop and record it in `01_BACKEND.md` §10.1; do not guess.
```

---

*End of frontend contract. API/schema remain owned by `01_BACKEND.md`; fixtures by `03_DATA_QA.md`.*
