import React from 'react';
import { ShieldCheck, Scale, Layers, GitMerge, FileSearch, Lock, ArrowUpRight } from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading';

export function FeaturesBento() {
  const pillars = [
    {
      tag: 'PILLAR 01 · INTEGRITY',
      title: 'Three-Way Provenance',
      desc: 'Reconciles institution declarations, high-resolution document OCR with bounding-box coordinate tracking, and bank sandbox confirmation field-by-field.',
      image: '/photos/09_provenance_scanner_3d.jpg',
      icon: FileSearch,
      accent: 'from-teal-500/20 to-teal-900/10',
      border: 'hover:border-teal-500/50',
      badge: 'Zero Hallucinations',
    },
    {
      tag: 'PILLAR 02 · ACCURACY',
      title: 'Deterministic Policy Engine',
      desc: 'Calculates statutory security deposits directly against AICTE APH 2024–27 Table 1.4, integrating 2026–27 50% regional concessions and 2.0× leased land multipliers.',
      image: '/photos/02_fdr_certificate_3d.jpg',
      icon: Scale,
      accent: 'from-blue-500/20 to-blue-900/10',
      border: 'hover:border-blue-500/50',
      badge: 'Table 1.4 Native',
    },
    {
      tag: 'PILLAR 03 · FRAUD SHIELD',
      title: 'Continuous Pledge Radar',
      desc: 'Detects cross-institution duplicate pledging in real-time. Prevents multiple colleges under the same trust from recycling identical FDR certificates or receipt hashes.',
      image: '/photos/07_pledge_graph_radar.jpg',
      icon: GitMerge,
      accent: 'from-indigo-500/20 to-indigo-900/10',
      border: 'hover:border-indigo-500/50',
      badge: 'Anti-Collusion',
    },
    {
      tag: 'PILLAR 04 · COMPLIANCE',
      title: 'Clause 6.46 Release DAG',
      desc: 'Enforces statutory clearance checks across PGRC student complaints, Vigilance probes, Grants cell dues, and 10-year holding terms with atomic HTTP 422 locks.',
      image: '/photos/05_release_clearance_graph.jpg',
      icon: ShieldCheck,
      accent: 'from-emerald-500/20 to-emerald-900/10',
      border: 'hover:border-emerald-500/50',
      badge: 'Maker-Checker Segregated',
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-10 max-w-[1376px] mx-auto relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-mono font-medium mb-4">
          Regulatory Architecture
        </div>
        <AnimatedHeading
          as="h2"
          className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight"
        >
          The 4 Pillars That Defend Every Security Deposit
        </AnimatedHeading>
        <p className="text-slate-400 text-sm md:text-base mt-4">
          Most systems merely upload PDFs to storage buckets. SURAKSHA builds the verifiable compliance engine that defends every release against CAG and vigilance scrutiny.
        </p>
      </div>

      {/* Bento Grid (2x2 with rich Framer Cards & 3D Assets) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className={`group relative rounded-2xl bg-[#111a2b]/90 border border-white/10 overflow-hidden p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${pillar.border} hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/10`}
            >
              {/* Radial gradient backing */}
              <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${pillar.accent} blur-3xl pointer-events-none rounded-full opacity-60`} />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-teal-400 tracking-wider font-semibold">
                    {pillar.tag}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {pillar.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-[#172338] border border-white/10 text-teal-300 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-teal-300 transition-colors">
                    {pillar.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              {/* 3D Asset Preview inside card */}
              <div className="mt-6 rounded-xl overflow-hidden border border-white/10 relative h-48 sm:h-56 bg-[#0b1220]">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111a2b] via-transparent to-transparent" />
                <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-[#0b1220]/80 backdrop-blur-md border border-white/10 text-white">
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
