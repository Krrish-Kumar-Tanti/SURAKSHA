import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does bank record review help?',
      a: 'It compares receipt details with available bank and institution records so reviewers can identify differences that need attention.',
    },
    {
      q: 'How is the policy estimate calculated?',
      a: 'The estimate uses the selected programme, premises status, and concession details. Review the cited handbook and current guidance when confirming an institution’s requirement.',
    },
    {
      q: 'What is checked before a release?',
      a: 'The workflow brings together the required grievance, vigilance, grant, and holding-period clearances for review before a release decision.',
    },
    {
      q: 'How are duplicate pledges identified?',
      a: 'Receipt numbers and document fingerprints can be compared across institutions to surface possible duplicate pledges for review.',
    },
    {
      q: 'Where can I see the deposit lifecycle?',
      a: 'The lifecycle view follows a deposit from submission and sizing through custody, maturity, and release.',
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-10 max-w-[1000px] mx-auto relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-[#444C3D]" />
          Regulatory Clarity
        </div>
        <AnimatedHeading
          as="h2"
          className="text-3xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em]"
        >
          Frequently Asked *Questions*
        </AnimatedHeading>
        <p className="text-[#55544E] text-xs sm:text-sm mt-3">
          Deposits, reviews, and release workflow.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white border border-[#E5DFD5] overflow-hidden transition-all duration-200 shadow-sm hover:border-[#DDD6C9]"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition cursor-pointer"
            >
              <span className="font-semibold text-sm sm:text-base text-[#1C1D1A]">{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#444C3D] shrink-0 transition-transform duration-200 ${
                  openIndex === idx ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === idx && (
              <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#55544E] leading-relaxed border-t border-[#E5DFD5] pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
