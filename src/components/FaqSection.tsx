import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does bank record review help?',
      a: 'It compares receipt details with available bank and institution records so reviewers can identify differences that need attention.',
      tag: 'Bank Verification',
    },
    {
      q: 'How is the policy estimate calculated?',
      a: 'The estimate uses the selected programme, premises status, and concession details. Review the cited handbook and current guidance when confirming an institution’s requirement.',
      tag: 'APH 2024-27',
    },
    {
      q: 'What is checked before a release?',
      a: 'The workflow brings together the required grievance, vigilance, grant, and holding-period clearances for review before a release decision.',
      tag: 'DAG Clearance',
    },
    {
      q: 'How are duplicate pledges identified?',
      a: 'Receipt numbers and document fingerprints can be compared across institutions to surface possible duplicate pledges for review.',
      tag: 'Fingerprint Match',
    },
    {
      q: 'Where can I see the deposit lifecycle?',
      a: 'The lifecycle view follows a deposit from submission and sizing through custody, maturity, and release.',
      tag: 'Audit Trail',
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-10 max-w-[1000px] mx-auto relative z-10">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-4 shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-[#444C3D]" />
          Regulatory Clarity
        </div>
        <AnimatedHeading
          as="h2"
          className="text-3xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em]"
        >
          Frequently Asked *Questions*
        </AnimatedHeading>
        <p className="text-[#55544E] text-xs sm:text-sm mt-3 font-normal max-w-md mx-auto">
          Deposits, verification standards, and release workflows under AICTE Approval Process Handbook.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`group rounded-2xl bg-white border transition-all duration-300 ease-out overflow-hidden ${
                isOpen
                  ? 'border-[#444C3D] ring-2 ring-[#444C3D]/15 shadow-[0_12px_28px_rgba(68,76,61,0.08)] -translate-y-0.5'
                  : 'border-[#E5DFD5] shadow-sm hover:border-[#DDD6C9] hover:-translate-y-0.5 hover:shadow-md'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer transition-colors duration-200 select-none group-active:scale-[0.995]"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <span
                    className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#444C3D] text-white shadow-sm'
                        : 'bg-[#F2ECE1] text-[#7A7870] group-hover:bg-[#EAE3D6] group-hover:text-[#444C3D]'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span
                      className={`font-semibold text-sm sm:text-base tracking-[-0.01em] transition-colors duration-200 block ${
                        isOpen ? 'text-[#444C3D]' : 'text-[#1C1D1A] group-hover:text-[#444C3D]'
                      }`}
                    >
                      {faq.q}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF8F5] text-[#7A7870] border border-[#E5DFD5]">
                    {faq.tag}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#444C3D] text-white rotate-180 shadow-sm'
                        : 'bg-[#FAF8F5] text-[#444C3D] group-hover:bg-[#EFEAE1]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                  </div>
                </div>
              </button>

              {/* Smooth height + opacity CSS Grid animated accordion container */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#55544E] leading-relaxed border-t border-[#E5DFD5]/70 pt-4 bg-[#FDFAF5]/40">
                    <p className="max-w-2xl">{faq.a}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
