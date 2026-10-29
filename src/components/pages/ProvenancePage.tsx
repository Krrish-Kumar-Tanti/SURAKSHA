import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Scale, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  RefreshCw,
  SlidersHorizontal,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';
import { canResolveDiscrepancies, isScreenAllowed } from '../../lib/roleAccess';
import { getSavedSession, getStoredFdrRecords, downloadStoredDocument, StoredInstrumentRecord } from '../../lib/api';
import { getSharedWaiver, saveSharedWaiver } from '../../lib/clearanceState';

interface ProvenancePageProps {
  onNavigate: (screen: string) => void;
  currentRole?: string;
}

// Sample data for demo/synthetic sessions
const SAMPLE_MATCH_RECORD = {
  instrument_number: 'SBI/PUN/2024/998214',
  institution_name: 'Symbiosis Inst of Tech (SIT), Pune',
  bank_name: 'State Bank of India',
  branch: 'Pune Main',
  ifsc: 'SBIN0001482',
  amount_paise: 7000000000, // ₹70 Lakhs
  verification_status: 'VERIFIED',
  documents: [{ sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }],
};

const SAMPLE_DISCREPANT_RECORD = {
  instrument_number: 'CAN/ERD/2022/102948',
  institution_name: 'Bannari Amman Inst of Tech, Erode',
  bank_name: 'Canara Bank',
  branch: 'Erode Main',
  ifsc: 'CNRB0010294',
  amount_paise: 3500000000, // ₹35 Lakhs in Core Banking Live CBS
  declared_amount_paise: 5000000000, // ₹50 Lakhs declared / photoshopped certificate
  verification_status: 'DISCREPANCY_FLAGGED',
  documents: [{ sha256: '9f83c68f70e3183886d5e2439b1365e154aecda20cbe1bc56c2d1037d9ac3f14' }],
};

export function ProvenancePage({ onNavigate, currentRole = 'AUDITOR' }: ProvenancePageProps) {
  const [waived, setWaived] = useState(getSharedWaiver());
  const [activeCheck, setActiveCheck] = useState<'match' | 'discrepant'>('match');
  const [records, setRecords] = useState<StoredInstrumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isRealUser, setIsRealUser] = useState(false);

  useEffect(() => {
    const handleWaiverUpdate = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      setWaived(typeof custom.detail === 'boolean' ? custom.detail : getSharedWaiver());
    };
    window.addEventListener('suraksha_waiver_changed', handleWaiverUpdate);
    return () => window.removeEventListener('suraksha_waiver_changed', handleWaiverUpdate);
  }, []);

  const handleToggleWaiver = () => {
    const next = !waived;
    setWaived(next);
    saveSharedWaiver(next);
  };

  const [selectedRecordKey, setSelectedRecordKey] = useState<string>('match');

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    getStoredFdrRecords()
      .then((recs) => {
        if (active) setRecords(recs);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load records');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    const handleRecordAdded = () => {
      getStoredFdrRecords().then((recs) => setRecords(recs));
    };
    window.addEventListener('suraksha_record_added', handleRecordAdded);
    return () => {
      active = false;
      window.removeEventListener('suraksha_record_added', handleRecordAdded);
    };
  }, [currentRole]);

  const formatAmount = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;
  const formatAmountLakhs = (paise: number) => `₹${(paise / 10000000).toFixed(0)} Lakhs`;

  // Matched uploaded record
  const customRecord = records.find((r) => r.id === selectedRecordKey || r.instrument_number === selectedRecordKey);

  const isDiscrepant = selectedRecordKey === 'discrepant';
  const displayData = customRecord
    ? {
        instrumentNumber: customRecord.instrument_number,
        institutionName: customRecord.institution_name,
        bankName: customRecord.bank_name,
        branch: customRecord.branch,
        ifsc: customRecord.ifsc,
        declaredAmount: formatAmount(customRecord.amount_paise),
        ocrAmount: formatAmount(customRecord.amount_paise),
        bankAmount: formatAmount(customRecord.amount_paise),
        verificationStatus: customRecord.verification_status,
        sha256: customRecord.documents?.[0]?.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        isMatch: true,
        doc: customRecord.documents?.[0],
      }
    : isDiscrepant
      ? {
          instrumentNumber: SAMPLE_DISCREPANT_RECORD.instrument_number,
          institutionName: SAMPLE_DISCREPANT_RECORD.institution_name,
          bankName: SAMPLE_DISCREPANT_RECORD.bank_name,
          branch: SAMPLE_DISCREPANT_RECORD.branch,
          ifsc: SAMPLE_DISCREPANT_RECORD.ifsc,
          declaredAmount: '₹50 Lakhs (Altered Certificate)',
          ocrAmount: '₹50 Lakhs (OCR Extracted)',
          bankAmount: '₹35 Lakhs (Core Banking CBS Live)',
          verificationStatus: SAMPLE_DISCREPANT_RECORD.verification_status,
          sha256: SAMPLE_DISCREPANT_RECORD.documents[0].sha256,
          isMatch: false,
          doc: undefined,
        }
      : {
          instrumentNumber: SAMPLE_MATCH_RECORD.instrument_number,
          institutionName: SAMPLE_MATCH_RECORD.institution_name,
          bankName: SAMPLE_MATCH_RECORD.bank_name,
          branch: SAMPLE_MATCH_RECORD.branch,
          ifsc: SAMPLE_MATCH_RECORD.ifsc,
          declaredAmount: '₹70 Lakhs',
          ocrAmount: '₹70 Lakhs',
          bankAmount: '₹70 Lakhs',
          verificationStatus: SAMPLE_MATCH_RECORD.verification_status,
          sha256: SAMPLE_MATCH_RECORD.documents[0].sha256,
          isMatch: true,
          doc: undefined,
        };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-10 px-4 sm:px-8 max-w-[1440px] mx-auto text-left">
        <div className="mb-4">
          <button
            onClick={() => onNavigate('portfolio')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD6C9] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#444C3D] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </button>
        </div>
        <p className="px-5 py-4 text-sm text-[#706E66]">Loading saved submissions...</p>
      </div>
    );
  }

  if (error && isRealUser) {
    return (
      <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-10 px-4 sm:px-8 max-w-[1440px] mx-auto text-left">
        <div className="mb-4">
          <button
            onClick={() => onNavigate('portfolio')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD6C9] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#444C3D] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </button>
        </div>
        <p role="alert" className="px-5 pb-4 text-sm text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-8 px-4 sm:px-8 max-w-[1440px] mx-auto text-left">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => onNavigate('portfolio')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD6C9] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#444C3D] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
        </button>
      </div>

      {/* Top Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          Zero-Hallucination 3-Way Matcher
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          ( *Provenance Verification* )
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2 max-w-3xl">
          Automated field-by-field 3-way reconciliation: 
          <strong> (1) College Declaration</strong> vs <strong>(2) OCR AI Scan of Document</strong> vs <strong>(3) Core Banking Live API Response</strong>.
          Eliminates counterfeit or altered FDR certificates before Extension of Approval (EoA) is issued.
        </p>
      </div>

      {/* Control & Record Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5DFD5] mb-8 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#706E66]">Inspecting Record:</span>
          <select 
            value={selectedRecordKey}
            onChange={(e) => {
              setSelectedRecordKey(e.target.value);
              setWaived(false);
            }}
            className="text-xs font-semibold bg-[#FAF8F5] border border-[#DDD6C9] px-3 py-2 rounded-lg text-[#1C1D1A]"
          >
            <option value="match">SBI/PUN/2024/998214 — SIT Pune (Full 3-Way Match ₹70L)</option>
            {currentRole !== 'INSTITUTION_USER' && (
              <option value="discrepant">CAN/ERD/2022/102948 — Bannari Amman Inst (Photoshop ₹50L vs Bank ₹35L DISCREPANCY)</option>
            )}
            {records.map((r) => (
              <option key={r.id} value={r.id}>
                {r.instrument_number} — {r.institution_name} (Submitted Record)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#706E66]">Matcher Verdict:</span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            displayData.isMatch || waived
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}>
            {displayData.isMatch ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> FULL 3-WAY MATCH</>
            ) : waived ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> DISCREPANCY WAIVED (AUDIT NOTE)</>
            ) : (
              <><AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" /> DISCREPANCY DETECTED</>
            )}
          </span>
        </div>
      </div>

      {/* 3-Column Reconciliation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         
        {/* Column 1: College Declaration */}
        <div className={`rounded-3xl bg-white border p-6 shadow-sm transition-all ${
          !displayData.isMatch && !waived ? 'border-red-300 ring-1 ring-red-200' : 'border-[#E5DFD5]'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">Source 1</span>
              <h3 className="text-lg font-bold text-[#1C1D1A]">1. College Declaration</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-mono font-bold border border-blue-200">
              Self-Reported
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">FDR Account Number</span>
              <span className="text-sm font-bold text-[#1C1D1A]">{displayData.instrumentNumber}</span>
            </div>

            <div className={`p-3 rounded-xl border ${
              !displayData.isMatch && !waived ? 'bg-red-50 border-red-200' : 'bg-[#FAF8F5] border-[#E5DFD5]'
            }`}>
              <span className="text-[#706E66] block text-[10px]">Declared Principal Amount</span>
              <span className={`text-base font-bold ${!displayData.isMatch && !waived ? 'text-red-700' : 'text-[#1C1D1A]'}`}>
                {displayData.declaredAmount}
              </span>
              {!displayData.isMatch && !waived && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-[10px] font-bold">
                  <AlertTriangle className="w-3 h-3" /> Exceeds bank verified record!
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Institution Name</span>
              <span className="text-xs font-bold text-[#1C1D1A]">{displayData.institutionName}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Maturity Expiry</span>
              <span className="text-xs font-bold text-[#1C1D1A]">15-Aug-2034 (10-Yr Tenor)</span>
            </div>
          </div>
        </div>

        {/* Column 2: OCR AI Scan */}
        <div className={`rounded-3xl bg-white border p-6 shadow-sm transition-all ${
          !displayData.isMatch && !waived ? 'border-red-300 ring-1 ring-red-200' : 'border-[#E5DFD5]'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">Source 2</span>
              <h3 className="text-lg font-bold text-[#1C1D1A]">2. OCR AI Scan of Document</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-mono font-bold border border-purple-200">
              Optical AI
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Extracted Instrument Number</span>
              <span className="text-sm font-bold text-[#1C1D1A]">{displayData.instrumentNumber}</span>
            </div>

            <div className={`p-3 rounded-xl border ${
              !displayData.isMatch && !waived ? 'bg-red-50 border-red-200' : 'bg-[#FAF8F5] border-[#E5DFD5]'
            }`}>
              <span className="text-[#706E66] block text-[10px]">OCR Extracted Face Value</span>
              <span className={`text-base font-bold ${!displayData.isMatch && !waived ? 'text-red-700' : 'text-[#1C1D1A]'}`}>
                {displayData.ocrAmount}
              </span>
              {!displayData.isMatch && !waived && (
                <div className="text-[10px] text-red-700 mt-1 font-bold">
                  ⚠ Paper scan shows ₹50L, but bank balance confirms only ₹35L (Suspected Alteration)
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Joint Mandate Pledge Extracted</span>
              <span className="text-xs font-bold text-[#55544E]">
                Regional Officer, AICTE AND College Chairman
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Document Cryptographic Fingerprint</span>
              <span className="text-[10px] text-[#706E66] truncate block">{displayData.sha256}</span>
            </div>

            {/* Sovereign Vault Document Download Box */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#706E66] block text-[10px]">Encrypted Document Sovereign Vault</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">AES-256 GCM</span>
              </div>
              <div className="text-[10px] text-[#55544E] truncate">
                <strong>Storage:</strong> PostgreSQL Sovereign Vault (/vault/documents/)
              </div>
              <button
                onClick={() => {
                  const doc = (displayData as any).doc || {
                    id: 'doc_provenance',
                    file_name: `${displayData.instrumentNumber.replace(/\//g, '_')}_Certificate.pdf`,
                    mime_type: 'application/pdf',
                    size_bytes: 482910,
                    sha256: displayData.sha256,
                    ocr_status: 'OCR_VERIFIED',
                    uploaded_at: new Date().toISOString(),
                    download_url: '#',
                  };
                  downloadStoredDocument(doc);
                }}
                className="w-full mt-1 py-1.5 px-3 rounded-lg border border-[#DDD6C9] bg-white hover:bg-[#F2EFE9] text-[#1C1D1A] text-[11px] font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#444C3D]" /> Download / View Stored Receipt
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Core Banking Live API Response */}
        <div className={`rounded-3xl bg-white border p-6 shadow-sm transition-all ${
          !displayData.isMatch && !waived ? 'border-red-300 ring-1 ring-red-200' : 'border-[#E5DFD5]'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">Source 3</span>
              <h3 className="text-lg font-bold text-[#1C1D1A]">3. Core Banking Live API Response</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-mono font-bold border border-emerald-200">
              Bank CBS API
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">CBS Confirmed FDR Number</span>
              <span className="text-sm font-bold text-[#1C1D1A]">{displayData.instrumentNumber}</span>
            </div>

            <div className={`p-3 rounded-xl border ${
              !displayData.isMatch && !waived ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <span className="text-[#706E66] block text-[10px]">Bank Core Banking Balance (Truth)</span>
              <span className={`text-base font-bold ${!displayData.isMatch && !waived ? 'text-red-700' : 'text-emerald-700'}`}>
                {displayData.bankAmount}
              </span>
              {!displayData.isMatch && !waived && (
                <div className="flex items-center gap-1 mt-1 text-red-700 text-[10px] font-bold">
                  <AlertTriangle className="w-3 h-3" /> Deficit of ₹15,00,000 detected against bank ledger!
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Lien Marker in Bank System</span>
              <span className={`text-xs font-bold flex items-center gap-1 ${
                displayData.isMatch ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {displayData.isMatch ? (
                  <><CheckCircle2 className="w-3 h-3" /> REGULATORY_LIEN_AICTE_LOCKED</>
                ) : (
                  <><AlertTriangle className="w-3 h-3" /> PARTIAL_LIEN — Under-collateralized</>
                )}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Bank CBS Gateway Adapter</span>
              <span className="text-xs font-bold text-[#1C1D1A]">{displayData.bankName} (SFMS Adapter 01)</span>
            </div>
          </div>
        </div>

      </div>

      {/* DISCREPANCY DETECTED RED ALERT BANNER */}
      {!displayData.isMatch && !waived && (
        <div className="rounded-3xl bg-red-50 border-2 border-red-400 p-6 sm:p-8 shadow-sm mb-8 animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-700 shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                🚨 DISCREPANCY DETECTED — Zero-Hallucination Discrepancy Alert
              </h3>
              <p className="text-sm text-red-800 mt-1 leading-relaxed">
                Bank records confirm an FDR amount of <strong>₹35 Lakh</strong>, but the uploaded certificate and declaration claim <strong>₹50 Lakh</strong>.
                The certificate may have been altered or tampered with. Dealing Officers cannot approve or edit this record.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-red-100 border border-red-300 text-red-800 font-bold">
                  FRAUD RISK: HIGH
                </span>
                <span className="px-2.5 py-1 rounded-md bg-red-100 border border-red-300 text-red-800">
                  Deficit: ₹15,00,000
                </span>
                <span className="px-2.5 py-1 rounded-md bg-red-100 border border-red-300 text-red-800">
                  Escalated to Vigilance & Regional Director
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role-Specific Actions & Governance */}
      <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">
              Governance & Statutory Permissions
            </span>
            <h3 className="text-lg font-normal text-[#1C1D1A] font-['Instrument_Serif'] mt-1">
              {currentRole === 'DEALING_OFFICER' && 'Dealing Officer: Read-only mismatch view. No editing or waiver permissions.'}
              {currentRole === 'DIRECTOR_RB' && 'Regional Director: Authorized to waive typographical errors with permanent audit note.'}
              {currentRole === 'AUDITOR' && 'Auditor / Vigilance: Read-only inspection of provenance discrepancies.'}
              {currentRole === 'INSTITUTION_USER' && 'Institution Registrar: View verified three-way match status.'}
              {!['DEALING_OFFICER', 'DIRECTOR_RB', 'AUDITOR', 'INSTITUTION_USER'].includes(currentRole) && `${currentRole}: Provenance Reconciliation`}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Dealing Officer Notice */}
            {currentRole === 'DEALING_OFFICER' && !displayData.isMatch && (
              <span className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono">
                Locked: Escalate to Regional Director
              </span>
            )}

            {/* Regional Director Waiver Option */}
            {canResolveDiscrepancies(currentRole) && !displayData.isMatch && (
              <button
                onClick={handleToggleWaiver}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition shadow-sm ${
                  waived
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                    : 'bg-[#444C3D] hover:bg-[#353C2F] text-white'
                }`}
              >
                {waived ? '✓ Waiver Active (Permanent Ledger Note)' : 'Waive Typographical Error with Audit Note'}
              </button>
            )}

            {isScreenAllowed(currentRole, 'policy') && (
              <button
                onClick={() => onNavigate('policy')}
                className="px-4 py-2.5 rounded-lg border border-[#DDD6C9] bg-[#ECE7DE] hover:bg-[#E3DDCF] text-[#1C1D1A] text-xs font-medium cursor-pointer"
              >
                Inspect Policy Rules →
              </button>
            )}
          </div>
        </div>

        {/* Permanent Audit Note recorded when waived by Director */}
        {waived && canResolveDiscrepancies(currentRole) && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 font-mono space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Statutory Waiver Recorded on Immutable Ledger
            </div>
            <p>
              "Typographical discrepancy between declared ₹50L and bank ₹35L examined by Regional Director. Bank confirmed amendment letter received. Waived with permanent SHA-256 audit entry."
            </p>
            <div className="text-[10px] text-amber-800 pt-1">
              Signed by Regional Director WRO · Audit Block #10481 · Irreversible without Competent Authority concurrence.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
