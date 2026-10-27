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
import {
  calculatePolicyDeposit,
  createFdrInstrument,
  DocumentExtraction,
  extractFdrDocument,
  uploadFdrDocument,
} from '../../lib/api';

interface FdrWizardPageProps {
  onNavigate: (screen: string) => void;
  currentRole?: string;
}

export function FdrWizardPage({ onNavigate, currentRole = 'INSTITUTION_USER' }: FdrWizardPageProps) {
  const [step, setStep] = useState(1);
  const [bankName, setBankName] = useState('State Bank of India');
  const [branch, setBranch] = useState('Pune Camp');
  const [ifsc, setIfsc] = useState('SBIN0001482');
  const [fdrNumber, setFdrNumber] = useState('SBI/PUN/2026/884912');
  const [depositAmount, setDepositAmount] = useState('7000000'); // ₹70 Lakhs
  const [tenorYears, setTenorYears] = useState('10');
  const [issueDate, setIssueDate] = useState('2026-10-25');
  const [maturityDate, setMaturityDate] = useState('2036-10-25');
  const [programme, setProgramme] = useState('Engineering UG');
  const [isLeased, setIsLeased] = useState(true);
  const [isConcession, setIsConcession] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [generatedHash, setGeneratedHash] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdInstrumentId, setCreatedInstrumentId] = useState<string | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<DocumentExtraction | null>(null);

  // File Upload Handlers
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/\.(pdf|png|jpe?g)$/i.test(file.name)) {
      setFormError('Choose a PDF, PNG, or JPG file.');
      e.target.value = '';
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setFormError('The selected file is larger than 25 MB.');
      e.target.value = '';
      return;
    }

    setFormError('');
    setSelectedFile(file);
    setUploadDone(false);
    setGeneratedHash('');
    setUploadedDocumentId(null);
    setOcrResult(null);
    try {
      const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
      const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
      setGeneratedHash(hash);
      setUploadDone(true);
    } catch {
      setFormError('The browser could not calculate a file fingerprint. Try another file or browser.');
      setSelectedFile(null);
      e.target.value = '';
    }
  };

  const parsedAmountLakhs = parseFloat(depositAmount || '0') / 100000;
  const requiredAmountLakhs = (programme === 'Engineering UG' ? 35 : 15) * (isConcession ? 0.5 : 1.0) * (isLeased ? 2.0 : 1.0);
  const isCompliant = Number.isFinite(parsedAmountLakhs) && parsedAmountLakhs >= requiredAmountLakhs;

  const validateBankDetails = () => {
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifsc.trim())) {
      setFormError('Enter an IFSC code in the format ABCD0123456.');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const validateInstrumentDetails = () => {
    if (!fdrNumber.trim()) {
      setFormError('Enter the FDR receipt number.');
      return;
    }
    if (!Number.isFinite(Number(depositAmount)) || Number(depositAmount) <= 0) {
      setFormError('Enter an amount greater than zero.');
      return;
    }
    if (!Number.isInteger(Number(tenorYears)) || Number(tenorYears) < 10) {
      setFormError('Tenor must be at least 10 years.');
      return;
    }
    const issue = new Date(`${issueDate}T00:00:00`);
    const maturity = new Date(`${maturityDate}T00:00:00`);
    const earliestMaturity = new Date(issue);
    earliestMaturity.setFullYear(earliestMaturity.getFullYear() + Number(tenorYears));
    if (!issueDate || !maturityDate || Number.isNaN(issue.getTime()) || Number.isNaN(maturity.getTime()) || maturity < earliestMaturity) {
      setFormError('Enter valid dates with maturity at least as far out as the stated tenor.');
      return;
    }
    setFormError('');
    setStep(3);
  };

  const handleUploadAndRead = async () => {
    if (!selectedFile || !uploadDone) {
      setFormError('Select a valid receipt file before starting OCR.');
      setStep(3);
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    try {
      let instrumentId = createdInstrumentId;
      if (!instrumentId) {
        const issue = new Date(`${issueDate}T00:00:00`);
        const maturity = new Date(`${maturityDate}T00:00:00`);
        const result = await createFdrInstrument({
          institution_id: '11111111-1111-4111-8111-111111111111',
          programme_id: '11111111-1111-4111-8111-111111111101',
          type: 'FDR',
          instrument_number: fdrNumber.trim(),
          bank_name: bankName,
          branch: branch.trim(),
          ifsc: ifsc.trim().toUpperCase(),
          amount_paise: Math.round(Number(depositAmount) * 100),
          issue_date: issue.toISOString(),
          maturity_date: maturity.toISOString(),
          tenure_months: Number(tenorYears) * 12,
          interest_rate: null,
          depositor_name: 'Sanjeevani Education Trust',
          lien_in_favour: 'AICTE',
        });
        instrumentId = result.id;
        setCreatedInstrumentId(instrumentId);
      }

      let documentId = uploadedDocumentId;
      if (!documentId) {
        const uploaded = await uploadFdrDocument(instrumentId, selectedFile);
        documentId = uploaded.id;
        setUploadedDocumentId(documentId);
      }

      const extraction = await extractFdrDocument(instrumentId, documentId);
      setOcrResult(extraction);
      if (extraction.ocr_status === 'NEEDS_REVIEW' || extraction.fields.length === 0) {
        setFormError('The document was stored securely, but OCR could not read any supported fields. Check the document and retry with a clearer scan.');
        return;
      }
      setIsSubmitted(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Document upload or OCR failed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-10 px-4 sm:px-8 max-w-[1100px] mx-auto text-left">
      {/* Top Breadcrumb & Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          FDR Submission
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          ( *FDR Submission* )
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2">
          Enter receipt details and review the policy estimate.
        </p>
      </div>

      {/* Progress Steps Ribbon */}
      <div className="flex items-center justify-between mb-8 p-3 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs overflow-x-auto">
        {[
          { num: 1, title: 'Bank details' },
          { num: 2, title: 'Instrument Parameters' },
          { num: 3, title: 'Choose document' },
          { num: 4, title: 'Review estimate' },
          { num: 5, title: 'Demo preview' },
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
          {formError && (
            <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {formError}
            </div>
          )}
          
          {/* STEP 1: Bank & Branch Adapter */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  Step 1: Bank and branch details
                </h3>
                <p className="text-xs text-[#55544E] mt-1 font-mono">
                  Select the bank shown on the receipt.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">Bank name</label>
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
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">Branch IFSC code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-sm text-[#1C1D1A] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">Bank branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-sm text-[#1C1D1A]"
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
                  onClick={validateBankDetails}
                  className="px-6 py-2.5 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Instrument Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  Step 2: Receipt details
                </h3>
                <p className="text-xs text-[#55544E] mt-1 font-mono">
                  Enter the details as printed on the receipt.
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
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">Issue date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-sm text-[#1C1D1A] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">Maturity date</label>
                  <input
                    type="date"
                    value={maturityDate}
                    onChange={(e) => setMaturityDate(e.target.value)}
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
                  onClick={validateInstrumentDetails}
                  className="px-6 py-2.5 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Local file fingerprint */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  Step 3: Select a receipt file
                </h3>
                <p className="text-xs text-[#55544E] mt-1 font-mono">
                  Select a receipt file. It will be uploaded and read when you submit for OCR.
                </p>
              </div>

              {/* Hidden System File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
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
                  {selectedFile ? `FDR Certificate Selected (${selectedFile.name})` : 'Click to Upload FDR Certificate (PDF / PNG / JPG)'}
                </div>
                <div className="text-xs text-[#706E66] mt-1 font-mono">
                  {uploadDone ? 'File fingerprint calculated.' : 'Maximum file size: 25 MB'}
                </div>
              </div>

              {uploadDone && (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2 text-xs">
                  <div className="font-mono text-[#706E66]">File fingerprint (SHA-256):</div>
                  <div className="p-2.5 bg-white rounded-lg border border-[#E5DFD5] font-mono text-[11px] text-[#444C3D] break-all">
                    {generatedHash}
                  </div>
                  <div className="text-xs text-[#55544E]">
                    The file will be encrypted in backend storage before OCR processing.
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
                  Review policy estimate <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Table 1.4 Policy Sizing Check */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  Step 4: Review the sample estimate
                </h3>
                <p className="text-xs text-[#55544E] mt-1 font-mono">
                  Review the estimate based on the selected programme and premises details.
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
                      Sample estimate
                    </span>
                    <h4 className="text-xl font-normal font-['Instrument_Serif'] text-[#1C1D1A] mt-0.5">
                      {isCompliant ? 'Entered amount meets this demo estimate' : 'Entered amount is below this demo estimate'}
                    </h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    isCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isCompliant ? 'ESTIMATE MET' : 'BELOW ESTIMATE'}
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
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setIsSubmitted(true)}
                    disabled={!isCompliant}
                    className="px-5 py-2.5 rounded-lg border border-[#DDD6C9] text-xs font-medium text-[#55544E] cursor-pointer disabled:opacity-40"
                  >
                    Preview only (no upload)
                  </button>
                  <button
                    onClick={handleUploadAndRead}
                    disabled={!isCompliant || !uploadDone || isSubmitting}
                    className="px-6 py-2.5 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-40"
                  >
                    {isSubmitting ? 'Uploading and reading…' : 'Upload and run OCR'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
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
              {ocrResult ? 'Document uploaded and OCR processed' : 'Local preview only'}
            </span>
            <h3 className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] mt-3">
              Review complete
            </h3>
            <p className="text-sm text-[#55544E] max-w-lg mx-auto mt-2">
              {ocrResult
                ? 'The encrypted document is stored and the extracted fields are ready for review.'
                : 'This preview did not upload the selected document or run OCR.'}
            </p>
          </div>

          {ocrResult && (
            <div className="max-w-2xl mx-auto p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-left space-y-2">
              <div className="text-xs font-mono font-bold text-[#444C3D]">
                OCR results — {ocrResult.ocr_status.replace('_', ' ')}
              </div>
              {ocrResult.fields.map((field) => (
                <div key={field.field_name} className="flex justify-between gap-4 text-xs border-t border-[#E5DFD5] pt-2">
                  <span className="text-[#706E66]">{field.field_name.replace('_', ' ')}</span>
                  <span className="text-right text-[#1C1D1A]">
                    {field.document_value} <span className="text-[#706E66]">({Math.round(field.confidence * 100)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="max-w-md mx-auto p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-left text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-[#706E66]">File fingerprint:</span>
              <span className="text-[#444C3D] font-bold">SHA-256</span>
            </div>
            <div className="text-[10px] text-[#706E66] break-all">{generatedHash}</div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => { setIsSubmitted(false); setStep(4); }}
              className="px-6 py-3 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              Back to review <ArrowRight className="w-4 h-4" />
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