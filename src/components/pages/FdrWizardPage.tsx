import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  FileCheck, 
  Key, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';
import { calculatePolicyDeposit } from '../../lib/api';

interface FdrWizardPageProps {
  onNavigate: (screen: string) => void;
}

export function FdrWizardPage({ onNavigate }: FdrWizardPageProps) {
  const [step, setStep] = useState(1);
  const [bankName, setBankName] = useState('State Bank of India');
  const [ifsc, setIfsc] = useState('SBIN0001482');
  const [fdrNumber, setFdrNumber] = useState('SBI/PUN/2026/884912');
  const [depositAmount, setDepositAmount] = useState('7000000'); // ₹70 Lakhs
  const [tenorYears, setTenorYears] = useState('10');
  const [programme, setProgramme] = useState('Engineering UG');
  const [isLeased, setIsLeased] = useState(true);
  const [isConcession, setIsConcession] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [generatedHash, setGeneratedHash] = useState('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // File Upload Handlers
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadDone(true);
      setGeneratedHash('7c3b889a1f28b4c2e6840d21a99f1c7e923e4b7a123f890cde456812ab9901ef');
    }
  };

  const parsedAmountLakhs = parseFloat(depositAmount || '0') / 100000;
  const requiredAmountLakhs = (programme === 'Engineering UG' ? 35 : 15) * (isConcession ? 0.5 : 1.0) * (isLeased ? 2.0 : 1.0);
  const isCompliant = parsedAmountLakhs >= requiredAmountLakhs;

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-10 px-4 sm:px-8 max-w-[1100px] mx-auto text-left">
      {/* Top Breadcrumb & Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          Statutory Deposit Ingestion Portal
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          ( FDR Instrument *Submission Wizard* )
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2">
          Joint FDR submission with AICTE pledge under APH 2024–27 Chapter I. Automated 3-way reconciliation against Core Banking Systems.
        </p>
      </div>

      {/* Progress Steps Ribbon */}
      <div className="flex items-center justify-between mb-8 p-3 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs overflow-x-auto">
        {[
          { num: 1, title: 'Bank Adapter' },
          { num: 2, title: 'Instrument Parameters' },
          { num: 3, title: 'OCR Verification' },
          { num: 4, title: 'Policy Sizing Check' },
          { num: 5, title: 'Final Submission' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2 px-3 shrink-0">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                step === s.num
                  ? 'bg-[#444C3D] text-white'
                  : step > s.num
                  ? 'bg-[#ECE7DE] text-[#444C3D]'
                  : 'bg-[#FAF8F5] text-[#706E66]'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </span>
            <span className={`text-xs font-medium ${step === s.num ? 'text-[#1C1D1A] font-bold' : 'text-[#706E66]'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Main Step Cards */}
      {!isSubmitted ? (
        <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 sm:p-10 shadow-sm">
          
          {/* STEP 1: Bank & Branch Adapter */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  Step 1: Scheduled Bank & IFSC Adapter
                </h3>
                <p className="text-xs text-[#55544E] mt-1 font-mono">
                  Select the participating RBI Scheduled Commercial Bank where the FDR is created.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">Participating Bank Name</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-sm text-[#1C1D1A]"
                  >
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                    <option value="Canara Bank">Canara Bank</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">Branch IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-sm text-[#1C1D1A] font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#444C3D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Mandatory Statutory Pledge Condition
                </div>
                <p className="text-xs text-[#55544E] leading-relaxed">
                  Under AICTE Approval Process Handbook (APH 2024–27), the Fixed Deposit Receipt must be pledged jointly in the names of the{' '}
                  <span className="font-semibold text-[#1C1D1A]">Regional Officer, AICTE</span> and the{' '}
                  <span className="font-semibold text-[#1C1D1A]">Trustee / Registrar of the Institution</span> for a minimum tenor of 10 years.
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  Proceed to Parameters <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Instrument Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  Step 2: FDR Instrument Parameters
                </h3>
                <p className="text-xs text-[#55544E] mt-1 font-mono">
                  Enter the exact deposit receipt details issued by {bankName}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">FDR Receipt Number</label>
                  <input
                    type="text"
                    value={fdrNumber}
                    onChange={(e) => setFdrNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-sm text-[#1C1D1A] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">Principal Amount (in ₹)</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-sm text-[#1C1D1A] font-mono font-bold"
                  />
                  <span className="text-[11px] text-[#706E66] font-mono mt-1 block">
                    Equivalent to: ₹{parsedAmountLakhs} Lakhs
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">Tenor (Years)</label>
                  <input
                    type="number"
                    value={tenorYears}
                    onChange={(e) => setTenorYears(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-sm text-[#1C1D1A] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">Maturity Date</label>
                  <input
                    type="date"
                    defaultValue="2036-10-25"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-sm text-[#1C1D1A] font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-lg border border-[#DDD6C9] text-xs font-medium text-[#55544E]"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  Proceed to OCR Scan <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OCR & Native File Upload */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  Step 3: Document Upload & AI OCR Extraction
                </h3>
                <p className="text-xs text-[#55544E] mt-1 font-mono">
                  Upload the official scan of the FDR Certificate. Our OCR will cross-verify the hash against Core Banking.
                </p>
              </div>

              {/* Hidden System File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.tiff"
                className="hidden"
              />

              {/* Clickable Drag/Drop & File Selection Zone */}
              <div 
                onClick={handleUploadClick}
                className={`p-8 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                  uploadDone ? 'border-emerald-500 bg-emerald-50/40' : 'border-[#DDD6C9] bg-[#FAF8F5] hover:border-[#444C3D]'
                }`}
              >
                <Upload className={`w-8 h-8 mx-auto mb-2 ${uploadDone ? 'text-emerald-600' : 'text-[#706E66]'}`} />
                <div className="font-semibold text-sm text-[#1C1D1A]">
                  {selectedFile ? `FDR Certificate Selected (${selectedFile.name})` : 'Click to Upload FDR Certificate (PDF / TIFF / JPG)'}
                </div>
                <div className="text-xs text-[#706E66] mt-1 font-mono">
                  {uploadDone ? 'OCR Extraction Confidence: 99.4%' : 'Max size 25MB · SHA-256 Digest will be cryptographically anchored'}
                </div>
              </div>

              {uploadDone && (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2 text-xs">
                  <div className="font-mono text-[#706E66]">Extracted OCR Digest:</div>
                  <div className="p-2.5 bg-white rounded-lg border border-[#E5DFD5] font-mono text-[11px] text-[#444C3D] break-all">
                    {generatedHash}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-mono text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Joint Pledge Lien to AICTE detected in OCR text
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-lg border border-[#DDD6C9] text-xs font-medium text-[#55544E]"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!uploadDone}
                  className="px-6 py-2.5 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-40"
                >
                  Verify Policy Compliance <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Table 1.4 Policy Sizing Check */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  Step 4: Statutory Table 1.4 Policy Sizing Check
                </h3>
                <p className="text-xs text-[#55544E] mt-1 font-mono">
                  Checking required security deposit against AICTE APH 2024–27 Table 1.4 & 2026-27 Addendum.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
                  <label className="block text-xs font-mono text-[#706E66] mb-1">Academic Programme</label>
                  <select
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    className="w-full text-xs font-semibold bg-white p-2 rounded border border-[#DDD6C9]"
                  >
                    <option value="Engineering UG">Engineering UG (Base ₹35L)</option>
                    <option value="Management">Management MBA (Base ₹15L)</option>
                    <option value="Pharmacy">Pharmacy (Base ₹20L)</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
                  <label className="block text-xs font-mono text-[#706E66] mb-1">Premises Status</label>
                  <label className="flex items-center gap-2 text-xs font-medium mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLeased}
                      onChange={(e) => setIsLeased(e.target.checked)}
                      className="accent-[#444C3D]"
                    />
                    Leased Campus (2.0x Surcharge)
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
                  <label className="block text-xs font-mono text-[#706E66] mb-1">Concessions</label>
                  <label className="flex items-center gap-2 text-xs font-medium mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isConcession}
                      onChange={(e) => setIsConcession(e.target.checked)}
                      className="accent-[#444C3D]"
                    />
                    NE / Women / PwD (50% Relief)
                  </label>
                </div>
              </div>

              {/* Sizing Result Card */}
              <div className={`p-5 rounded-2xl border ${
                isCompliant ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#706E66]">
                      Compliance Outcome
                    </span>
                    <h4 className="text-xl font-normal font-['Instrument_Serif'] text-[#1C1D1A] mt-0.5">
                      {isCompliant ? 'Deposit Fully Meets APH Table 1.4 Mandate' : 'Deposit Deficit Detected'}
                    </h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    isCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isCompliant ? 'COMPLIANT' : 'DEFICIT'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                  <div>
                    <span className="text-[#706E66]">Required Deposit:</span>
                    <div className="text-base font-bold text-[#1C1D1A]">₹{requiredAmountLakhs} Lakhs</div>
                  </div>
                  <div>
                    <span className="text-[#706E66]">Submitted Deposit:</span>
                    <div className="text-base font-bold text-emerald-700">₹{parsedAmountLakhs} Lakhs</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-lg border border-[#DDD6C9] text-xs font-medium text-[#55544E]"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setIsSubmitted(true)}
                  disabled={!isCompliant}
                  className="px-6 py-2.5 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-40"
                >
                  Submit FDR to AICTE Ledger <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Submission Success Screen */
        <div className="rounded-3xl bg-white border border-[#E5DFD5] p-8 sm:p-12 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-mono text-[#444C3D] font-bold bg-[#EFEAE1] border border-[#DDD6C9] px-3 py-1 rounded-full">
              FDR TOKEN #FDR-2026-9921
            </span>
            <h3 className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] mt-3">
              FDR Successfully Anchored into Statutory Ledger
            </h3>
            <p className="text-sm text-[#55544E] max-w-lg mx-auto mt-2">
              Receipt <span className="font-mono font-bold text-[#1C1D1A]">{fdrNumber}</span> for ₹{parsedAmountLakhs} Lakhs is verified against {bankName} CBS gateway and queued for 3-Way Reconciliation.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-left text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-[#706E66]">Cryptographic Hash:</span>
              <span className="text-[#444C3D] font-bold">SHA-256 Verified</span>
            </div>
            <div className="text-[10px] text-[#706E66] break-all">{generatedHash}</div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('provenance')}
              className="px-6 py-3 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              View in 3-Way Provenance <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className="px-6 py-3 rounded-lg border border-[#DDD6C9] bg-[#ECE7DE] hover:bg-[#E3DDCF] text-[#1C1D1A] text-xs font-medium cursor-pointer"
            >
              Back to Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}