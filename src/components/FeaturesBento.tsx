import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  GitMerge, 
  FileSearch, 
  CheckCircle2, 
  ArrowUpRight, 
  Lock, 
  Building2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading';
import { BotanicalBranch } from './BotanicalBranch';

export function FeaturesBento() {
  return (
    <section className="py-20 relative z-10">
      {/* Full-width Botanical Vine divider */}
      <div className="w-full overflow-hidden mb-10 opacity-85">
        <BotanicalBranch className="w-full text-[#444C3D]" />
      </div>

      <div className="max-w-[1376px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-4">
          Security-deposit workflows
        </div>
        <AnimatedHeading
          as="h2"
          className="text-3xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] leading-tight"
        >
          Tools for Every *Security Deposit*
        </AnimatedHeading>
        <p className="text-[#55544E] text-sm md:text-base mt-4 leading-relaxed">
          Explore the tools available for deposit submission, review, policy estimates, and release workflows.
        </p>
      </div>

      {/* Bento Grid (2x2 with rich Editorial Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

        {/* CARD 1: Bank Record Review */}
        <div className="group relative rounded-2xl bg-white border border-[#E5DFD5] overflow-hidden p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#DDD6C9]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono text-[#444C3D] tracking-wider font-semibold">
                DEPOSIT REVIEW
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5DFD5] text-[#706E66]">
                Record comparison
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-[#444C3D] group-hover:scale-105 transition-transform">
                <FileSearch className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-normal text-[#1C1D1A] font-serif tracking-tight group-hover:text-[#444C3D] transition-colors">
                Bank Record Review
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#55544E] leading-relaxed">
              Compare institution details, receipt information, and bank records to identify differences that need review.
            </p>
          </div>

          {/* Bespoke Visual Graphic: Bank Verification & OCR Inspector */}
          <div className="mt-6 rounded-xl overflow-hidden border border-[#E5DFD5] relative h-48 sm:h-56 bg-[#F8F5EE] p-4 flex flex-col justify-between">
            {/* Miniature FDR Certificate Card */}
            <div className="bg-white rounded-lg border border-[#E5DFD5] p-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F0EEEA] pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#1F6F50]" />
                  <span className="text-[11px] font-mono font-bold text-[#1C1D1A]">FDR/2026/SBI-98421</span>
                </div>
                <span className="text-[10px] font-mono bg-[#EAF4EE] text-[#1F6F50] px-2 py-0.5 rounded font-semibold">
                  99.4% OCR MATCH
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-[#828077] block">Joint Holder</span>
                  <span className="font-semibold text-[#1C1D1A]">AICTE & College Trust</span>
                </div>
                <div>
                  <span className="text-[#828077] block">Principal Amount</span>
                  <span className="font-semibold text-[#1F6F50] font-mono">₹35,00,000</span>
                </div>
              </div>
            </div>

            {/* Reconciliation Status Badge */}
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg border border-[#E5DFD5] px-3 py-2">
              <div className="flex items-center gap-2 text-[11px] text-[#444C3D]">
                <CheckCircle2 className="w-4 h-4 text-[#1F6F50]" />
                <span className="font-medium">Core Banking SFTP Confirmed</span>
              </div>
              <span className="text-[10px] font-mono text-[#828077]">10-Yr Lock-in Active</span>
            </div>

            <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-[#E5DFD5] text-[#1C1D1A] shadow-sm">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* CARD 2: Policy Estimate */}
        <div className="group relative rounded-2xl bg-white border border-[#E5DFD5] overflow-hidden p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#DDD6C9]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono text-[#444C3D] tracking-wider font-semibold">
                DEPOSIT ESTIMATE
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5DFD5] text-[#706E66]">
                Illustrative estimate
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-[#444C3D] group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-normal text-[#1C1D1A] font-serif tracking-tight group-hover:text-[#444C3D] transition-colors">
                Policy Estimate
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#55544E] leading-relaxed">
              Estimate deposit requirements using programme, concession, and premises details.
            </p>
          </div>

          {/* Bespoke Visual Graphic: Dynamic APH Formula Matrix */}
          <div className="mt-6 rounded-xl overflow-hidden border border-[#E5DFD5] relative h-48 sm:h-56 bg-[#F8F5EE] p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white rounded-lg border border-[#E5DFD5] px-3 py-2 text-[11px]">
                <span className="text-[#55544E] font-medium">Programme</span>
                <span className="font-semibold text-[#1C1D1A]">Engineering & Tech (UG)</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-[#E5DFD5] px-3 py-2 text-[11px]">
                <span className="text-[#55544E] font-medium">Land & Premises</span>
                <span className="font-mono font-semibold text-[#444C3D] bg-[#EFEAE1] px-2 py-0.5 rounded">
                  Leased (× 2.0 Factor)
                </span>
              </div>
            </div>

            {/* Total Calculation Strip */}
            <div className="bg-[#444C3D] text-white rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#DDD6C9] block">STATUTORY OBLIGATION</span>
                <span className="text-lg font-serif italic font-normal">₹70,00,000</span>
              </div>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded">APH Table 1.4</span>
            </div>

            <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-[#E5DFD5] text-[#1C1D1A] shadow-sm">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* CARD 3: Duplicate Pledge Review */}
        <div className="group relative rounded-2xl bg-white border border-[#E5DFD5] overflow-hidden p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#DDD6C9]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono text-[#444C3D] tracking-wider font-semibold">
                RECORD REVIEW
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5DFD5] text-[#706E66]">
                Duplicate review
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-[#444C3D] group-hover:scale-105 transition-transform">
                <GitMerge className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-normal text-[#1C1D1A] font-serif tracking-tight group-hover:text-[#444C3D] transition-colors">
                Duplicate Pledge Review
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#55544E] leading-relaxed">
              Review receipt numbers and document fingerprints across institutions to identify possible duplicate pledges.
            </p>
          </div>

          {/* Bespoke Visual Graphic: Graph Radar & Network Cross-Check */}
          <div className="mt-6 rounded-xl overflow-hidden border border-[#E5DFD5] relative h-48 sm:h-56 bg-[#F8F5EE] p-4 flex flex-col justify-between">
            {/* Visual Node Graph */}
            <div className="relative h-24 flex items-center justify-center">
              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="25%" y1="50%" x2="50%" y2="50%" stroke="#DDD6C9" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="75%" y2="50%" stroke="#DDD6C9" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
              {/* Node 1 */}
              <div className="absolute left-[15%] flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white border border-[#E5DFD5] flex items-center justify-center shadow-xs">
                  <Building2 className="w-4 h-4 text-[#828077]" />
                </div>
                <span className="text-[9px] font-mono text-[#828077] mt-1">Inst. #104</span>
              </div>
              {/* Central Radar Node */}
              <div className="absolute left-[50%] -translate-x-1/2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#444C3D] text-white flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono text-[#444C3D] font-bold mt-1">Radar Core</span>
              </div>
              {/* Node 2 */}
              <div className="absolute right-[15%] flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white border border-[#E5DFD5] flex items-center justify-center shadow-xs">
                  <Lock className="w-4 h-4 text-[#828077]" />
                </div>
                <span className="text-[9px] font-mono text-[#828077] mt-1">FDR #98421</span>
              </div>
            </div>

            {/* Radar Result Banner */}
            <div className="bg-white rounded-lg border border-[#E5DFD5] px-3 py-2 flex items-center justify-between text-[11px]">
              <span className="text-[#1F6F50] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 0 Collateral Conflicts
              </span>
              <span className="text-[10px] font-mono text-[#828077]">10,482 Inst. Scanned</span>
            </div>

            <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-[#E5DFD5] text-[#1C1D1A] shadow-sm">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* CARD 4: Release Clearances */}
        <div className="group relative rounded-2xl bg-white border border-[#E5DFD5] overflow-hidden p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#DDD6C9]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono text-[#444C3D] tracking-wider font-semibold">
                RELEASE WORKFLOW
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5DFD5] text-[#706E66]">
                Workflow preview
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-[#444C3D] group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-normal text-[#1C1D1A] font-serif tracking-tight group-hover:text-[#444C3D] transition-colors">
                Release Clearances
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#55544E] leading-relaxed">
              Bring required clearances together so reviewers can assess a release request before a final decision.
            </p>
          </div>

          {/* Bespoke Visual Graphic: 13-Gate Clearance Checklist */}
          <div className="mt-6 rounded-xl overflow-hidden border border-[#E5DFD5] relative h-48 sm:h-56 bg-[#F8F5EE] p-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="bg-white rounded-md border border-[#E5DFD5] px-2.5 py-1.5 flex items-center justify-between text-[10px]">
                <span className="text-[#55544E] font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#1F6F50]" /> 10-Year Term Served
                </span>
                <span className="font-mono text-[#1F6F50] font-semibold">PASSED</span>
              </div>
              <div className="bg-white rounded-md border border-[#E5DFD5] px-2.5 py-1.5 flex items-center justify-between text-[10px]">
                <span className="text-[#55544E] font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#1F6F50]" /> PGRC Student Grievance
                </span>
                <span className="font-mono text-[#1F6F50] font-semibold">NO DISPUTES</span>
              </div>
              <div className="bg-white rounded-md border border-[#E5DFD5] px-2.5 py-1.5 flex items-center justify-between text-[10px]">
                <span className="text-[#55544E] font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#1F6F50]" /> Vigilance & Disciplinary
                </span>
                <span className="font-mono text-[#1F6F50] font-semibold">CLEARED</span>
              </div>
            </div>

            {/* Final Action Bar */}
            <div className="bg-white rounded-lg border border-[#E5DFD5] p-2 flex items-center justify-between text-[10px]">
              <span className="font-mono text-[#444C3D] font-bold">DIGITAL NOC & SANCTION</span>
              <span className="bg-[#EAF4EE] text-[#1F6F50] font-mono px-2 py-0.5 rounded font-bold">
                ELIGIBLE FOR RELEASE
              </span>
            </div>

            <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-[#E5DFD5] text-[#1C1D1A] shadow-sm">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
);
}
