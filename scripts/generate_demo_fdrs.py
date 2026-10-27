import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

def draw_fdr(filepath, data):
    c = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4

    # Background tint
    c.setFillColor(colors.HexColor('#FCFBF7'))
    c.rect(0, 0, width, height, fill=True, stroke=False)

    # Outer decorative border
    c.setStrokeColor(data['primary_color'])
    c.setLineWidth(3)
    c.rect(25, 25, width - 50, height - 50, fill=False, stroke=True)

    # Inner thin border
    c.setStrokeColor(colors.HexColor('#DDD6C9'))
    c.setLineWidth(1)
    c.rect(30, 30, width - 60, height - 60, fill=False, stroke=True)

    # Corner decorations
    c.setStrokeColor(data['primary_color'])
    c.setLineWidth(1.5)
    for corner in [(35, 35), (width - 45, 35), (35, height - 45), (width - 45, height - 45)]:
        c.rect(corner[0], corner[1], 10, 10, fill=False, stroke=True)

    # Top Header Banner
    c.setFillColor(data['primary_color'])
    c.rect(32, height - 105, width - 64, 73, fill=True, stroke=False)

    # Bank Name
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 60, data['bank_name'].upper())

    c.setFont("Helvetica", 10)
    c.drawString(50, height - 76, f"Branch: {data['branch_name']} | IFSC: {data['ifsc']}")
    c.drawString(50, height - 90, f"Core Banking System Reference: {data['cbs_ref']} · RBI Scheduled Bank")

    # Security Badge / Stamp top right
    c.setFillColor(colors.HexColor('#F59E0B'))
    c.circle(width - 80, height - 68, 24, fill=True, stroke=False)
    c.setFillColor(colors.HexColor('#1C1D1A'))
    c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(width - 80, height - 65, "AICTE")
    c.drawCentredString(width - 80, height - 75, "PLEDGED")

    # Document Title
    c.setFillColor(colors.HexColor('#1C1D1A'))
    c.setFont("Helvetica-Bold", 15)
    c.drawCentredString(width / 2, height - 130, "FIXED DEPOSIT RECEIPT / TERM DEPOSIT CERTIFICATE")
    c.setFont("Helvetica-Oblique", 9)
    c.setFillColor(colors.HexColor('#706E66'))
    c.drawCentredString(width / 2, height - 144, "Issued under AICTE Approval Process Handbook (APH) Statutory Norms")

    # Horizontal divider
    c.setStrokeColor(colors.HexColor('#E5DFD5'))
    c.setLineWidth(1)
    c.line(50, height - 155, width - 50, height - 155)

    # Parameters Grid Box
    y_start = height - 175
    box_height = 290
    c.setFillColor(colors.HexColor('#FFFFFF'))
    c.roundRect(48, y_start - box_height, width - 96, box_height, 8, fill=True, stroke=True)

    rows = [
        ("FDR Instrument Number:", data['fdr_number'], "Certificate Serial:", data['serial_no']),
        ("Account / Deposit A/c No:", data['account_no'], "Customer ID (CIF):", data['cif_no']),
        ("Primary Depositor (Trust/Inst):", data['depositor'], "", ""),
        ("Joint Pledgee / Custodian:", data['joint_pledgee'], "Joint Ratio:", "100% Statutory Lien"),
        ("Principal Deposit Amount:", f"INR {data['amount_formatted']}", "Amount in Words:", data['amount_words']),
        ("Statutory Tenor:", data['tenor'], "Interest Rate (p.a.):", data['interest_rate']),
        ("Effective Date of Booking:", data['booking_date'], "Date of Statutory Maturity:", data['maturity_date']),
        ("Operating Mandate:", data['mandate'], "Renewal Clause:", "Auto-Rollover until AICTE NOC"),
    ]

    curr_y = y_start - 25
    for row in rows:
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(colors.HexColor('#444C3D'))
        c.drawString(65, curr_y, row[0])

        c.setFont("Helvetica", 9)
        c.setFillColor(colors.HexColor('#1C1D1A'))
        c.drawString(225, curr_y, row[1])

        if row[2]:
            c.setFont("Helvetica-Bold", 9)
            c.setFillColor(colors.HexColor('#444C3D'))
            c.drawString(350, curr_y, row[2])

            c.setFont("Helvetica", 9)
            c.setFillColor(colors.HexColor('#1C1D1A'))
            c.drawString(455, curr_y, row[3])

        # Sub-divider
        c.setStrokeColor(colors.HexColor('#F0EAE1'))
        c.setLineWidth(0.5)
        c.line(60, curr_y - 7, width - 60, curr_y - 7)
        curr_y -= 32

    # Statutory Lien Notice Box (Crucial for OCR extraction)
    lien_box_y = y_start - box_height - 95
    c.setFillColor(data['lien_box_bg'])
    c.setStrokeColor(data['lien_box_border'])
    c.roundRect(48, lien_box_y, width - 96, 75, 6, fill=True, stroke=True)

    c.setFillColor(data['lien_text_color'])
    c.setFont("Helvetica-Bold", 10)
    c.drawString(62, lien_box_y + 56, "SPECIAL STATUTORY COVENANT & LIEN NOTATION:")

    c.setFont("Helvetica", 8.5)
    c.drawString(62, lien_box_y + 40, data['lien_text_1'])
    c.drawString(62, lien_box_y + 26, data['lien_text_2'])
    c.drawString(62, lien_box_y + 12, data['lien_text_3'])

    # Signatures & Verification section
    sig_y = lien_box_y - 100
    c.setStrokeColor(colors.HexColor('#DDD6C9'))
    c.rect(48, sig_y, width - 96, 85, fill=False, stroke=True)

    # Box 1: Authorized Signatory
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(colors.HexColor('#706E66'))
    c.drawString(65, sig_y + 70, "FOR SCHEDULED COMMERCIAL BANK")
    c.drawString(65, sig_y + 25, "_____________________________")
    c.drawString(65, sig_y + 12, "Chief Branch Manager / Authorised Signatory")

    # Box 2: Verification Stamp
    c.drawString(245, sig_y + 70, "STATUTORY BRANCH STAMP")
    c.setStrokeColor(colors.HexColor('#B45309'))
    c.circle(300, sig_y + 35, 20, stroke=True, fill=False)
    c.setFont("Helvetica-Bold", 6.5)
    c.setFillColor(colors.HexColor('#B45309'))
    c.drawCentredString(300, sig_y + 37, "VERIFIED")
    c.drawCentredString(300, sig_y + 29, "CBS ANCHORED")

    # Box 3: Cryptographic Hash
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(colors.HexColor('#706E66'))
    c.drawString(390, sig_y + 70, "OCR PARSING SECURITY HASH")
    c.setFont("Courier", 7)
    c.setFillColor(colors.HexColor('#1C1D1A'))
    c.drawString(390, sig_y + 50, f"HASH: {data['sha_digest'][:24]}...")
    c.drawString(390, sig_y + 36, f"ALGO: SHA-256 (NIST FIPS 180-4)")
    c.drawString(390, sig_y + 22, f"POLICY: {data['policy_tag']}")

    # Footer Disclaimer
    c.setFont("Helvetica", 7)
    c.setFillColor(colors.HexColor('#8C8A82'))
    c.drawCentredString(
        width / 2, 
        42, 
        "This is an electronic statutory document certified for submission to AICTE Security Deposit Control Tower (SIH26265). Computer generated."
    )

    c.save()
    print(f"Generated: {filepath}")

demos = [
    {
        "filename": "OCR verification demo 1.pdf",
        "bank_name": "State Bank of India",
        "branch_name": "Pune Main Branch (411001)",
        "ifsc": "SBIN0001482",
        "cbs_ref": "SBI-CBS-PUN-2026-992147",
        "primary_color": colors.HexColor('#0F4C81'),
        "fdr_number": "FDR-SBI-2026-9921",
        "serial_no": "SBI-FD-889104-B",
        "account_no": "3910294857102",
        "cif_no": "881920491",
        "depositor": "Symbiosis Institute of Technology (SIT Pune) / Symbiosis Trust",
        "joint_pledgee": "Member Secretary, AICTE New Delhi",
        "amount_formatted": "35,00,000.00",
        "amount_words": "Rupees Thirty-Five Lakhs Only",
        "tenor": "120 Months (10.0 Years)",
        "interest_rate": "7.25% p.a. Cumulative",
        "booking_date": "25-Oct-2026",
        "maturity_date": "25-Oct-2036",
        "mandate": "Joint Operational - Release strictly upon AICTE NOC",
        "lien_box_bg": colors.HexColor('#F2F7F0'),
        "lien_box_border": colors.HexColor('#BBD7B5'),
        "lien_text_color": colors.HexColor('#2D5A27'),
        "lien_text_1": "1. PLEDGED & LIEN ANCHORED IN FAVOUR OF MEMBER SECRETARY, AICTE UNDER APH 2024-27 CLAUSE 1.12.",
        "lien_text_2": "2. Premature encashment, loan, overdraft, or hypothecation strictly prohibited without AICTE dual digital NOC.",
        "lien_text_3": "3. Complies with Engineering UG Base Deposit norm of exactly Rs. 35.00 Lakhs on owned institutional campus land.",
        "sha_digest": "7c3b889a1f28b4c2e6840d21a99f1c7e923e4b7a123f890cde456812ab9901ef",
        "policy_tag": "APH Table 1.4 - 100% COMPLIANT",
    },
    {
        "filename": "OCR verification demo 2.pdf",
        "bank_name": "Punjab National Bank",
        "branch_name": "Shivaji Nagar Branch Pune",
        "ifsc": "PUNB0014800",
        "cbs_ref": "PNB-FINACLE-441209",
        "primary_color": colors.HexColor('#A31D1D'),
        "fdr_number": "FDR-PNB-2026-4412",
        "serial_no": "PNB-FD-772109-C",
        "account_no": "4819201948291",
        "cif_no": "994019284",
        "depositor": "Apex Technical Campus / Apex Educational Foundation",
        "joint_pledgee": "Member Secretary, AICTE New Delhi",
        "amount_formatted": "70,00,000.00",
        "amount_words": "Rupees Seventy Lakhs Only",
        "tenor": "120 Months (10.0 Years)",
        "interest_rate": "7.10% p.a. Cumulative",
        "booking_date": "25-Oct-2026",
        "maturity_date": "25-Oct-2036",
        "mandate": "Joint Operational - Release strictly upon AICTE NOC",
        "lien_box_bg": colors.HexColor('#F2F7F0'),
        "lien_box_border": colors.HexColor('#BBD7B5'),
        "lien_text_color": colors.HexColor('#2D5A27'),
        "lien_text_1": "1. PLEDGED TO MEMBER SECRETARY, AICTE WITH 2.0x LEASED PREMISES MULTIPLIER UNDER APH CHAPTER I.",
        "lien_text_2": "2. Base Engineering UG (Rs. 35L) x 2.0 Leased land multiplier = Rs. 70.00 Lakhs principal fully deposited.",
        "lien_text_3": "3. No lien, loan, or encumbrance can be marked in favor of any third party. Fully verifiable via PNB CBS Adapter.",
        "sha_digest": "4f18c219a820b1e5a40b93821038e4a9194e82b71940a83b2719a8b192e40182",
        "policy_tag": "APH Table 1.4 (Leased 2.0x) - 100% COMPLIANT",
    },
    {
        "filename": "OCR verification demo 3.pdf",
        "bank_name": "HDFC Bank Ltd.",
        "branch_name": "Kothrud Pune (411038)",
        "ifsc": "HDFC0000039",
        "cbs_ref": "HDFC-FDR-2026-118402",
        "primary_color": colors.HexColor('#004C8F'),
        "fdr_number": "FDR-HDFC-2026-1184",
        "serial_no": "HDFC-FD-901844-A",
        "account_no": "50392019482910",
        "cif_no": "771920491",
        "depositor": "Modern College of Engineering & Research / Progressive Trust",
        "joint_pledgee": "Member Secretary, AICTE New Delhi",
        "amount_formatted": "15,00,000.00",
        "amount_words": "Rupees Fifteen Lakhs Only",
        "tenor": "120 Months (10.0 Years)",
        "interest_rate": "7.40% p.a. Cumulative",
        "booking_date": "25-Oct-2026",
        "maturity_date": "25-Oct-2036",
        "mandate": "Joint Operational - Under-Sized Deposit Investigation Required",
        "lien_box_bg": colors.HexColor('#FEF3C7'),
        "lien_box_border": colors.HexColor('#F59E0B'),
        "lien_text_color": colors.HexColor('#B45309'),
        "lien_text_1": "1. PLEDGED IN JOINT NAME WITH AICTE, BUT PRINCIPAL DEPOSIT DEFICIT DETECTED.",
        "lien_text_2": "2. Declared Programme: Engineering UG (Mandatory APH Table 1.4 Requirement: Rs. 35.00 Lakhs).",
        "lien_text_3": "3. Actual FDR Amount: Rs. 15.00 Lakhs -> Statutory Deficit of Rs. 20.00 Lakhs. Non-compliant sizing.",
        "sha_digest": "9a820b1e5a40b93821038e4a9194e82b71940a83b2719a8b192e401827c3b889",
        "policy_tag": "APH Table 1.4 - DEFICIT DETECTED (-Rs.20L)",
    },
    {
        "filename": "OCR verification demo 4.pdf",
        "bank_name": "Canara Bank",
        "branch_name": "Deccan Gymkhana Pune (411004)",
        "ifsc": "CNRB0000215",
        "cbs_ref": "CNRB-DISCREPANT-883310",
        "primary_color": colors.HexColor('#0088CC'),
        "fdr_number": "FDR-CNRB-2026-8833",
        "serial_no": "CNRB-FD-110293-D",
        "account_no": "0215101092841",
        "cif_no": "664019283",
        "depositor": "Global Horizon Institute (SOLE PROPRIETARY TRUST)",
        "joint_pledgee": "NOT MARKED (AICTE JOINT PLEDGE MISSING)",
        "amount_formatted": "25,00,000.00",
        "amount_words": "Rupees Twenty-Five Lakhs Only",
        "tenor": "36 Months (3.0 Years ONLY - VIOLATES 10-YEAR TERM)",
        "interest_rate": "6.85% p.a.",
        "booking_date": "25-Oct-2026",
        "maturity_date": "25-Oct-2029",
        "mandate": "Single Signature - Institution Only (No AICTE Control)",
        "lien_box_bg": colors.HexColor('#FEE2E2'),
        "lien_box_border": colors.HexColor('#EF4444'),
        "lien_text_color": colors.HexColor('#B91C1C'),
        "lien_text_1": "1. CRITICAL STATUTORY IRREGULARITY: NO LIEN MARKED IN FAVOR OF AICTE.",
        "lien_text_2": "2. Tenor is 36 Months only (AICTE Clause 1.12 mandates strict 120 Months / 10-Year Lock-in).",
        "lien_text_3": "3. OCR Verification Warning: Fails Triangulation. Unanchored instrument cannot be accepted.",
        "sha_digest": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "policy_tag": "DISCREPANCY ALERT - REJECT",
    }
]

def main():
    dest_dirs = [
        os.path.abspath("demo_fdrs"),
        os.path.abspath("public/demo-fdrs")
    ]
    for d in dest_dirs:
        os.makedirs(d, exist_ok=True)

    for item in demos:
        for d in dest_dirs:
            out_path = os.path.join(d, item['filename'])
            draw_fdr(out_path, item)

if __name__ == '__main__':
    main()
