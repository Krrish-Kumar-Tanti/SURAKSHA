# SIH 2026 AICTE — Agent Talking & Handoff Protocol

**Document control**

| Field | Value |
|---|---|
| Version | 1.1 |
| Prepared | 25 Oct 2026 |
| Owner | OpenCode (lead researcher / architect) |
| Audience | Boss, Kiro, anti-gravity, auditor agents, any future agent |
| Companion files | `26265.md` (build brief), `context.md` (domain truth), `opponent.md` (competitive intelligence), `enhancement.md` (reuse plan) |
| Rule | If a claim is not in `context.md` or `opponent.md`, it is not approved for the PPT or jury answers until sourced and added. |

---

## 0. Read this first

Every agent must read, in this order:

1. `context.md` — the domain facts, PS briefs, decision matrix, winning solution, demo script, PPT outline, 36-hour plan, jury Q&A.
2. `26265.md` — the complete SIH26265 build brief for anti-gravity/Kiro.
3. `opponent.md` — the competitive landscape, strongest repos, live demos, gaps, and counters.
4. `enhancement.md` — anti-gravity’s reuse plan; ideas only, not policy truth.
5. `agent_talking.md` — this file: roles, truth protocol, task board, handoff template, definition of done, audit checklist.

If the files conflict, `context.md` wins for domain facts, `26265.md` wins for build detail, `opponent.md` wins for competitor facts, and this file wins for process. Flag the conflict; do not silently pick one.

---

## 1. Mission and constraints

### 1.1 Mission

Pick one SIH 2026 AICTE problem statement, produce a winning idea PPT by **28 October 2026**, and if shortlisted build a working prototype that a jury can understand and trust in **7 minutes**.

### 1.2 Current recommendation

- **Primary:** `SIH26265` — Streamline of security deposit / FDR portal.
- **Fallback:** `SIH26262` — Integrated AICTE Approval Workflow Automation.
- **Third:** `SIH26264` — Complaint case dashboard.
- **Avoid:** `SIH26261`, `SIH26263` — crowded and high execution risk.
- **Status:** **LOCKED by Boss, 25 Oct 2026.** SIH26265 is the build target. 26262 remains fallback only; do not switch without a recorded Boss decision.

### 1.3 Non-negotiable constraints

- **No hallucination.** Every factual claim needs a source or a truth label.
- **No fake integrations.** Bank, AICTE, complaints, DigiLocker/eSign, APAAR/ABC, payments, and SMS/email are simulated unless proven otherwise. Label them.
- **No auto-approval of adverse actions.** The system is decision support; a human decides.
- **No competitor code copying.** Public repos are for analysis only. Build original code.
- **No secrets in the repo.** Use `.env.example`; never commit keys, tokens, or real institutional data.
- **No unsourced percentages.** Use targets and prototype measurements, not invented “70% reduction.”
- **No live debugging for more than 20 seconds** in the jury demo. Switch to the recorded fallback.
- **No scope creep.** Use the cut list in `context.md` §7.9.

### 1.4 User’s operating model

- The Boss is the decision-maker (“the brain”).
- OpenCode is the lead researcher/architect and the Boss’s right hand.
- Kiro and anti-gravity work under OpenCode’s direction.
- Other agents audit; they do not silently rewrite the plan.
- The Boss can override any recommendation; record the override in the decision log.

---

## 2. Roles and authority

| Role | Owns | Can decide | Must escalate |
|---|---|---|---|
| **Boss** | Final PS choice, team composition, submission, external communication | Anything | Nothing; final authority |
| **OpenCode** | Research, architecture, `context.md`, `opponent.md`, `agent_talking.md`, task assignment, integration, final technical review | Technical approach within approved scope | PS change, scope change, external claims, legal/policy interpretation beyond public APH text |
| **Kiro** | Backend, data model, policy engine, tests, deployment | Implementation details, libraries, schema | Policy ambiguity, security trade-off, timeline slip |
| **anti-gravity** | Frontend, UX, visual design, demo choreography, video fallback | UI/UX details, component structure | Missing data, scope creep, demo flow change |
| **Auditor agents** | Independent review, red team, source checks, security checks | Pass/fail on their checklist | Any unsupported claim, security issue, copied code, broken demo |

**Rule:** one owner per task. “Everyone” is not an owner. If two agents touch the same file, the owner must merge; no parallel edits without a handoff.

---

## 3. Truth protocol

### 3.1 Labels

Use exactly these labels in docs, slides, and jury answers:

- `[FACT]` — directly supported by a primary/official source or by direct inspection; source given.
- `[INFERENCE]` — a reasoned conclusion from facts; not a primary-source claim.
- `[UNVERIFIED]` — secondary source or plausible but not confirmed; do not state as fact.
- `[OPINION]` — a strategic judgement; can be debated.

### 3.2 Source rules

1. Prefer official sources: AICTE APH, AICTE addendum, PIB, APAAR/ABC, SIH portal.
2. If the official site is down, use the Zaid mirror and label it “mirror of official text.”
3. For competitor claims, cite the repo README or code; do not infer quality from stars.
4. For live demos, record the URL, HTTP status, and retrieval date. A 200 is not a QA pass.
5. For policy, cite the clause and the exact document/version. If the version is uncertain, say so.
6. If a source conflicts, show both and explain the discrepancy. Do not average or guess.

### 3.3 Editing rules

- Add new facts to `context.md` with a source and a label.
- Add new competitor facts to `opponent.md` with a repo URL and date.
- Add new process decisions to this file’s decision log.
- Never delete a `[FACT]` without a replacement source.
- Never upgrade `[UNVERIFIED]` to `[FACT]` without primary evidence.
- Keep the source ledger current.

### 3.4 Claim checklist before a slide or answer

- Is it true?
- Is it sourced?
- Is it labeled?
- Is it relevant to the PS?
- Is it something the jury can verify or that we can demo?
- If it is simulated, is it labeled “simulated”?
- If it is a target, is it labeled “target” rather than “result”?

---

## 4. Decision log

### 4.1 Accepted decisions

| ID | Decision | Rationale | Owner | Status |
|---|---|---|---|---|
| D1 | Primary PS: `SIH26265` | Lowest strong-competitor density; bounded lifecycle; policy moat; strong ₹ story | Boss | **Locked 25 Oct 2026** |
| D2 | Fallback PS: `SIH26262` | Viable workflow product; APH-native compiler wedge; less visually strong | OpenCode recommendation | Accepted as fallback |
| D3 | Avoid `SIH26261` and `SIH26263` | Crowded; national-quality incumbents; high 36h execution risk | OpenCode recommendation | Accepted |
| D4 | Third choice: `SIH26264` | Strong incumbent; narrower differentiation | OpenCode recommendation | Accepted |
| D5 | Working name: **SURAKSHA** | Placeholder; check trademark before final | OpenCode | Accepted as placeholder |
| D6 | Build a **policy-native control tower**, not another CRUD portal | Differentiation: exact rules, provenance, release graph, forecast, audit | OpenCode | Accepted |
| D7 | Use a **hash-chained audit log**, not blockchain | Tamper-evidence without consensus overhead | OpenCode | Accepted |
| D8 | Simulate bank/AICTE/complaint/APAAR/DigiLocker integrations with labels | No confirmed production API access; honesty is a differentiator | OpenCode | Accepted |
| D9 | Local-first demo + recorded fallback video | Avoid live cloud failure; 404 competitor homepage is a warning | OpenCode | Accepted |
| D10 | 6-slide idea PPT outline in `context.md` §7.8 | Fits SIH idea stage; one idea per slide | OpenCode | Accepted |
| D11 | 36-hour build plan in `context.md` §7.9 | Feasible with 3 builders + 1 presenter/QA + agents | OpenCode | Accepted |
| D12 | No competitor code copying | Legal/ethical; original work only | OpenCode | Accepted |
| D13 | Add a plain-language APH/Addendum section to `context.md` and `26265.md` | The Boss asked what APH is; the jury will ask the same. Explain rulebook vs. amendment before clauses | OpenCode | Done |
| D14 | Add official AICTE circular lead with `[UNVERIFIED]` label | The circular directly supports the PS pain, but the official PDF 404s; honesty + evidence | OpenCode | Done |
| D15 | Treat `enhancement.md` as idea input, not policy truth | Reuse ideas are strong; clause labels contain errors (2.21 closure, 4.10 university SD) | OpenCode | Accepted |
| D16 | Keep research papers as design rationale only | No direct AICTE FDR paper found; do not present general literature as AICTE fact | OpenCode | Accepted |

### 4.2 Pending decisions

| ID | Question | Options | Owner | Deadline |
|---|---|---|---|---|
| P1 | Final PS choice | **CLOSED — 26265 locked** | Boss | 25 Oct 2026 |
| P2 | Team composition | Who builds backend/frontend/PPT/demo? | Boss | 25 Oct 2026 EOD |
| P3 | Backend stack | Python/FastAPI vs Node/Express | Kiro + OpenCode | 26 Oct 2026 |
| P4 | Product name | SURAKSHA vs alternative | Boss | 27 Oct 2026 |
| P5 | Fresher idea counts | Use 25 Oct image or newer screenshot? | Boss | 27 Oct 2026 |
| P6 | Deployment target | Local + Vercel/Render vs local-only | Kiro + anti-gravity | 26 Oct 2026 |
| P7 | BG support | Include Bank Guarantee as an instrument family? | OpenCode | 26 Oct 2026 |
| P8 | OCR depth | Real OCR vs seeded extraction + manual review | Kiro | 26 Oct 2026 |
| P9 | Legal review | Any external legal/policy review available? | Boss | 27 Oct 2026 |

### 4.3 Decision rules

- If the Boss overrides a recommendation, record it here with the date and reason.
- If a decision changes scope, update `context.md` and the task board the same day.
- If a decision is blocked for more than 2 hours, escalate; do not wait silently.
- If two agents disagree, OpenCode decides technical matters; Boss decides product/PS matters.

---

## 5. Workstreams and task board

### 5.1 Status legend

- `TODO` — not started.
- `IN_PROGRESS` — one owner actively working.
- `BLOCKED` — waiting on a decision/source/another task.
- `REVIEW` — done by owner, awaiting audit.
- `DONE` — audited and accepted.

### 5.2 Task board

| ID | Task | Owner | Status | Acceptance |
|---|---|---|---|---|
| T0 | Lock PS choice and scope | Boss | DONE | SIH26265 locked in §4 (25 Oct 2026) |
| T1 | Audit `context.md` for unsupported claims | OpenCode + Auditor | REVIEW | Every `[FACT]` has a source; ambiguities fixed |
| T2 | Write `opponent.md` | OpenCode | DONE | Repo inventory, deep dives, live demos, LinkedIn negative results |
| T2.5 | Review anti-gravity `enhancement.md` | OpenCode | DONE | Reuse plan accepted as idea input; clause mislabels flagged |
| T2.6 | APH/Addendum/circular research + plain-language guide | OpenCode | DONE | `context.md` §4.0 and `26265.md` §4.0; source ledger updated |
| T3 | Write `agent_talking.md` | OpenCode | DONE | Roles, truth protocol, task board, handoff, audit, risks |
| T4 | Idea PPT narrative + visual design | Boss + anti-gravity | TODO | 6 slides; one idea per slide; citations; simulated footnote |
| T5 | Architecture + data model | Kiro + OpenCode | TODO | Institution/instrument/document/audit/obligation schemas; ERD |
| T6 | Policy engine + requirement calculator | Kiro + OpenCode | TODO | Table 1.4, 50% concession, leased ×2, exemptions, 10-year clock; tests |
| T7 | Penalty engine | Kiro + OpenCode | TODO | 10%/20%/10%/50%; extension/forfeiture routed to human; tests |
| T8 | Intake + OCR + three-way provenance | Kiro | TODO | Declared/document/bank fields; discrepancy evidence; tests |
| T9 | Release eligibility graph | Kiro | TODO | 6.46 clearances; RTGS vs FDR/RPGF; maker-checker-approver; tests |
| T10 | Institution + RB dashboards | anti-gravity | TODO | Status, queue, alerts, ₹ at risk, drill-downs |
| T11 | Time machine + reminders + escalation | anti-gravity + Kiro | TODO | T-90/60/30/15/7/0; L1/L2/L3; demo clock |
| T12 | Maturity cash-flow forecast | anti-gravity | TODO | ₹ by quarter; renewals vs releases; at-risk |
| T13 | Pledge graph | anti-gravity | TODO | Duplicate instrument/hash; one FDR two institutions; visual graph |
| T14 | Evidence vault + hash-chained audit | Kiro | TODO | SHA-256, AES-256-GCM, verify endpoint, export |
| T15 | Seed data + hero/contrast cases | anti-gravity + Boss | TODO | Engineering UG leased ₹70L; NE 50% case; maturity/release cases |
| T16 | Tests (policy + release + audit) | Kiro + Auditor | TODO | Edge cases pass; no P0 bugs |
| T17 | Deploy + recorded fallback video | Kiro + anti-gravity | TODO | Local demo stable; video < 3 min; no secrets |
| T18 | Jury Q&A bank | Boss + OpenCode | TODO | 20 answers from `context.md`; no unsourced claims |
| T19 | Final audit | Auditor | TODO | Claims, security, demo, PPT, integration labels |
| T20 | Submit idea PPT | Boss | TODO | By 28 Oct 2026; PDF + portal upload |

### 5.3 Workstream ownership

**Policy & domain (OpenCode + Kiro)**

- APH 2024-27 + 2026-27 addendum rules.
- Table 1.4, 50% concession, leased multiplier, exemptions, RPGF.
- 10-year hold, interest retention, penalties, release graph.
- Clause citations and policy diff screen.

**Provenance & evidence (Kiro)**

- Document upload, SHA-256, AES-256-GCM.
- OCR/extraction; declared vs document vs bank.
- Discrepancy rules with evidence pointers and dispositions.
- Bank adapter with `FOUND/NOT_FOUND/ENCASHED/CLOSED/UNSUPPORTED/SOURCE_UNAVAILABLE`.

**Lifecycle & portfolio (anti-gravity + Kiro)**

- Status machine, reminders, escalation, renewal lineage.
- Time machine, maturity forecast, pledge graph.
- Dashboards and reports.

**Demo & narrative (Boss + anti-gravity + OpenCode)**

- 7-minute script, seed data, hero/contrast cases.
- PPT, video fallback, jury Q&A.
- “What is simulated” footnote.

---

## 6. Definition of done

### 6.1 Research/artifact

- All claims labeled and sourced.
- No known contradictions with `context.md`/`opponent.md`.
- Audience and purpose stated.
- Owner and version recorded.
- Auditor sign-off.

### 6.2 Code

- Runs locally from a clean checkout with documented commands.
- Tests pass; lint/typecheck pass.
- No secrets, no real PII, no copied competitor code.
- RBAC enforced; audit event written for every state change.
- Errors handled; no stack traces to users.
- Seed data is labeled synthetic.
- README updated with run/test/demo steps.

### 6.3 Demo

- 7 minutes, run end-to-end twice without a crash.
- One hero case + one contrast case.
- Every screen has a purpose; no dead ends.
- Simulated integrations labeled on screen.
- Recorded fallback video ready.
- No live debugging > 20 seconds.
- Jury can click “verify audit” and see a valid chain.

### 6.4 PPT

- 6 slides; one idea per slide.
- Official PS ID and title.
- Problem, solution, architecture, impact/differentiation, feasibility/roadmap.
- At least one exact APH clause citation.
- Metrics labeled target/measurement, not proven.
- “What is simulated” footnote.
- No wall of text; readable at projection size.
- Team names/roles included.

### 6.5 Jury answer

- Short (10–20 seconds), then evidence/screen.
- Cites a rule or a demo screen.
- Says “that is an open policy question; we route it to the competent authority” when appropriate.
- Never claims a real integration that is simulated.
- Never invents a number.

---

## 7. Handoff template

Every handoff must use this template. No free-form “done” messages.

```
FROM:
TO:
TASK ID:
STATUS: TODO | IN_PROGRESS | BLOCKED | REVIEW | DONE
WHAT I DID:
FILES CHANGED:
EVIDENCE (test output, screenshot, source URL):
DECISIONS MADE:
RISKS / BLOCKERS:
WHAT I NEED FROM YOU:
NEXT OWNER / NEXT ACTION:
```

### 7.1 Handoff rules

- One task per handoff. Do not bundle unrelated work.
- Include the exact command to reproduce the evidence.
- If blocked, state the blocker and the decision needed; do not hand off a vague “needs work.”
- If you changed a shared file, say so explicitly.
- If you disagree with a decision, say so in the handoff; do not silently deviate.
- The receiving agent must acknowledge and either accept or return with questions.

### 7.2 Example handoff

```
FROM: Kiro
TO: OpenCode
TASK ID: T6
STATUS: REVIEW
WHAT I DID: Implemented requirement calculator for Table 1.4, 50% concession, leased ×2, and exemptions. Added 14 policy tests.
FILES CHANGED: services/api/policy/calculator.py, tests/test_policy_calculator.py
EVIDENCE: `pytest tests/test_policy_calculator.py -q` -> 14 passed. Screenshot `artifacts/policy-trace.png`.
DECISIONS MADE: Used integer paise to avoid float rounding; location category is a single enum with `aspirational_district` as a boolean flag.
RISKS / BLOCKERS: Addendum item 11 removes “private”; I interpreted it as all leased building/land. Need OpenCode confirmation.
WHAT I NEED FROM YOU: Confirm interpretation; review clause citations in the trace output.
NEXT OWNER / NEXT ACTION: OpenCode to audit, then anti-gravity to wire the policy trace screen.
```

---

## 8. Audit protocol

### 8.1 Auditor checklist — claims

- [ ] Every `[FACT]` has a source URL/document and retrieval date.
- [ ] Every `[INFERENCE]` is labeled and reasonable.
- [ ] Every `[UNVERIFIED]` is not presented as fact.
- [ ] No invented statistics, clause numbers, or API capabilities.
- [ ] No claim of “integrated with X” unless it is real and labeled.
- [ ] No claim of “AI-powered” without an evaluation or a clear advisory label.
- [ ] No claim of “blockchain” unless there is a real chain; otherwise say “hash-chained audit.”
- [ ] Competitor claims match their README/code.
- [ ] Idea counts are labeled as snapshots.

### 8.2 Auditor checklist — code

- [ ] No secrets in the repo or git history.
- [ ] No real PII/institutional data.
- [ ] No copied competitor code/assets.
- [ ] RBAC enforced on every route.
- [ ] Audit event on every state change.
- [ ] Policy tests cover Table 1.4, 50%, leased ×2, exemptions, penalties.
- [ ] Release graph tests cover blocked/allowed/needs-info/pending-source.
- [ ] Duplicate instrument/hash detection tests.
- [ ] Hash-chain verify endpoint works after tampering.
- [ ] Error handling does not leak stack traces.
- [ ] Lint/typecheck/tests pass.
- [ ] Seed data labeled synthetic.

### 8.3 Auditor checklist — demo

- [ ] 7-minute script matches the actual screens.
- [ ] Hero case and contrast case work.
- [ ] Policy trace shows base → concession → leased → required.
- [ ] Release graph blocks on a missing clearance and then allows after clearance.
- [ ] Time machine advances and shows reminders/escalation.
- [ ] Pledge graph shows one FDR linked to two institutions.
- [ ] Audit verify passes.
- [ ] Fallback video plays.
- [ ] No live debugging > 20 seconds.
- [ ] All simulated screens labeled.

### 8.4 Auditor checklist — PPT

- [ ] 6 slides, one idea each.
- [ ] Official PS ID/title.
- [ ] Problem has real evidence.
- [ ] Solution has a clear differentiator.
- [ ] Architecture is understandable in 30 seconds.
- [ ] Impact metrics are targets, not invented results.
- [ ] Feasibility/roadmap is credible.
- [ ] At least one clause citation.
- [ ] “What is simulated” footnote.
- [ ] No wall of text.

### 8.5 Audit outcome

- `PASS` — no P0/P1 issues.
- `PASS WITH FIXES` — P2 issues; owner fixes before submission.
- `FAIL` — any P0 (unsupported claim, security leak, broken core demo, copied code). Owner fixes and re-audits.

---

## 9. Risk register

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | Wrong PS choice; 26265 becomes crowded | Medium | High | Check fresher counts; keep 26262 fallback; decide by 25 Oct EOD | Boss |
| R2 | Policy misreading or wrong addendum version | Medium | High | Cite clause + document; label version uncertainty; auditor check; route ambiguous cases to human | OpenCode |
| R3 | Scope creep; too many modules | High | High | Use cut list; ship policy/provenance/release/time machine/audit first | OpenCode |
| R4 | OCR unreliable on synthetic FDRs | Medium | Medium | Use text-layer extraction first; seeded extraction + manual review; label OCR confidence | Kiro |
| R5 | Live demo fails | Medium | High | Local-first demo; recorded video; no live debugging > 20s | anti-gravity |
| R6 | Team availability/roles unclear | Medium | High | Lock roles by 25 Oct EOD; one owner per task | Boss |
| R7 | No real bank/APAAR/DigiLocker APIs | High | Medium | Label simulated; adapter interface; MoU path in roadmap | OpenCode |
| R8 | Jury asks a legal question we cannot answer | High | Medium | Say “open policy question; routed to competent authority”; do not improvise law | Boss |
| R9 | Competitor has a stronger live demo | Medium | Medium | Compete on policy accuracy/evidence/demo clarity; do not attack by name | OpenCode |
| R10 | Data privacy/security issue | Low | High | Synthetic data only; RBAC; encryption; no PII in logs; auditor check | Kiro |
| R11 | Deadline slip | Medium | High | 28 Oct submission; PPT first, prototype only if shortlisted; daily checkpoints | Boss |
| R12 | Name/trademark conflict | Low | Medium | Check “SURAKSHA” before final; have backup name | Boss |
| R13 | Idea counts stale/inconsistent | High | Low | Label as snapshot; avoid precise claims in PPT | OpenCode |
| R14 | Overclaiming “zero simulation” | Medium | High | Integration label on every screen; auditor check | OpenCode |
| R15 | Copying competitor code accidentally | Low | High | Independent implementation; no code paste; license check; auditor scan | Kiro |

---

## 10. Immediate actions

### 10.1 Next 24 hours (25–26 Oct 2026)

| Time | Action | Owner | Output |
|---|---|---|---|
| 25 Oct EOD | ~~Confirm PS choice (26265 primary / 26262 fallback)~~ | Boss | **DONE — 26265 locked** |
| 25 Oct EOD | Confirm team roles and availability | Boss | Roles table filled |
| 25 Oct EOD | Audit `context.md` claims and fix ambiguities | OpenCode + Auditor | Patched `context.md` v1.2 |
| 26 Oct AM | Lock architecture, data model, stack | Kiro + OpenCode | ERD + stack decision |
| 26 Oct AM | Draft 6-slide PPT narrative | OpenCode + Boss | Slide outline with evidence |
| 26 Oct PM | Design wireframes for provenance/policy/release/time machine | anti-gravity | 4 key screens |
| 26 Oct PM | Build policy engine + tests | Kiro | Table 1.4/50%/leased/exemptions/penalties tests pass |
| 26 Oct PM | Red-team the claims and demo plan | Auditor | Audit note |

### 10.2 27 October 2026

- PPT v1 with visuals.
- Policy trace + release graph working on seed data.
- Time machine + forecast skeleton.
- Jury Q&A dry run.
- Fix P0/P1 audit issues.

### 10.3 28 October 2026

- PPT final; PDF export; simulated footnote.
- Two full 7-minute dry runs.
- Submit to SIH portal.
- Freeze; no new features.

---

## 11. 36-hour build plan (post-shortlist)

| Block | Hours | Owner | Deliverable | Acceptance |
|---|---:|---|---|---|
| B0 | 0–2 | All | Repo, CI, env, seed data, auth skeleton, deploy target | Tests green; app loads |
| B1 | 2–8 | Kiro | DB schema + institution/instrument APIs + document upload + SHA/AES | CRUD + upload + audit event |
| B2 | 8–14 | Kiro + OpenCode | Policy engine + requirement calculator + penalty rules + tests | Table 1.4, 50%, leased ×2, exemptions, 10%/20%/10%/50% pass |
| B3 | 14–20 | anti-gravity | Institution/RB dashboards; provenance screen; discrepancy evidence | Screens work on seeded data |
| B4 | 20–26 | Kiro | Release eligibility graph + clearances + maker-checker-approver + NOC letter | Blocked/allowed scenarios pass |
| B5 | 26–30 | anti-gravity | Time machine, reminders, maturity forecast, pledge graph | Demo steps 4–6 work |
| B6 | 30–34 | All | End-to-end demo data, video fallback, PPT v2, jury Q&A | 7-minute run-through twice |
| B7 | 34–36 | Auditor + Boss | Audit, security check, final deploy, submit | No P0 bugs; truth labels correct |

**Cut list if behind:** pledge graph → maturity forecast → eSign → BG support → multi-language. **Keep:** policy engine, provenance, release graph, time machine, audit.

---

## 12. Demo ownership

| Time | Screen | Owner | Must show |
|---:|---|---|---|
| 0:00–0:40 | Home / portfolio | anti-gravity | Active, expiring, ₹ at risk, upcoming maturities |
| 0:40–1:40 | Institution submission | Kiro | Upload FDR; OCR extracts amount/dates/IFSC/lien |
| 1:40–2:30 | Provenance | Kiro | Declared vs document vs bank; mismatch evidence |
| 2:30–3:20 | Policy Pack | OpenCode | Base 35L → leased ×2 → 70L; NE → 17.5L; clause citations |
| 3:20–4:10 | Release request | Kiro | Graph blocks on PGRC/Vigilance; exact missing clearance |
| 4:10–4:50 | Clearances | Kiro | Clear; maker-checker-approver; NOC/release letter |
| 4:50–5:40 | Time machine | anti-gravity | Advance 90 days; reminder, maturity, escalation, renewal, forecast |
| 5:40–6:30 | Pledge graph / fraud | anti-gravity | One FDR pledged to two institutions; block |
| 6:30–7:00 | Audit | Kiro | Verify hash chain; export |

**Fallback:** recorded 3-minute video + screenshots. Never debug live for more than 20 seconds.

---

## 13. Jury Q&A ownership

| Topic | Owner | Key point |
|---|---|---|
| Why this PS / why not Excel | Boss | Provenance, release clearances, audit, ₹ at risk |
| Policy rules / addendum | OpenCode | 50% concession, leased ×2, RPGF, clause citations |
| Interest / 10-year hold | OpenCode | Interest retained; principal returned; track separately |
| Bank integration | Kiro | Adapter with API/letter/sandbox; MoU-gated; labeled |
| Early encashment / penalties | OpenCode | Bank re-check; 10% Clause 7.7; human approval |
| Duplicate FDR / fraud | anti-gravity | Instrument number, file hash, bank confirmation, pledge graph |
| Release with pending complaint | Kiro | Graph blocks; shows missing PGRC/Vigilance clearance |
| Bank “not found” | Kiro | `NOT_FOUND`/`SOURCE_UNAVAILABLE`; manual review; no auto-reject |
| Scalability | Kiro | Postgres, object storage, async jobs, indexes, audit partitioning |
| Moat | OpenCode | Policy Pack + release graph + provenance + forecast |
| Institution adoption | Boss | One window, status, fewer queries, reminders, faster release |
| AICTE adoption | Boss | ₹ at-risk visibility, release control, audit, workload |
| What is simulated | OpenCode | Bank/AICTE/complaints/DigiLocker/APAAR/payments; labeled |
| Privacy | Kiro | RBAC, field encryption, masked PII, audit, retention |
| Disputed finding | OpenCode | Evidence + disposition; officer can waive with reason |
| After 10 years | OpenCode | Compute maturity; eligibility; NOC/sanction; human decision |
| Difference from strongest repo | OpenCode | They built a portal; we add the compliance brain |
| 5-minute demo | Boss | Submit → mismatch → policy trace → release block → clearance → time machine → audit |
| Blockchain? | OpenCode | Hash-chained audit gives tamper-evidence; blockchain optional later |
| Legal review | Boss | Public APH text encoded; real deployment needs AICTE sign-off |

---

## 14. Repo and file map

### 14.1 Current docs

```
/Users/harshtanti/Krrish/newsihps/
├── 26265.md            # complete product & build brief for SURAKSHA (SIH26265)
├── enhancement.md      # amplification master plan fusing PackParakh, Ekam, SchemeSaathi & EduSphere
├── context.md          # domain truth, decision matrix, winning plan
├── opponent.md         # competitive intelligence
├── agent_talking.md    # this protocol
└── Pasted 2026-10-25 at 5.43.42 PM.heic
```

### 14.2 Proposed code layout (not created yet)

```
/apps/web                 # React/TS frontend
/services/api             # FastAPI or Node backend
/packages/policy          # versioned APH rules + calculator
/packages/shared          # types, schemas, constants
/seed                     # synthetic institutions/instruments/documents
/docs                     # demo script, jury Q&A, architecture
/tests                    # policy, release, audit, e2e
```

**Rule:** do not create code directories until the Boss signs off on the PS and stack.

### 14.3 External working directories

- `/var/folders/zq/73xp1m952_dc7t8l80ykqtb00000gn/T/opencode/competitors` — cloned repos (analysis only).
- `/var/folders/zq/73xp1m952_dc7t8l80ykqtb00000gn/T/opencode/aicte/aph.pdf` and `aph.txt` — APH source/text.
- `/var/folders/zq/73xp1m952_dc7t8l80ykqtb00000gn/T/opencode/aicte2/addendum_blob.pdf` and `addendum_blob.txt` — 2026-27 addendum source/text.

---

## 15. Communication rules

1. **Start with the task ID and status.** Example: `T6 REVIEW — policy calculator done, 14 tests pass.`
2. **Evidence over adjectives.** Link the test output, screenshot, or source. Do not say “looks good.”
3. **One owner per task.** If you need help, ask; do not silently fork the work.
4. **Escalate blockers within 30 minutes.** Do not sit on a missing decision.
5. **No silent scope changes.** If it is not in the task board, it is not in scope.
6. **No unsourced claims in chat either.** If you are unsure, label it `[UNVERIFIED]`.
7. **No competitor bashing by name.** Discuss patterns, not people.
8. **No legal advice.** We encode public APH text; real deployment needs AICTE/legal sign-off.
9. **Keep the Boss’s time scarce.** Summarize in 3 bullets; put details in docs.
10. **When in doubt, ask the Boss.** A 30-second question is cheaper than a wrong build.

---

## 16. Current state summary

- `context.md` v1.2 written and audited; APH/Addendum plain-language guide, official AICTE circular lead, PS lock, and research notes added.
- `opponent.md` v1.0 written; full repo inventory and counters.
- `agent_talking.md` v1.1 written (this file).
- `26265.md` v1.1 written by OpenCode: complete product/build brief for SURAKSHA; includes APH/Addendum plain-language section and updated source ledger.
- `enhancement.md` written by Antigravity: reuse ideas from PackParakh, Ekam, SchemeSaathi, EduSphere. Accepted as idea input, **not policy truth**. Known mislabels: Clause 2.21 is closure, not joint pledge; Clause 4.10 is university SD exemption, not land-lease; its “5 NOCs” list is broader than APH 6.46. Use `26265.md` §4 for policy.
- PS choice: **26265 locked by Boss**.
- No code written yet.
- Next action: Boss reviews `enhancement.md` and `26265.md`; OpenCode/anti-gravity produce the 6-slide PPT and clickable screens; Kiro starts the policy engine.

---

## 17. Agent Handoff Log

```
FROM: Antigravity
TO: OpenCode
TASK ID: T2.5 - Past Projects Stack & Enhancement Fusion
STATUS: DONE
WHAT I DID:
- Analyzed 26265.md in complete detail.
- Audited Boss's 4 past production repositories:
  1. PackParakh (/Users/harshtanti/Krrish/Packparakh1.0) -> Gemini Vision multi-script OCR, side-by-side bbox visual proof, deterministic rule engine, Form-V notice generator, and full 5-Language production i18n system (English, Hindi, Bengali, Tamil, Telugu).
  2. Ekam (/Users/harshtanti/Krrish/amazon developer hackathon) -> MCP micro-tools, dual-engine offline fail-safe, financial confirm gate, audit.jsonl, neural voice.
  3. SchemeSaathi (/Users/harshtanti/Krrish/SchemeSaathi) -> Multi-parameter concession matching engine, bilingual UI (Hindi/English), WhatsApp/SMS bridge, live impact counters.
  4. EduSphere (/Users/harshtanti/Krrish/edusphere) -> Campus RBAC hierarchy, Clause 6.46 multi-department clearance matrix, interactive pitch deck with live embedded sandbox.
- Created /Users/harshtanti/Krrish/newsihps/enhancement.md with complete amplification blueprint.
FILES CHANGED:
- Created: /Users/harshtanti/Krrish/newsihps/enhancement.md
- Updated: /Users/harshtanti/Krrish/newsihps/agent_talking.md (§14, §16, §17)
EVIDENCE: All files verified on disk; see /Users/harshtanti/Krrish/newsihps/enhancement.md
DECISIONS MADE: Retain 26265 as primary; inject past project assets to elevate SURAKSHA to 500%-1000%.
WHAT I NEED FROM YOU: Review enhancement.md and integrate the past project capabilities into the 6-slide PPT outline and final tech architecture.
NEXT OWNER / NEXT ACTION: OpenCode + Antigravity to prepare visual deck and screens.
```

```
FROM: OpenCode
TO: Anti-gravity
TASK ID: T2.6 - APH/Addendum/circular research + policy audit
STATUS: DONE
WHAT I DID:
- Added plain-language APH vs. Addendum explanation to context.md §4.0 and 26265.md §4.0.
- Added the official AICTE FDR-release circular lead (indexed 6 Oct 2025) as [UNVERIFIED]; direct PDF fetch returned 404.
- Added supporting research references and updated both source ledgers.
- Audited enhancement.md: reuse ideas accepted, but clause labels are not policy truth.
FILES CHANGED:
- context.md v1.2
- 26265.md v1.1
- agent_talking.md v1.1
EVIDENCE:
- APH cover: "This Handbook is a Legal Document..."
- Official AICTE page/node/3299 index the circular; official PDF 404 in our environment.
DECISIONS MADE:
- Use APH + 2026-27 Addendum as versioned rule packs.
- Do not claim the circular as verified until the PDF is obtained.
- Use 26265.md §4, not enhancement.md clause labels, for policy claims.
WHAT I NEED FROM YOU:
- Build the PPT and screens around 26265.md §4.0/§4; do not use "joint pledge Clause 2.21" or "land lease Clause 4.10" language.
NEXT OWNER / NEXT ACTION: Anti-gravity builds clickable screens 1-6 + three PPT screenshots; Kiro starts policy engine.
```
