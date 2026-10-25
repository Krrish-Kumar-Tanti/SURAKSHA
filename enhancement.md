# SURAKSHA (SIH26265) Enhancement & Reuse Plan — Audited v2.0

**Document control**

| Field | Value |
|---|---|
| Version | 2.0 (audited; supersedes Antigravity v1.0) |
| Prepared | 25 October 2026 |
| Owner | OpenCode (lead researcher / architect) |
| Original author | Antigravity (pair programming partner) |
| Audience | Boss, Kiro, anti-gravity, Auditor |
| Companion files | `26265.md`, `context.md`, `opponent.md`, `agent_talking.md` |
| Rule | `context.md` §4 and `26265.md` §4 are policy truth. This file is an idea/reuse plan, not legal or policy authority. |

> **Audit note (OpenCode, 25 Oct 2026):** v1.0 overstated several assets and invented file paths. This version keeps the useful reuse ideas but marks what is verified, missing, or inflated. Do not put an unverified tag in the PPT or jury answers. The four projects help selectively; they do not add up to “500–1000%.”

---

## 1. Verdict: are the four projects good to reuse?

`[OPINION]` Yes, selectively. They are a pattern library, not four plug-in modules.

| Project | Verified assets | Missing / inflated claim | Safe reuse |
|---|---|---|---|
| **PackParakh** | Deterministic rule-engine structure; Gemini Vision extractor; local OCR fallback; inline bounding-box overlay; PDF generators; 5-language UI | README says “24 rules”; code has 9 substantive evaluators + 4 placeholder PASS rules. “Multi-script Indic OCR” / “148 tests” not verified. Three file paths are wrong. | Rule-engine architecture, evidence bbox pattern, PDF pattern, 5-language i18n |
| **Ekam** | 11-tool MCP server; proposal/confirm gate; append-only JSONL audit; optional Polly voice; deterministic offline router | No separate `confirm_gate.py` or `voice_synthesizer.py`; audit is not hash-chained; Bedrock was denied by AWS; “cryptographic 2-key gate” is not in the code | MCP/tool-adapter pattern, proposal/confirm state machine, offline demo shield, voice concept |
| **SchemeSaathi** | Bilingual EN/HI UI; simple filter/scoring logic; WhatsApp deep link; animated impact counters | Local `schemes.json` has **100 schemes**, not 800+; no `matching_engine.py`; no `whatsapp_notifier.py`; no SMS/notification service; counters are synthetic | Bilingual UX, simple eligibility-filter pattern, counter visual; not the 800+ claim |
| **EduSphere** | Single-file interactive pitch deck with simulated student/teacher/HOD/staff views | No `campus_roles.sql`, no `ClearanceMatrix.tsx`, no RBAC backend, no clearance matrix. It is a presentation artifact, not a campus product. | Deck interaction, visual language, “presentation + live sandbox” format |

### 1.1 PackParakh — verified detail

- **Real files:** `shared/rules.ts`, `server/src/database/schema.sql`, `server/src/services/geminiVision.ts`, `server/src/services/localOcr.ts`, `server/src/services/pdfGenerator.ts`, `server/src/services/acknowledgementPdf.ts`, `client/lib/LanguageContext.tsx`, `client/lib/i18n.ts`, `client/lib/i18n-pages/`, `client/app/verdict/page.tsx`.
- **Real rule engine:** `shared/rules.ts` contains 9 substantive evaluators (`6.1 A/B/C/D/E/F/G`, `6.11`, `7 font height`) plus 4 placeholder rules that always return PASS. The README’s “24 codified rules” is not supported by the visible engine.
- **Real bbox evidence:** The overlay is inline in `client/app/verdict/page.tsx`; there is no `components/EvidenceViewer.tsx`.
- **Real PDF generation:** `pdfGenerator.ts` and `acknowledgementPdf.ts`; there is no `templates/legal_notice_pdf.ts`.
- **Real i18n:** English, Hindi, Bengali, Tamil, Telugu UI strings. This is UI localization, not multi-script OCR.
- **OCR caveat:** `geminiVision.ts` uses an English Legal Metrology prompt. No verified Devanagari/Bengali/Tamil/Telugu OCR evaluation. Do not claim multi-script OCR.
- **Safe reuse:** rule structure, evidence-linked output pattern, PDF memo pattern, 5-language UI. Build the APH rules fresh.

### 1.2 Ekam — verified detail

- **Real files:** `mcp-server/server.py`, `agent/agent.py`, `api/main.py`, `data/audit.jsonl` (745 lines).
- **Real MCP:** 11 tools, MCP spec `2025-11-25`, `POST /mcp`; no separate `aictc_tools.py`.
- **Real confirm gate:** `tool_propose_order` stages a proposal; `tool_confirm_order` consumes it once. It is a simple state machine, not cryptographic two-key approval. There is no `agent/confirm_gate.py`.
- **Real audit:** append-only JSONL tool-call ledger. It is **not** hash-chained and not tamper-evident by itself.
- **Real voice:** Polly endpoint in `api/main.py`; browser fallback. There is no `utils/voice_synthesizer.py`.
- **Real fallback:** deterministic keyword router is the default; Bedrock is optional and was denied by AWS for the original account.
- **Safe reuse:** MCP/adaptor shape, confirm-gate pattern, offline-first demo discipline, voice briefing concept. Build the AICTE release gate and hash chain fresh.

### 1.3 SchemeSaathi — verified detail

- **Real files:** `frontend/lib/matchSchemes.js`, `frontend/lib/translations.js`, `frontend/context/LanguageContext.js`, `frontend/components/WhatsAppButton.jsx`, `frontend/components/ImpactStats.jsx`, `backend/main.py`, `backend/schemes.json`.
- **Real data:** `backend/schemes.json` has **100** entries. README says 800+; do not repeat that for the local repo.
- **Real language:** English and Hindi only. The roadmap says 12 regional languages are future work.
- **Real WhatsApp:** a floating `wa.me` deep link. There is no SMS sender, notification service, or `services/whatsapp_notifier.py`.
- **Real counters:** animated UI counters with synthetic values, not live government data.
- **Safe reuse:** bilingual toggle UX, simple eligibility-filter logic, counter visual. Do not claim an 800+ scheme engine.

### 1.4 EduSphere — verified detail

- **Real file:** `edusphere_pitch_deck.html` (plus PDF/PPTX exports).
- **What it is:** a 7-slide interactive pitch deck with simulated student, teacher, HOD, and staff screens.
- **What it is not:** no database schema, no RBAC backend, no Chairman/Principal/Registrar/Finance roles, no clearance matrix, no `schema/campus_roles.sql`, no `components/ClearanceMatrix.tsx`.
- **Safe reuse:** deck structure and visual treatment; “presentation + embedded sandbox” idea. Do not claim campus RBAC.

---

## 2. What SURAKSHA should actually adopt

| SURAKSHA module | Source | Decision |
|---|---|---|
| M1 Institution 360 / Instrument Register | Build fresh | No past project has this domain model |
| M2 Three-way provenance | PackParakh pattern | Adopt field-by-field evidence + bbox concept; build fresh |
| M3 Policy Pack 2026-27 | Build fresh from APH | PackParakh’s rule structure is useful; its Legal Metrology rules are not |
| M4 Bank adapter | Build fresh | No project has a bank integration; sandbox only |
| M5 Lifecycle / reminders / time machine | SURAKSHA plan | Build fresh; Ekam’s offline discipline informs the demo |
| M6 Release eligibility graph | Build fresh from APH 6.46 | EduSphere has no code; ignore its “NOC matrix” tag |
| M7 Pledge graph / duplicate detection | SURAKSHA plan | Build fresh |
| M8 Maturity cash-flow forecast | SURAKSHA plan | Build fresh |
| M9 Evidence vault / audit | SURAKSHA plan + Ekam pattern | Hash-chain fresh; do not call Ekam’s JSONL tamper-evident |
| M10 Dashboards / RBAC | Build fresh | EduSphere is a deck, not an RBAC product |
| PDF memo | PackParakh pattern | Adopt generator pattern; cite APH clauses, not Legal Metrology |
| 5-language UI | PackParakh | Adopt if time allows; UI only, not OCR |
| Bilingual EN/HI | SchemeSaathi | Optional fallback; PackParakh already has 5 languages |
| Voice briefing | Ekam | Optional demo polish; no dependency on live AWS |
| Pitch deck | EduSphere | Adopt visual/interaction style |

### 2.1 Correct policy anchors

- **Clause 1.12 / Table 1.4:** who pays and how much.
- **Clause 1.12(iv)–(v):** 10-year hold; AICTE retains interest; principal returned.
- **Clause 2.21:** **closure of institution** and its 10%/50% release penalties. It is **not** a joint-pledge mandate.
- **Clause 2.25(f):** late-deposit penalty: 10% up to 31 May, 20% up to 31 July, withdrawal beyond.
- **Clause 4.10:** **university security-deposit exemption**, not a land-lease multiplier.
- **Clause 6.46:** release documents + PGRC + Vigilance + other cells/bureaus (grants) clearances; FDR/RPGF → NOC by Approval Bureau; RTGS → sanction order by Council; conditional financial-embezzlement NOC; converted-university complaint/disciplinary check; progressive-closure/merger “no students” certificate.
- **Clause 7.7:** 10% penalty for early encashment / non-deposit at LoA.
- **2026-27 Addendum Item 10:** 50% concession for NE/J&K/Ladakh/Aspirational Districts/A&N/Lakshadweep/women-only/PwD-only.
- **2026-27 Addendum Item 11:** leased building/land doubles the deposit.
- **2026-27 Addendum Items 36–37:** Clause 6.46 heading and Affidavit 6 include RPGF and RTGS.
- **Joint FDR / lien:** APH Affidavit 6 refers to a deposit in the joint name of the Trust Secretary and AICTE; Clause 2.20(d) records AICTE’s lien right in a trust dispute. Do not cite Clause 2.21 for this.

### 2.2 Correct release graph

Use the APH-named checks:

1. Application/request letter.
2. Affidavit 6.
3. FDR/RPGF proof or RTGS payment proof.
4. Latest LoA/EoA.
5. PGRC clearance.
6. Vigilance clearance.
7. Grants/other cells/bureaus clearance.
8. Financial-embezzlement NOC (if applicable).
9. Converted-university pending complaints/disciplinary proceedings check (if applicable).
10. Progressive-closure or merger “no students” certificate (if applicable; not needed if already matured).
11. Bank lien/discharge confirmation as a system-level control.
12. RTGS vs FDR/RPGF routing.

Do **not** label the following as APH 6.46 requirements: DTE NOC, faculty salary/PF verification, anti-ragging clearance, “zero complaints” for every release. They may be later system controls or policy additions, but they are not in Clause 6.46.

### 2.3 Correct demo claims

- Say “bank sandbox says ₹35 lakh” — not “the real bank API reveals.”
- Say “policy trace” — not “the system legally decides.”
- Say “the graph blocks release until the named clearance is recorded” — not “zero complaints is required for all releases.”
- Say “the system flags a discrepancy and proposes action” — not “Clause 2.25 violation” unless the facts match Clause 2.25.
- Label all integration screens **SIMULATED / SANDBOX**.
- Treat “500–1000%” as `[OPINION]`; do not put it in the PPT.

---

## 3. Rejected tags / corrected phrasing

| Do not use | Use instead |
|---|---|
| “24-rule deterministic engine” | “Rule-engine pattern; PackParakh has 9 substantive evaluators + 4 placeholders” |
| “Multi-script Indic OCR” | “Gemini Vision OCR; multi-script support not verified” |
| “148/148 tests” | “PackParakh README claims 148 tests; not independently verified” |
| “800+ schemes” | “100 schemes in the local SchemeSaathi seed” |
| “WhatsApp/SMS notification bridge” | “WhatsApp deep link; SMS/notifications simulated or not built” |
| “Live fund impact dashboards” | “Animated counters with synthetic demo values” |
| “Campus RBAC / multi-role hierarchy” | “Pitch-deck concept only; no RBAC implementation” |
| “Clause 6.46 clearance matrix from EduSphere” | “Build a fresh 6.46 graph; EduSphere has no code” |
| “2-key cryptographic confirm gate” | “Proposal/confirm state machine; build maker-checker-approver fresh” |
| “Hash-chained audit from Ekam” | “Ekam has append-only JSONL; SURAKSHA will build a hash chain” |
| “Clause 2.21 joint pledge” | “Clause 2.21 is closure; joint FDR is from Affidavit 6 / APH annexures” |
| “Clause 4.10 land lease 2×” | “Clause 4.10 is university exemption; leased ×2 is Addendum Item 11” |
| “Five external NOCs” | “6.46 clearances: PGRC, Vigilance, grants/other cells, plus conditional NOCs” |
| “500%–1000% amplification” | `[OPINION]` “selective reuse reduces build time and improves evidence UX” |

---

## 4. Proposed prototype layout

This is a plan, not created code.

```
prototype/
├── index.html            # dashboard + deck/sandbox mode
├── app.js                # routing, state, demo clock
├── style.css             # visual system
├── data/
│   ├── institutions.json # synthetic institutions
│   ├── seed_fdrs.json    # declared/document/bank provenance
│   ├── aph_rules.json    # Table 1.4 + Addendum 2026-27
│   └── audit_chain.jsonl # planned hash-chained audit
├── modules/
│   ├── ocr_engine.js     # seeded extraction + bbox; optional Gemini adapter
│   ├── policy_pack.js    # fresh APH calculator with rule trace
│   ├── confirm_gate.js   # fresh maker-checker-approver, not Ekam copy
│   ├── clearance_dag.js  # fresh 6.46 release graph
│   ├── pledge_graph.js   # duplicate instrument/hash detection
│   └── time_machine.js   # maturity, renewal, escalation
└── assets/               # synthetic FDR scans, labels
```

---

## 5. What to tell the Boss

1. All four projects are useful, but not as advertised. The strongest reusable assets are PackParakh’s rule/evidence/i18n patterns and Ekam’s confirm-gate/offline discipline.
2. Antigravity invented several file paths and capability tags. The corrected list is in §1–§3. We should not repeat those tags.
3. EduSphere is a pitch deck, not a campus RBAC product; SchemeSaathi has 100 schemes, not 800+; Ekam’s audit is not hash-chained; PackParakh’s engine has 9 substantive rules, not 24.
4. None of this blocks SIH26265. The policy moat is still ours; the reuse plan just needs honest labels.

---

## 6. Open message to Antigravity

Boss asks: **“Tell me what you are thinking. Are all these tags good to go or not?”**

OpenCode’s answer: **No, not all.** Reconcile every tag in your v1.0 against the actual paths and counts above. Keep the good reuse ideas; remove or relabel the invented ones. Then rebuild the PPT/screens using `26265.md` §4 and this file’s corrected phrasings.
