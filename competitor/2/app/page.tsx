"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";

// --- INJECTED COMPONENTS (Built directly into the file so you don't get import errors) ---

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block mt-2">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
        🔔
        <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
          1
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 w-80 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-3 border-b bg-gray-50 font-bold text-sm text-gray-700">System Alerts</div>
          <div className="p-4 text-sm text-gray-600">
            <span className="font-semibold text-red-600">Action Required:</span> FDR for this Institute is maturing soon. 
            <br/><span className="text-xs text-gray-400 mt-1 block">Automated email dispatched to Nodal Officer.</span>
          </div>
        </div>
      )}
    </div>
  );
}

function RefundButton({ fdrId, initialStatus = 'Active' }: { fdrId: string, initialStatus?: string }) {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const handleRefundSubmit = async () => {
    // Calls the local API endpoint
    await fetch(`/api/v1/fdr/${fdrId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Refund_Pending' })
    });
    setStatus('Refund_Pending');
    setShowModal(false);
  };

  if (status === 'Refund_Pending') {
    return <span className="px-3 py-2 text-xs font-bold text-orange-700 bg-orange-100 rounded-lg border border-orange-200">Refund Pending Approval</span>;
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-all">
        Initiate Refund
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 animate-fade-in-up">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Initiate FDR Discharge</h3>
            <p className="text-sm text-gray-500 mb-4">Upload official bank discharge letter to request a release of funds.</p>
            <input type="file" className="mb-5 w-full text-sm border p-2 rounded bg-gray-50" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all">Cancel</button>
              <button onClick={handleRefundSubmit} className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition-all">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RenewButton({ oldFdrId }: { oldFdrId: string }) {
  const triggerFakeUpload = () => {
    alert(`Upload Prompt Opened.\n\n[DEMO NOTE]: Behind the scenes, uploading here securely attaches this new file to the parent history ID: ${oldFdrId.substring(0,8)}...`);
  };

  return (
    <button onClick={triggerFakeUpload} className="px-4 py-2 text-xs font-bold text-blue-700 border-2 border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-2">
      <span>🔗</span> Renew Instrument
    </button>
  );
}

// --- MAIN DASHBOARD CODE ---

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/v1/upload-fdr`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setResult(data);
      } else {
        setError(data.error || "Failed to process document.");
      }
    } catch (err) {
      setError("Network error. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* --- BRANDING HEADER WITH INJECTED NOTIFICATION BELL --- */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image 
              src="/logo.png" 
              alt="VaultGuard Emblem" 
              width={60} 
              height={60} 
              className="rounded-lg object-contain bg-slate-900 p-1 shadow-md" 
              priority
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                VaultGuard
                <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-200 uppercase tracking-wider">
                  AICTE Regulatory Portal
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">Cryptographic FDR & Fee Certificate Verification</p>
            </div>
          </div>
          {/* Gap 1 Fix: The Bell */}
          <NotificationBell />
        </div>

        {/* --- UPLOAD SECTION --- */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 font-medium">
                  <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">Native Digital PDF (FDR / Fee Certificates)</p>
              </div>
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>

          {file && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg flex justify-between items-center border border-blue-100">
              <span>Selected: {file.name}</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`mt-6 w-full py-3 px-4 text-white font-bold rounded-xl transition-all shadow-md ${
              !file || loading ? "bg-gray-300 cursor-not-allowed shadow-none" : "bg-slate-900 hover:bg-slate-800 hover:shadow-lg"
            }`}
          >
            {loading ? "Verifying & Securing..." : "Verify & Secure FDR"}
          </button>
          
          {error && (
            <div className="mt-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* --- PAYOFF SCREEN: STRUCTURED FORM --- */}
        {result && result.structured_data && (
          <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm animate-fade-in-up">
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 border-b border-gray-100 pb-5 gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Automated Data Scrutiny</h3>
                <div className="mt-2 text-[10px] sm:text-xs font-mono text-gray-500 bg-gray-100 p-2 rounded border border-gray-200 break-all">
                  <span className="font-bold text-gray-700 uppercase mr-2">SHA-256 Hash:</span> 
                  {result.hash}
                </div>
              </div>
              <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg border-2 ${
                result.confidence_score === 100 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-wider">Confidence</span>
                <span className="text-xl font-black">{result.confidence_score}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Issuing Bank</label>
                <input type="text" readOnly value={result.structured_data['Bank Name'] || 'NOT DETECTED'} className={`mt-1.5 w-full p-2.5 border rounded-lg text-sm font-medium outline-none ${!result.structured_data['Bank Name'] ? 'border-red-300 text-red-600 bg-red-50' : 'border-gray-200 text-gray-900 bg-gray-50'}`} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">FDR Account Number</label>
                <input type="text" readOnly value={result.structured_data['FDR Number'] || 'NOT DETECTED'} className={`mt-1.5 w-full p-2.5 border rounded-lg text-sm font-medium outline-none ${!result.structured_data['FDR Number'] ? 'border-red-300 text-red-600 bg-red-50' : 'border-gray-200 text-gray-900 bg-gray-50'}`} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Principal Amount</label>
                <input type="text" readOnly value={result.structured_data['Amount'] ? `₹ ${result.structured_data['Amount']}` : 'NOT DETECTED'} className={`mt-1.5 w-full p-2.5 border rounded-lg text-sm font-bold outline-none ${!result.structured_data['Amount'] ? 'border-red-300 text-red-600 bg-red-50' : 'border-green-300 text-green-800 bg-green-50'}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Issue Date</label>
                  <input type="text" readOnly value={result.structured_data['Issue Date'] || 'NOT DETECTED'} className={`mt-1.5 w-full p-2.5 border rounded-lg text-sm font-medium outline-none ${!result.structured_data['Issue Date'] ? 'border-red-300 text-red-600 bg-red-50' : 'border-gray-200 text-gray-900 bg-gray-50'}`} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Maturity Date</label>
                  <input type="text" readOnly value={result.structured_data['Maturity Date'] || 'NOT DETECTED'} className={`mt-1.5 w-full p-2.5 border rounded-lg text-sm font-medium outline-none ${!result.structured_data['Maturity Date'] ? 'border-red-300 text-red-600 bg-red-50' : 'border-gray-200 text-gray-900 bg-gray-50'}`} />
                </div>
              </div>
            </div>

            {/* --- INJECTED ADMINISTRATIVE WORKFLOWS (GAP 2 & 3 FIX) --- */}
            <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Administrative Actions:
              </div>
              <div className="flex gap-3">
                <RenewButton oldFdrId={result.hash} />
                <RefundButton fdrId={result.hash} initialStatus="Active" />
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}