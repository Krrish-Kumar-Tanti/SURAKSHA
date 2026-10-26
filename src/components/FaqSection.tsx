import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why does SURAKSHA require a Three-Way Provenance match instead of trusting PDF uploads?',
      a: 'A simple PDF scan can be tampered with or encashed early without AICTE knowledge. SURAKSHA cross-references three independent layers: the institution declaration, high-accuracy OCR with bounding-box tracking on the physical receipt, and structured bank sandbox/API verification of live liens.',
    },
    {
      q: 'How does SURAKSHA calculate the deposit amount for Leased land under APH 2026–27?',
      a: 'Under Addendum/Corrigendum 2026–27 Item 11, any institution operating on leased building or land is subject to a mandatory 2.0× doubling multiplier on Table 1.4 baseline rates (e.g., an Engineering UG base of ₹35 Lakhs becomes ₹70 Lakhs).',
    },
    {
      q: 'What prevents premature or unauthorized security deposit refunds under Clause 6.46?',
      a: 'The Clause 6.46 Release DAG enforces mandatory clearance nodes across the Student Grievance Redressal Cell (PGRC), the Central Vigilance Bureau, and the Grants Cell. The backend enforces atomic HTTP 422 guard clauses, making approval technically impossible while any clearance is pending.',
    },
    {
      q: 'How does the Cross-Institution Pledge Radar detect duplicate pledges?',
      a: 'Large educational trusts often operate multiple institutions. SURAKSHA computes cryptographic document hashes and traces identical FDR numbers across all registered colleges, immediately flagging and freezing deposits that share collateral.',
    },
    {
      q: 'Who retains the interest earned on fixed deposits over the 10-year term?',
      a: 'Under APH Clause 1.12(iv), interest accrued on security deposits is retained exclusively by AICTE for statutory technical education development funds. Only the original principal deposit is refundable to the institution upon full compliance.',
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-10 max-w-[1000px] mx-auto relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-mono font-medium mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          Regulatory Clarity
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-3">
          Detailed explanations of AICTE Approval Process Handbook (APH 2024–27) rules and SURAKSHA system mechanics.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#111a2b]/90 border border-white/10 overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-[#172338]/40 transition"
            >
              <span className="font-bold text-sm sm:text-base text-white">{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-teal-400 shrink-0 transition-transform duration-200 ${
                  openIndex === idx ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === idx && (
              <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
