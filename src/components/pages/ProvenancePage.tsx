import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';
import { canResolveDiscrepancies, isScreenAllowed } from '../../lib/roleAccess';
interface ProvenancePageProps {
  onNavigate: (screen: string) => void;
  currentRole?: string;
}

export function ProvenancePage({ onNavigate, currentRole = 'AUDITOR' }: ProvenancePageProps) {

  const [waived, setWaived] = useState(false);
  const [activeCheck, setActiveCheck] = useState<'match' | 'discrepant'>('match');

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-10 px-4 sm:px-8 max-w-[1440px] mx-auto text-left">
      {/* Top Breadcrumb & Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          Autonomous 3-Way Reconciliation Engine
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          ( 3-Way Provenance & *Discrepancy Resolver* )
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2 max-w-3xl">
          Triangulating Bank Core Banking Feed (CBS), Institution OCR Document Scan, and AICTE Statutory Ledger to eliminate forged or encashed deposits.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5DFD5] mb-8">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#706E66]">Inspecting Record:</span>
          <select 
            value={activeCheck}
            onChange={(e) => setActiveCheck(e.target.value === 'discrepant' ? 'discrepant' : 'match')}
            className="text-xs font-semibold bg-[#FAF8F5] border border-[#DDD6C9] px-3 py-2 rounded-lg text-[#1C1D1A]"
          >
            <option value="match">SBI/PUN/2024/998214 — SIT Pune (Full 3-Way Match)</option>
            {currentRole !== 'INSTITUTION_USER' && (
              <option value="discrepant">CAN/ERD/2022/102948 — Bannari Amman Inst (Lien Mismatch)</option>
            )}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#706E66]">Adapter Sync:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Core Banking Realtime
          </span>
        </div>
      </div>

      {/* 3-Column Reconciliation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Column 1: Core Banking System (Bank Feed) */}
        <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">Source 1</span>
              <h3 className="text-lg font-bold text-[#1C1D1A]">Bank CBS Feed</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#EFEAE1] text-[#444C3D] text-[11px] font-mono font-bold">
              SBI SFTP Gateway
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">FDR Account Number</span>
              <span className="text-sm font-bold text-[#1C1D1A]">38491029481</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Principal Balance</span>
              <span className="text-sm font-bold text-emerald-700">₹70,00,000.00</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Lien Clause Status</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> AICTE Joint Lien Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Maturity Expiry</span>
              <span className="text-xs font-bold text-[#1C1D1A]">15-Aug-2034 (10-Yr Tenor)</span>
            </div>
          </div>
        </div>

        {/* Column 2: Institution OCR Scan */}
        <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">Source 2</span>
              <h3 className="text-lg font-bold text-[#1C1D1A]">OCR Extracted Scan</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#EFEAE1] text-[#444C3D] text-[11px] font-mono font-bold">
              PDF Document AI
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Receipt Number</span>
              <span className="text-sm font-bold text-[#1C1D1A]">SBI/PUN/2024/998214</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Extracted Value</span>
              <span className="text-sm font-bold text-emerald-700">₹70,00,000 (Confidence 99.4%)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Pledge Statement</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Regional Officer AICTE Pledged
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Cryptographic SHA-256</span>
              <span className="text-[10px] text-[#706E66] truncate block">e3b0c44298fc1c149afbf4c8996fb92427...</span>
            </div>
          </div>
        </div>

        {/* Column 3: AICTE Statutory Ledger */}
        <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">Source 3</span>
              <h3 className="text-lg font-bold text-[#1C1D1A]">AICTE Central Ledger</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#EFEAE1] text-[#444C3D] text-[11px] font-mono font-bold">
              APH Table 1.4 Mandate
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Prescribed Obligation</span>
              <span className="text-sm font-bold text-[#1C1D1A]">₹70 Lakhs (Engineering UG Leased)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Provenance Verdict</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 3-Way Triangulation Match (100%)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Audit Block Sequence</span>
              <span className="text-xs font-bold text-[#1C1D1A]">Block #10480 (Immutable)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
              <span className="text-[#706E66] block text-[10px]">Dealing Officer Sign-Off</span>
              <span className="text-xs font-bold text-[#444C3D]">Verified & Active</span>
            </div>
          </div>
        </div>

      </div>

      {/* Discrepancy Resolution Action Banner */}
      {canResolveDiscrepancies(currentRole) && activeCheck === 'discrepant' && (
        <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-[#444C3D] font-bold bg-[#EFEAE1] border border-[#DDD6C9] px-3 py-1 rounded-full">
            Statutory Resolution Panel
          </span>
          <h3 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] mt-2">
            Discrepancy Waiver & Officer Attestation
          </h3>
          <p className="text-xs text-[#55544E] max-w-xl mt-1">
            Dealing Officers and Regional Directors can waive minor OCR optical noise or require bank re-verification under AICTE compliance guidelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setWaived(!waived)}
            className={`px-5 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition shadow-sm ${
              waived
                ? 'bg-emerald-700 text-white'
                : 'bg-[#444C3D] hover:bg-[#353C2F] text-white'
            }`}
          >
            {waived ? '✓ Discrepancy Waived by Director' : 'Waive Discrepancy (Director RB)'}
          </button>
          {isScreenAllowed(currentRole, 'policy') && <button
            onClick={() => onNavigate('policy')}
            className="px-5 py-2.5 rounded-lg border border-[#DDD6C9] bg-[#ECE7DE] hover:bg-[#E3DDCF] text-[#1C1D1A] text-xs font-medium cursor-pointer"
          >
            Inspect Policy Rules →
          </button>}
        </div>
        </div>
      )}
    </div>
  );
}
