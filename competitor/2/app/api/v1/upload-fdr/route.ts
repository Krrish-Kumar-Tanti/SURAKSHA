import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Standard simulated AICTE FDR data extraction from PDF
    const filename = file.name || "fdr_document.pdf";
    const structured_data = {
      "Bank Name": "State Bank of India (AICTE Joint Lien)",
      "FDR Number": "SBIN" + Math.floor(10000000 + Math.random() * 90000000),
      "Amount": "70,00,000",
      "Issue Date": "15/06/2018",
      "Maturity Date": "15/06/2026"
    };

    return NextResponse.json({
      status: "success",
      filename: filename,
      hash: hash,
      confidence_score: 100,
      structured_data: structured_data,
      raw_text: "STATE BANK OF INDIA\nFIXED DEPOSIT RECEIPT\nPledged in favour of Regional Officer, AICTE\nAmount: Rs. 70,00,000"
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process" }, { status: 500 });
  }
}
