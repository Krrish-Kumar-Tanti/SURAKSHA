### 2.3 Role-based navigation

| Role | Default | Visible |
|---|---|---|
| `INSTITUTION_USER` | My deposits | Portfolio (own), instruments (own), **submit** (own FDR), releases (own), policy |
| `DEALING_OFFICER` | Work queue | Portfolio (region), instruments (region), provenance, **process releases**, policy |
| `DIRECTOR_RB` | Portfolio | pledge graph, forecast, time machine (FDR submission **not visible**) |
| `COMPETENT_AUTHORITY` | Release queue | Portfolio, **review releases**, forecast, audit read |
| `ACCOUNTS` | Release letters | Released list, NOC/sanction, reports |
| `AUDITOR` | Audit | Portfolio read, **audit read**, reports, **pledge read** |
| `ADMIN` | Admin | **Admin functions only**, time machine, demo reset |

### Rationale for Role-Based Visibility

- **INSTITUTION_USER**: The institution itself submits its own FDR through the portal. They can submit their own FDR, view their own instruments/releases, and see policy information.

- **DEALING_OFFICER**: AICTE staff who process FDR applications. They can review, verify, and process existing FDR applications, view instruments within their region, and handle release requests (process, not submit new). They have provenance checking and policy trace visibility.

- **DIRECTOR_RB**: Regional Director. They oversee the process across institutions in their region. They can view portfolio overview, pledge graph (fraud detection), forecast (maturity planning), and time machine (maturity calendar). They can review and process release requests (check/approve) but should NOT see the FDR submission button — that's the institution's role. They should not have access to submit new FDRs.

- **COMPETENT_AUTHORITY**: Final approval authority. They review and approve/reject release requests. They can see portfolio, review releases, forecast (maturity planning), and have audit read access. They should not have FDR submission visibility — their role is review/approval, not submission.

- **ACCOUNTS**: Financial team. They handle release letters, NOC/sanction documents, and reports. They have no FDR submission access — their role is post-approval documentation.

- **AUDITOR**: Audit team. They have read-only access to portfolio, audit trails, reports, and pledge graph (read-only). They have no FDR submission access — their role is examination/examination, not submission.

- **ADMIN**: System administrator. Has admin functions only (user management, system config, demo reset). Should not have FDR submission visibility as a default — admin actions are separate from institutional submission workflow.

### Key Changes from Previous

1. **FDR submission (`submit`) removed from DEALING_OFFICER** — They can process/review existing applications but don't submit new FDRs from scratch
2. **FDR submission removed from DIRECTOR_RB** — Their role is oversight/review, not institutional submission
3. **FDR submission removed from COMPETENT_AUTHORITY** — Their role is review/approval, not submission
4. **FDR submission removed from ACCOUNTS/AUDITOR** — Their roles are post-approval/read-only
5. **INSTITUTION_USER retains `submit`** — They're the institution submitting their own FDR
6. **Labels updated** to be more precise about what each role can do

### API Client Implications

The API functions in `api.ts` should respect these visibility rules:
- `createInstrument` — only callable by INSTITUTION_USER (or shown disabled for other roles)
- `createRelease` — only callable by DEALING_OFFICER/COMPETENT_AUTHORITY in appropriate contexts
- Role-based disabled states on UI buttons
- Tooltips explaining why a button is unavailable for each role