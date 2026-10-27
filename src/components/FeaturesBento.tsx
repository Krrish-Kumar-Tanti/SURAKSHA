import React from 'react';
import { ShieldCheck, Scale, Layers, GitMerge, FileSearch, Lock, ArrowUpRight } from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading';

export function FeaturesBento() {
  const pillars = [
    {
      tag: 'DEPOSIT REVIEW',
      title: 'Bank Record Review',
      desc: 'Compare institution details, receipt information, and bank records to identify differences that need review.',
      image: '/photos/09_provenance_scanner_3d.jpg',
      icon: FileSearch,
      accent: 'from-teal-500/20 to-teal-900/10',
      border: 'hover:border-teal-500/50',
      badge: 'Record comparison',
    },
    {
      tag: 'DEPOSIT ESTIMATE',
      title: 'Policy Estimate',
      desc: 'Estimate deposit requirements using programme, concession, and premises details.',
      image: '/photos/02_fdr_certificate_3d.jpg',
      icon: Scale,
      accent: 'from-blue-500/20 to-blue-900/10',
      border: 'hover:border-blue-500/50',
      badge: 'Illustrative estimate',
    },
    {
      tag: 'RECORD REVIEW',
      title: 'Duplicate Pledge Review',
      desc: 'Review receipt numbers and document fingerprints across institutions to identify possible duplicate pledges.',
      image: '/photos/07_pledge_graph_radar.jpg',
      icon: GitMerge,
      accent: 'from-indigo-500/20 to-indigo-900/10',
      border: 'hover:border-indigo-500/50',
      badge: 'Duplicate review',
    },
    {
      tag: 'RELEASE WORKFLOW',
      title: 'Release Clearances',
      desc: 'Bring required clearances together so reviewers can assess a release request before a final decision.',
      image: '/photos/05_release_clearance_graph.jpg',
      icon: ShieldCheck,
      accent: 'from-emerald-500/20 to-emerald-900/10',
      border: 'hover:border-emerald-500/50',
      badge: 'Workflow preview',
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-10 max-w-[1376px] mx-auto relative z-10">
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
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="group relative rounded-2xl bg-white border border-[#E5DFD5] overflow-hidden p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#DDD6C9]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-[#444C3D] tracking-wider font-semibold">
                    {pillar.tag}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5DFD5] text-[#706E66]">
                    {pillar.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-[#444C3D] group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] tracking-tight group-hover:text-[#444C3D] transition-colors">
                    {pillar.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#55544E] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              {/* 3D Asset Preview inside card */}
              <div className="mt-6 rounded-xl overflow-hidden border border-[#E5DFD5] relative h-48 sm:h-56 bg-[#FAF8F5]">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-[#E5DFD5] text-[#1C1D1A] shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
