import json
import re
from http.server import HTTPServer, BaseHTTPRequestHandler

# State
CURRENT_USER = {
    "id": "usr-apex-admin",
    "email": "admin.inst_a@staging.aicte.gov.in",
    "full_name": "Dr. S. K. Raman (Apex Institute)",
    "role": "org_admin",
    "institution_id": "inst-apex-01",
    "institution_name": "Apex Institute of Technology, Bengaluru",
    "region_id": "sro-chennai",
    "mfa_enrolled": True,
    "step_up_valid": True,
    "step_up_valid_until": "2027-01-01T00:00:00Z",
    "delegation_limit": 10000000
}

DEV_ACCOUNTS = [
    {
        "role": "org_admin",
        "label": "Institution Admin",
        "institution": "Apex Institute of Technology",
        "email": "admin.inst_a@staging.aicte.gov.in",
        "full_name": "Dr. S. K. Raman (Apex Institute)"
    },
    {
        "role": "institution_submitter",
        "label": "Submitter",
        "institution": "Apex Institute of Technology",
        "email": "submitter.inst_a@staging.aicte.gov.in",
        "full_name": "R. Verma (Finance Officer)"
    },
    {
        "role": "intake_officer",
        "label": "AICTE Intake",
        "institution": "AICTE Bureau HQ",
        "email": "intake.officer@staging.aicte.gov.in",
        "full_name": "Shri Ramesh Kumar (AICTE RO)"
    },
    {
        "role": "scrutiny_officer",
        "label": "AICTE Scrutiny",
        "institution": "AICTE Bureau HQ",
        "email": "scrutiny.officer@staging.aicte.gov.in",
        "full_name": "Dr. Ananya Roy (AICTE HQ)"
    },
    {
        "role": "bank_verifier",
        "label": "Bank Verifier",
        "institution": "State Bank of India",
        "email": "bank.verifier@sbi.staging.aicte.gov.in",
        "full_name": "V. Sharma (SBI Nodal Officer)"
    },
    {
        "role": "platform_operator",
        "label": "Platform Admin",
        "institution": "AICTE Tech Core",
        "email": "platform.operator@staging.aicte.gov.in",
        "full_name": "System Administrator"
    }
]

INSTRUMENTS = [
    {
        "id": "inst-101",
        "institution_id": "inst-apex-01",
        "institution_name": "Apex Institute of Technology, Bengaluru",
        "bank_name": "State Bank of India",
        "type": "fixed_deposit",
        "status": "active",
        "evidence_level": "L2_verified",
        "instrument_number": "SBI-FDR-982144",
        "amount": 7000000,
        "issue_date": "2018-06-15",
        "maturity_date": "2026-06-15",
        "tenor_months": 96,
        "utr": "SBIN202606159981",
        "created_at": "2026-01-10T10:00:00Z",
        "updated_at": "2026-10-25T12:00:00Z"
    },
    {
        "id": "inst-102",
        "institution_id": "inst-apex-01",
        "institution_name": "Apex Institute of Technology, Bengaluru",
        "bank_name": "Punjab National Bank",
        "type": "fixed_deposit",
        "status": "pending_verification",
        "evidence_level": "L0_unverified",
        "instrument_number": "PNB-FDR-441209",
        "amount": 3500000,
        "issue_date": "2024-03-20",
        "maturity_date": "2032-03-20",
        "tenor_months": 96,
        "utr": "PUNB202403201123",
        "created_at": "2026-03-20T10:00:00Z",
        "updated_at": "2026-10-25T12:00:00Z"
    },
    {
        "id": "inst-103",
        "institution_id": "inst-apex-01",
        "institution_name": "Apex Institute of Technology, Bengaluru",
        "bank_name": "Canara Bank",
        "type": "fixed_deposit",
        "status": "matured",
        "evidence_level": "L2_verified",
        "instrument_number": "CNRB-FDR-771890",
        "amount": 10000000,
        "issue_date": "2016-10-10",
        "maturity_date": "2026-10-10",
        "tenor_months": 120,
        "utr": "CNRB202610100412",
        "created_at": "2026-01-01T10:00:00Z",
        "updated_at": "2026-10-25T12:00:00Z"
    }
]

class MockHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200, set_cookie=False):
        payload = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        if set_cookie:
            self.send_header('Set-Cookie', 'session=mock_dev_session_apex; Path=/; HttpOnly; SameSite=Lax')
            self.send_header('Set-Cookie', 'access_token=mock_dev_access_token; Path=/; SameSite=Lax')
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        global CURRENT_USER
        path = self.path.split('?')[0]

        if path == '/v1/auth/dev-accounts':
            self._send_json(DEV_ACCOUNTS)
        elif path == '/v1/me':
            self._send_json(CURRENT_USER)
        elif path == '/v1/me/navigation':
            self._send_json({
                "landing_route": "/dashboard",
                "web_sidebar": [
                    {"key": "dashboard", "label_key": "nav.dashboard", "icon_key": "dashboard", "route": "/dashboard"},
                    {"key": "search", "label_key": "nav.search", "icon_key": "search", "route": "/search"},
                    {"key": "submit", "label_key": "nav.submit", "icon_key": "upload", "route": "/submit"},
                    {"key": "verify", "label_key": "nav.verify", "icon_key": "verified", "route": "/verify"},
                    {"key": "reminders", "label_key": "nav.reminders", "icon_key": "deadline", "route": "/reminders"},
                    {"key": "release", "label_key": "nav.release", "icon_key": "checklist", "route": "/release"},
                    {"key": "reports", "label_key": "nav.reports", "icon_key": "report", "route": "/reports"},
                    {"key": "copilot", "label_key": "nav.copilot", "icon_key": "policy", "route": "/copilot"},
                    {"key": "audit", "label_key": "nav.audit", "icon_key": "audit", "route": "/audit"},
                    {"key": "admin", "label_key": "nav.admin", "icon_key": "settings", "route": "/admin"},
                    {"key": "security", "label_key": "nav.security", "icon_key": "security", "route": "/security"},
                    {"key": "help", "label_key": "nav.help", "icon_key": "help", "route": "/help"}
                ],
                "mobile_tabs": []
            })
        elif path == '/v1/instruments':
            self._send_json(INSTRUMENTS)
        elif path == '/v1/observations':
            self._send_json([])
        elif path == '/v1/me/profile-completion':
            self._send_json({"percent": 100, "items": []})
        elif path == '/v1/auth/sessions':
            self._send_json([])
        else:
            self._send_json([])

    def do_POST(self):
        global CURRENT_USER
        path = self.path.split('?')[0]
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(body.decode('utf-8'))
        except Exception:
            req_data = {}

        if path in ['/v1/auth/dev-login', '/v1/auth/login']:
            req_email = req_data.get('email', '')
            for acc in DEV_ACCOUNTS:
                if acc['email'].lower() == req_email.lower():
                    CURRENT_USER = {
                        "id": f"usr-{acc['role']}",
                        "email": acc['email'],
                        "full_name": acc['full_name'],
                        "role": acc['role'],
                        "institution_id": "inst-apex-01",
                        "institution_name": acc.get('institution', 'Apex Institute of Technology'),
                        "region_id": "sro-chennai",
                        "mfa_enrolled": True,
                        "step_up_valid": True,
                        "step_up_valid_until": "2027-01-01T00:00:00Z",
                        "delegation_limit": 10000000
                    }
                    break

            self._send_json({
                "access_token": "mock_dev_access_token",
                "refresh_token": "mock_dev_refresh_token",
                "token_type": "bearer",
                "expires_in": 3600
            }, set_cookie=True)
        elif path == '/v1/auth/logout':
            self._send_json({"status": "ok"})
        else:
            self._send_json({"status": "ok"})

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8000), MockHandler)
    print("Mock Competitor API running on http://localhost:8000")
    server.serve_forever()
