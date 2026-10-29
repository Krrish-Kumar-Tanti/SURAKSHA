import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  FileText, 
  Info,
  Layers,
  Calculator,
  ArrowLeft
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';
import { calculatePolicyDeposit } from '../../lib/api';

interface PolicyTracePageProps {
  onNavigate: (screen: string) => void;
  currentRole?: string;
}

export function PolicyTracePage({ onNavigate, currentRole = 'DIRECTOR_RB' }: PolicyTracePageProps) {
  const [programme, setProgramme] = useState('Engineering UG');
  const [isLeased, setIsLeased] = useState(true);
  const [isConcession, setIsConcession] = useState(false);
  const [academicYear, setAcademicYear] = useState('2024-27');
  const [traceData, setTraceData] = useState<any>(null);

  useEffect(() => {
    calculatePolicyDeposit({
      programme,
      isLeased,
      isConcession,
      academicYear,
    }).then((res) => {
      setTraceData(res);
    });
  }, [programme, isLeased, isConcession, academicYear]);

  // Live calculation breakdown
  const base = programme === 'Engineering UG' ? 35 : programme === 'Management' ? 15 : programme === 'Pharmacy' ? 20 : 15;
  const concessionFactor = isConcession ? 0.5 : 1.0;
  const leaseMultiplier = isLeased ? 2.0 : 1.0;
  const totalAmount = base * concessionFactor * leaseMultiplier;

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-8 px-4 sm:px-8 max-w-[1300px] mx-auto text-left">
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
          AICTE Handbook Table 1.4 Mathematical Transparency Engine
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          ( *Policy Trace Engine* )
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2 max-w-3xl">
          Deterministic sizing engine eliminating ambiguity, discretion, and corruption. Institutions see exactly why every rupee is required, and officers verify requirements against statutory rule-trees.
        </p>
      </div>

      {/* Mathematical Transparency Formula Callout */}
      <div className="mb-8 p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5DFD5]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">
              Transparent Mathematical Formula (Clause 1.12 + Addendum Items 10 & 11)
            </span>
            <div className="text-lg sm:text-xl font-mono font-bold text-[#1C1D1A] mt-1">
              Required = Base Amount × Concession Factor (0.5) × Lease Multiplier (2.0)
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#EFEAE1] border border-[#DDD6C9] text-center shrink-0 font-mono">
            <span className="text-[10px] text-[#706E66] block">Calculated Requirement</span>
            <span className="text-2xl font-bold text-[#444C3D]">₹{totalAmount} Lakhs</span>
          </div>
        </div>

        {/* Live Formula Factor Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
            <span className="text-[#706E66] block text-[10px]">1. Base Amount (Table 1.4)</span>
            <span className="text-base font-bold text-[#1C1D1A]">₹{base} Lakhs</span>
            <span className="text-[10px] text-[#55544E] block mt-0.5">{programme}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
            <span className="text-[#706E66] block text-[10px]">2. Concession Factor (Item 10)</span>
            <span className="text-base font-bold text-[#1C1D1A]">{concessionFactor}×</span>
            <span className="text-[10px] text-[#55544E] block mt-0.5">
              {isConcession ? '50% Special Relief Applied' : 'Standard Rate (No Concession)'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
            <span className="text-[#706E66] block text-[10px]">3. Lease Multiplier (Item 11)</span>
            <span className="text-base font-bold text-[#1C1D1A]">{leaseMultiplier}×</span>
            <span className="text-[10px] text-[#55544E] block mt-0.5">
              {isLeased ? 'Leased Land Surcharge (2.0×)' : 'Owned Campus (1.0× Base)'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Interactive Parameters Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                Institutional Parameters
              </h3>
              <p className="text-xs text-[#706E66] font-mono mt-0.5">
                Simulate different scenarios to see live sizing changes
              </p>
            </div>

            {/* Academic Programme Selection */}
            <div>
              <label className="block text-xs font-mono text-[#55544E] mb-1.5 font-bold">
                Technical Programme & Level (Table 1.4)
              </label>
              <select
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-xs sm:text-sm text-[#1C1D1A] font-medium"
              >
                <option value="Engineering UG">Engineering & Technology (UG) — Base ₹35L</option>
                <option value="Engineering PG">Engineering & Technology (PG) — Base ₹15L</option>
                <option value="Management">Management (MBA/PGDM) — Base ₹15L</option>
                <option value="Pharmacy">Pharmacy (B.Pharm) — Base ₹20L</option>
                <option value="Computer Applications">MCA Computer Applications — Base ₹15L</option>
              </select>
            </div>

            {/* Academic Handbook Version */}
            <div>
              <label className="block text-xs font-mono text-[#55544E] mb-1.5 font-bold">
                Approval Process Handbook Edition
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-xs sm:text-sm text-[#1C1D1A] font-medium"
              >
                <option value="2024-27">APH 2024–27 (Current Active Pack)</option>
                <option value="2026-27">APH 2026–27 Addendum (Draft Rules)</option>
              </select>
            </div>

            {/* Campus Ownership Toggle */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1C1D1A]">Premises Lease Multiplier (2.0×)</div>
                  <div className="text-[11px] text-[#706E66] font-mono">Addendum Item 11 / APH Clause 1.13</div>
                </div>
                <input
                  type="checkbox"
                  checked={isLeased}
                  onChange={(e) => setIsLeased(e.target.checked)}
                  className="w-4 h-4 accent-[#444C3D] cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-[#55544E] leading-relaxed">
                Applies a <span className="font-bold text-[#1C1D1A]">2.0× mandatory doubling</span> if the institution operates on leased land or leased building.
              </p>
            </div>

            {/* Regional & Social Concession Toggle */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1C1D1A]">Special Category Concession (50%)</div>
                  <div className="text-[11px] text-[#706E66] font-mono">Addendum Item 10: NE / J&K / Ladakh / Women / PwD</div>
                </div>
                <input
                  type="checkbox"
                  checked={isConcession}
                  onChange={(e) => setIsConcession(e.target.checked)}
                  className="w-4 h-4 accent-[#444C3D] cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-[#55544E] leading-relaxed">
                Applies a <span className="font-bold text-[#1C1D1A]">50% statutory reduction (0.5× factor)</span> for qualifying regional and demographic institutions.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Trace & DAG Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">
                  Deterministic Step-by-Step Proof
                </span>
                <h3 className="text-xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  Rule Evaluation Proof
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#706E66] block">Statutory Required Deposit</span>
                <span className="text-2xl font-bold text-[#444C3D] font-mono">
                  ₹{totalAmount} Lakhs
                </span>
              </div>
            </div>

            {/* DAG Steps */}
            <div className="space-y-4">
              {traceData?.trace?.map((step: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#444C3D] font-bold block">{step.step}</span>
                    <div className="font-semibold text-sm text-[#1C1D1A] mt-0.5">{step.label}</div>
                    <div className="text-[11px] font-mono text-[#706E66] mt-0.5 flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-[#444C3D]" /> {step.clause}
                    </div>
                  </div>
                  <div className="text-base font-bold font-mono text-[#1C1D1A]">
                    {step.amountDisplay}
                  </div>
                </div>
              ))}
            </div>

            {/* Regulatory Citations Accordion */}
            <div className="mt-6 pt-6 border-t border-[#E5DFD5]">
              <div className="text-xs font-mono uppercase text-[#706E66] font-bold mb-3">
                Statutory Citations & Legal Mandates
              </div>
              <ul className="space-y-2 text-xs text-[#55544E]">
                {traceData?.citations?.map((cit: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#444C3D] font-bold">§</span>
                    <span>{cit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => onNavigate('portfolio')}
                className="px-5 py-2.5 rounded-lg border border-[#DDD6C9] bg-white hover:bg-[#FAF8F5] text-[#1C1D1A] text-xs font-medium cursor-pointer"
              >
                Back to Portfolio
              </button>
              <button
                onClick={() => onNavigate('provenance')}
                className="px-6 py-2.5 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                View 3-Way Matcher <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
