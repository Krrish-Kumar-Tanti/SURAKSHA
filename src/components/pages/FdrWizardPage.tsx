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
  FileText,
  ArrowLeft
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';
import { submitFdrSubmission } from '../../lib/api';
import { extractDocumentFields, readDocumentText, type ExtractedDocumentFields } from '../../lib/documentOcr';

interface FdrWizardPageProps {
  onNavigate: (screen: string) => void;
  currentRole?: string;
}

export function FdrWizardPage({ onNavigate, currentRole = 'INSTITUTION_USER' }: FdrWizardPageProps) {
  const [step, setStep] = useState(1);
  const [bankName, setBankName] = useState('State Bank of India');
  const [branchName, setBranchName] = useState('');
  const [ifsc, setIfsc] = useState('SBIN0001482');
  const [fdrNumber, setFdrNumber] = useState('FDR-SBI-2026-9921');
  const [depositAmount, setDepositAmount] = useState('3500000'); // ₹35 Lakhs
  const [tenorYears, setTenorYears] = useState('10');
  const [issueDate, setIssueDate] = useState('2026-10-25');
  const [maturityDate, setMaturityDate] = useState('2036-10-25');
  const [programme, setProgramme] = useState('Engineering UG');
  const [isLeased, setIsLeased] = useState(false);
  const [isConcession, setIsConcession] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [generatedHash, setGeneratedHash] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'complete' | 'partial' | 'no_text' | 'error'>('idle');
  const [ocrMethod, setOcrMethod] = useState('');
  const [ocrError, setOcrError] = useState('');
  const [extractedFields, setExtractedFields] = useState<ExtractedDocumentFields | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [isSavingSubmission, setIsSavingSubmission] = useState(false);
  const [savedSubmission, setSavedSubmission] = useState<{ instrument_id: string; document_id: string } | null>(null);

  // File Upload Handlers
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/\.(pdf|png|jpe?g|tiff?)$/i.test(file.name)) {
      setFormError('Choose a PDF, PNG, JPG, or TIFF file.');
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
    setIsProcessingFile(true);
    setOcrProgress(0);
    setOcrStatus('idle');
    setOcrMethod('');
    setOcrError('');
    setExtractedFields(null);
    e.target.value = '';

    try {
      const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
      const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
      setGeneratedHash(hash);
      setUploadDone(true);
    } catch {
      setFormError('The browser could not calculate a file fingerprint. Try another file or browser.');
      setSelectedFile(null);
      setIsProcessingFile(false);
      return;
    }

    try {
      const { text, method } = await readDocumentText(file, setOcrProgress);
      const fields = extractDocumentFields(text);
      const fieldCount = Object.values(fields).filter((value) => value !== null).length;
      setExtractedFields(fields);
      setOcrMethod(method);
      setOcrStatus(fieldCount >= 5 ? 'complete' : fieldCount > 0 ? 'partial' : 'no_text');

      if (fields.instrumentNumber) setFdrNumber(fields.instrumentNumber);
      if (fields.amount) setDepositAmount(fields.amount);
      if (fields.issueDate) setIssueDate(fields.issueDate);
      if (fields.maturityDate) setMaturityDate(fields.maturityDate);
      if (fields.bankName) setBankName(fields.bankName);
      if (fields.branch) setBranchName(fields.branch);
      if (fields.ifsc) setIfsc(fields.ifsc);
    } catch (error) {
      setOcrStatus('error');
      setOcrError(error instanceof Error ? error.message : 'The document could not be read.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const parsedAmountLakhs = parseFloat(depositAmount || '0') / 100000;
  const requiredAmountLakhs = (programme === 'Engineering UG' ? 35 : 15) * (isConcession ? 0.5 : 1.0) * (isLeased ? 2.0 : 1.0);
  const isCompliant = Number.isFinite(parsedAmountLakhs) && parsedAmountLakhs >= requiredAmountLakhs;

  const handleSubmit = async () => {
    if (!selectedFile || !uploadDone) {
      setSubmissionError('Select and read the receipt file before submitting.');
      return;
    }
    if (!branchName.trim() || !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifsc.trim())) {
      setSubmissionError('Enter the receipt branch and a valid 11-character IFSC code.');
      setStep(1);
      return;
    }
    if (!fdrNumber.trim() || !Number.isFinite(Number(depositAmount)) || Number(depositAmount) <= 0) {
      setSubmissionError('Enter a valid receipt number and deposit amount.');
      setStep(2);
      return;
    }

    setSubmissionError('');
    setIsSavingSubmission(true);
    try {
      const saved = await submitFdrSubmission(
        {
          instrument_number: fdrNumber.trim(),
          bank_name: bankName.trim(),
          branch: branchName.trim(),
          ifsc: ifsc.trim().toUpperCase(),
          amount_paise: Math.round(Number(depositAmount) * 100),
          issue_date: issueDate,
          maturity_date: maturityDate,
          tenure_months: Number(tenorYears) * 12,
          programme: programme === 'Engineering UG'
            ? 'ENGINEERING'
            : programme === 'Management'
              ? 'MANAGEMENT'
              : 'COMPUTER_APPLICATIONS',
          ocr_fields: extractedFields
            ? {
              amount: extractedFields.amount,
              instrumentNumber: extractedFields.instrumentNumber,
              issueDate: extractedFields.issueDate,
              maturityDate: extractedFields.maturityDate,
              bankName: extractedFields.bankName,
              branch: extractedFields.branch,
              ifsc: extractedFields.ifsc,
              depositor: extractedFields.depositor,
              lien: extractedFields.lien,
            }
            : {},
        },
        selectedFile,
      );
      setSavedSubmission(saved);
      setIsSubmitted(true);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'The submission could not be saved.');
    } finally {
      setIsSavingSubmission(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-10 px-4 sm:px-8 max-w-[1100px] mx-auto text-left">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => onNavigate('portfolio')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD6C9] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#444C3D] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
        </button>
      </div>

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
          { num: 5, title: 'Submission preview' },
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
          {submissionError && (
            <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {submissionError}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <label className="block text-xs font-mono text-[#55544E] mb-1.5">Branch name</label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="As printed on the receipt"
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
                  Text reading runs locally. When you submit, the receipt is encrypted and saved to your institution’s record for authorized review.
                </p>
              </div>

              {/* Hidden System File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.tiff"
                disabled={isProcessingFile}
                className="hidden"
              />

              {/* Clickable Drag/Drop & File Selection Zone */}
              <div 
                onClick={isProcessingFile ? undefined : handleUploadClick}
                className={`p-8 rounded-2xl border-2 border-dashed transition-all text-center ${
                  isProcessingFile ? 'cursor-wait opacity-80' : 'cursor-pointer'
                } ${
                  uploadDone ? 'border-emerald-500 bg-emerald-50/40' : 'border-[#DDD6C9] bg-[#FAF8F5] hover:border-[#444C3D]'
                }`}
              >
                {isProcessingFile ? (
                  <FileText className="w-8 h-8 mx-auto mb-2 text-[#444C3D] animate-pulse" />
                ) : (
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${uploadDone ? 'text-emerald-600' : 'text-[#706E66]'}`} />
                )}
                <div className="font-semibold text-sm text-[#1C1D1A]">
                  {isProcessingFile
                    ? `Reading ${selectedFile?.name ?? 'receipt'}...`
                    : selectedFile
                      ? `FDR Certificate Selected (${selectedFile.name})`
                      : 'Click to Upload FDR Certificate (PDF / TIFF / JPG / PNG)'}
                </div>
                <div className="text-xs text-[#706E66] mt-1 font-mono">
                  {isProcessingFile
                    ? `Extracting document text: ${ocrProgress}%`
                    : uploadDone
                      ? 'Fingerprint calculated; document reading finished.'
                      : 'Maximum file size: 25 MB'}
                </div>
                {isProcessingFile && (
                  <div className="mt-4 h-2 rounded-full bg-[#E5DFD5] overflow-hidden">
                    <div
                      className="h-full bg-[#444C3D] transition-all"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {ocrStatus !== 'idle' && !isProcessingFile && (
                <div
                  role={ocrStatus === 'error' ? 'alert' : 'status'}
                  className={`p-4 rounded-xl border text-xs ${
                    ocrStatus === 'complete'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {ocrStatus === 'complete'
                      ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {ocrStatus === 'complete'
                          ? `Found ${Object.values(extractedFields ?? {}).filter(Boolean).length} of 9 receipt fields using ${ocrMethod}.`
                          : ocrStatus === 'partial'
                            ? `Only ${Object.values(extractedFields ?? {}).filter(Boolean).length} of 9 receipt fields were recognized.`
                            : ocrStatus === 'no_text'
                              ? 'No receipt fields were recognized.'
                              : 'Document reading failed.'}
                      </p>
                      <p>
                        {ocrStatus === 'error'
                          ? `${ocrError} You can continue and enter the details manually.`
                          : ocrStatus === 'partial' || ocrStatus === 'no_text'
                            ? 'Try a brighter, sharper photo with the receipt flat, fully in frame, and the camera parallel. Avoid shadows and glare. You can also review and enter the receipt details manually; manual entries are not OCR-verified.'
                            : 'Check the values below and correct them if needed. OCR results are not verified.'}
                      </p>
                    </div>
                  </div>
                  {extractedFields && Object.values(extractedFields).some((value) => value !== null) && (
                    <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 border-t border-current/15 pt-3">
                      {([
                        ['FDR number', extractedFields.instrumentNumber],
                        ['Amount (₹)', extractedFields.amount],
                        ['Issue date', extractedFields.issueDate],
                        ['Maturity date', extractedFields.maturityDate],
                        ['Bank', extractedFields.bankName],
                        ['Branch', extractedFields.branch],
                        ['IFSC', extractedFields.ifsc],
                        ['Depositor', extractedFields.depositor],
                        ['Lien in favour of', extractedFields.lien],
                      ] as const).filter(([, value]) => value).map(([label, value]) => (
                        <div key={label} className="min-w-0">
                          <dt className="opacity-70">{label}</dt>
                          <dd className="font-medium break-words">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {(ocrStatus === 'partial' || ocrStatus === 'no_text' || ocrStatus === 'error') && (
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="mt-3 rounded-lg border border-current/30 px-3 py-2 font-semibold hover:bg-black/5"
                    >
                      Review and enter details manually
                    </button>
                  )}
                </div>
              )}

              {uploadDone && (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2 text-xs">
                  <div className="font-mono text-[#706E66]">File fingerprint (SHA-256):</div>
                  <div className="p-2.5 bg-white rounded-lg border border-[#E5DFD5] font-mono text-[11px] text-[#444C3D] break-all">
                    {generatedHash}
                  </div>
                  <div className="text-xs text-[#55544E]">
                    The fingerprint identifies the selected file.
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-lg border border-[#DDD6C9] text-xs font-medium text-[#55544E] cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!uploadDone || isProcessingFile}
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
                    <option value="Computer Applications">Computer Applications (Base ₹15L)</option>
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
                      Policy estimate
                    </span>
                    <h4 className="text-xl font-normal font-['Instrument_Serif'] text-[#1C1D1A] mt-0.5">
                      {isCompliant ? 'Entered amount meets this estimate' : 'Entered amount is below this estimate'}
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
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isCompliant || !uploadDone || isProcessingFile || isSavingSubmission}
                  className="px-6 py-2.5 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-40"
                >
                  {isSavingSubmission ? 'Saving securely...' : 'Submit FDR for review'} <ArrowRight className="w-4 h-4" />
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
              Institution record
            </span>
            <h3 className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] mt-3">
              FDR submitted
            </h3>
            <p className="text-sm text-[#55544E] max-w-lg mx-auto mt-2">
              The receipt and FDR details were encrypted and saved to your institution’s records for authorized officer review.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-left text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-[#706E66]">File fingerprint:</span>
              <span className="text-[#444C3D] font-bold">SHA-256</span>
            </div>
            <div className="text-[10px] text-[#706E66] break-all">{generatedHash}</div>
            {savedSubmission && (
              <div className="pt-2 border-t border-[#E5DFD5]">
                <span className="text-[#706E66]">Submission reference:</span>
                <div className="break-all">{savedSubmission.instrument_id}</div>
              </div>
            )}
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
              View institution records
            </button>
          </div>
        </div>
      )}
    </div>
  );
}