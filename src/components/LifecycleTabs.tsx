import React, { useState } from 'react';
import { Clock, Shield, RefreshCw, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading';
import { BotanicalBranch } from './BotanicalBranch';

export function LifecycleTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 'creation',
      label: 'Phase 1: Creation & Sizing',
      title: 'Submit deposit details',
      subtitle: 'Planned intake steps for a new fixed deposit receipt',
      bullets: [
        'The intended calculator uses programme details to estimate a deposit amount.',
        'Eligible concessions and leased premises are inputs in the planned calculation.',
        'The institution would provide the receipt and pledge details for review.',
        'Review the joint pledge wording shown on the FDR receipt.',
      ],
      image: '/photos/01_deposit_intake_certificate.jpg',
      stat: '₹35L – ₹70L',
      statLabel: 'Example amounts',
    },
    {
      id: 'custody',
      label: 'Phase 2: 10-Year Custody',
      title: 'Track a deposit while it is held',
      subtitle: 'Planned custody and interest information',
      bullets: [
        'Track the AICTE lien status for each deposit.',
        'The applicable interest rules should be confirmed against current official guidance.',
        'Check for duplicate receipts across institutions.',
        'Keep receipt documents and their fingerprints with the deposit record.',
      ],
      image: '/photos/02_custody_ledger_vault.jpg',
      stat: '10 Years',
      statLabel: 'Example period',
    },
    {
      id: 'renewal',
      label: 'Phase 3: Maturity & Renewal',
      title: 'Plan for maturity and renewal',
      subtitle: 'Planned reminders and follow-up steps',
      bullets: [
        'Notify users before a deposit matures.',
        'Escalate overdue follow-up to the appropriate reviewer.',
        'Link renewed receipts to preserve the deposit history.',
        'Calculate applicable late-deposit penalties.',
      ],
      image: '/photos/03_maturity_renewal_chronometer.jpg',
      stat: 'T-90 to T-0',
      statLabel: 'Planned reminder window',
    },
    {
      id: 'release',
      label: 'Phase 4: Clause 6.46 Release',
      title: 'Review a release request',
      subtitle: 'Planned checks before a deposit is returned',
      bullets: [
        'Review student grievance clearance.',
        'Review vigilance and grant clearances.',
        'Confirm all required conditions before approving a release.',
        'Prepare the release order and related bank instruction.',
      ],
      image: '/photos/04_release_clearance_noc.jpg',
      stat: 'Preview',
      statLabel: 'Not an approval',
    },
  ];

  return (
    <section className="py-20 relative z-10">
      {/* Full-width Botanical Vine divider */}
      <div className="w-full overflow-hidden mb-10 opacity-85">
        <BotanicalBranch className="w-full text-[#444C3D]" />
      </div>

      <div className="max-w-[1376px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-4">
          Planned lifecycle
        </div>
        <AnimatedHeading
          as="h2"
          className="text-3xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em]"
        >
          The 4 Phases of an AICTE *Security Deposit*
        </AnimatedHeading>
        <p className="text-[#55544E] text-sm md:text-base mt-4">
          Follow the planned deposit lifecycle from submission and custody through maturity and release.
        </p>
      </div>

      {/* Tab Selector Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(idx)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === idx
                ? 'bg-[#444C3D] text-white shadow-sm'
                : 'bg-[#ECE7DE] text-[#444C3D] hover:bg-[#E3DDCF] border border-[#DDD6C9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Display Card (Crisp White Editorial Paper) */}
      <div className="rounded-3xl bg-white border border-[#E5DFD5] p-8 lg:p-12 shadow-[0_15px_45px_rgba(28,29,26,0.06)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#444C3D] font-bold uppercase tracking-wider">
            <span>{tabs[activeTab].subtitle}</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] tracking-tight">
            {tabs[activeTab].title}
          </h3>

          <ul className="space-y-3.5 pt-2">
            {tabs[activeTab].bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#55544E]">
                <CheckCircle2 className="w-4 h-4 text-[#444C3D] shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 flex items-center gap-6 border-t border-[#E5DFD5]">
            <div>
              <div className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">{tabs[activeTab].stat}</div>
              <div className="text-xs text-[#706E66]">{tabs[activeTab].statLabel}</div>
            </div>
          </div>
        </div>

        {/* 3D Visual for the Active Tab */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[#E5DFD5] bg-[#FAF8F5] h-64 lg:h-80 relative shadow-md">
          <img
            src={tabs[activeTab].image}
            alt={tabs[activeTab].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  </section>
);
}
