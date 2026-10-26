import React, { useState } from 'react';
import { Clock, Shield, RefreshCw, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading';

export function LifecycleTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 'creation',
      label: 'Phase 1: Creation & Sizing',
      title: 'Statutory Deposit Creation at LoA',
      subtitle: 'Mandatory FDR creation prior to issuance of Letter of Approval (LoA)',
      bullets: [
        'Table 1.4 baseline calculation (Engineering UG: ₹35 Lakhs).',
        '2026–27 Addendum Item 10: 50% concession applied for special categories.',
        'Addendum Item 11: 2.0× multiplier applied for leased land/buildings.',
        'Joint FDR wording verified: Secretary of the Trust AND Regional Officer, AICTE.',
      ],
      image: '/photos/01_security_deposit_vault.jpg',
      stat: '₹35L – ₹70L',
      statLabel: 'Statutory Range',
    },
    {
      id: 'custody',
      label: 'Phase 2: 10-Year Custody',
      title: 'Continuous Custody & Interest Retention',
      subtitle: 'Statutory 10-year holding period under Clause 1.12(iv)',
      bullets: [
        'Continuous lien marking to AICTE validated via bank sandbox adapters.',
        'Quarterly interest retention: Clause 1.12(iv) retains interest for AICTE corpus.',
        'Cross-institution duplicate pledge radar continuously scans for collateral reuse.',
        'Encrypted document vault stores raw scans with SHA-256 verifiable checksums.',
      ],
      image: '/photos/06_time_machine_chronometer.jpg',
      stat: '10 Years',
      statLabel: 'Holding Period',
    },
    {
      id: 'renewal',
      label: 'Phase 3: Maturity & Renewal',
      title: 'Automated Maturity Alert Engine',
      subtitle: 'Time machine countdown and auto-escalations at T-90, T-30, T-0',
      bullets: [
        'T-90, T-60, T-30, T-7 days automated notifications dispatched to institution.',
        'L1, L2, L3 auto-escalations to Regional Officer and Central Approving Authority.',
        'Successor FDR linking preserves multi-decade lineage for institutional expansion.',
        'Clause 2.25(f) late deposit penalties (10% to 20%) calculated automatically.',
      ],
      image: '/photos/10_control_tower_command.jpg',
      stat: 'T-90 to T-0',
      statLabel: 'Alert Timeline',
    },
    {
      id: 'release',
      label: 'Phase 4: Clause 6.46 Release',
      title: 'Statutory Release & Clearance DAG',
      subtitle: 'Atomic multi-desk verification before principal refund',
      bullets: [
        'PGRC Desk: verifies zero active student or faculty capitation fee complaints.',
        'Vigilance Bureau: verifies zero active CBI/CVC/State police disciplinary probes.',
        'Grants Cell: verifies zero unutilized or un-refunded AICTE development grants.',
        'Ed25519 digitally signed release sanction order and NOC dispatched directly to bank.',
      ],
      image: '/photos/08_aicte_regulatory_emblem.jpg',
      stat: '100% Audit',
      statLabel: 'CAG Defense',
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-10 max-w-[1376px] mx-auto relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-4">
          Lifecycle Management
        </div>
        <AnimatedHeading
          as="h2"
          className="text-3xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em]"
        >
          The 4 Phases of an AICTE *Security Deposit*
        </AnimatedHeading>
        <p className="text-[#55544E] text-sm md:text-base mt-4">
          Explore how SURAKSHA manages deposits across their entire 10-year lifecycle from creation to safe refund.
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
    </section>
  );
}
