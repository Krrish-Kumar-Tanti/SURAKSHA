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
  Calculator
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';
import { calculatePolicyDeposit } from '../../lib/api';

interface PolicyTracePageProps {
  onNavigate: (screen: string) => void;
  currentRole?: string;
}

export function PolicyTracePage({ onNavigate, currentRole = 'DIRECTOR_RB' }: PolicyTracePageProps) 

 {
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

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-10 px-4 sm:px-8 max-w-[1300px] mx-auto text-left">
      {/* Top Breadcrumb & Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          Sample policy estimate
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          ( *Policy estimate* )
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2 max-w-2xl">
          Explore how programme, premises, and concession details affect the estimated deposit amount.
        </p>
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
                Change the example inputs to update the estimate
              </p>
            </div>

            {/* Academic Programme Selection */}
            <div>
              <label className="block text-xs font-mono text-[#55544E] mb-1.5 font-bold">
                Technical Programme & Level
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
                  <div className="text-xs font-bold text-[#1C1D1A]">Premises Lease Multiplier</div>
                  <div className="text-[11px] text-[#706E66] font-mono">APH Clause 1.13 / Addendum Item 11</div>
                </div>
                <input
                  type="checkbox"
                  checked={isLeased}
                  onChange={(e) => setIsLeased(e.target.checked)}
                  className="w-4 h-4 accent-[#444C3D] cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-[#55544E] leading-relaxed">
                The demo applies a <span className="font-bold text-[#1C1D1A]">2.0x</span> example multiplier for leased premises. Confirm actual requirements with current official guidance.
              </p>
            </div>

            {/* Regional & Social Concession Toggle */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1C1D1A]">Special Category Concession (50%)</div>
                  <div className="text-[11px] text-[#706E66] font-mono">NE / J&K / Women-Only / PwD</div>
                </div>
                <input
                  type="checkbox"
                  checked={isConcession}
                  onChange={(e) => setIsConcession(e.target.checked)}
                  className="w-4 h-4 accent-[#444C3D] cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-[#55544E] leading-relaxed">
                The demo applies a <span className="font-bold text-[#1C1D1A]">50% example reduction</span>. Eligibility must be confirmed against current official guidance.
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
                  Example calculation
                </span>
                <h3 className="text-xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  How the estimate is calculated
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#706E66] block">Estimated amount (demo)</span>
                <span className="text-2xl font-bold text-[#444C3D] font-mono">
                  ₹{traceData?.requiredAmount || 70} Lakhs
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
                References used by this estimate
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

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => onNavigate('release')}
                className="px-6 py-3 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                View release workflow examples <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
