import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Lock, FileSearch, Scale, Clock, CheckCircle2, Sparkles, ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ScrollTrackGSAP() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const beaconRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const trackEl = trackRef.current;
    const beacon = beaconRef.current;
    if (!trackEl || !beacon) return;

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    const cards = [
      trackEl.querySelector('#station-card-0'),
      trackEl.querySelector('#station-card-1'),
      trackEl.querySelector('#station-card-2'),
      trackEl.querySelector('#station-card-3'),
      trackEl.querySelector('#station-card-4'),
      trackEl.querySelector('#station-card-5'),
    ];

    // Center coordinates for each station along the track
    const waypoints = [
      { top: '7%', left: '72%' },
      { top: '23%', left: '24%' },
      { top: '39%', left: '72%' },
      { top: '55%', left: '24%' },
      { top: '71%', left: '72%' },
      { top: '87%', left: '24%' },
    ];

    // Initial state: Beacon starts at Station 1; Station 1 is active & enlarged
    gsap.set(beacon, {
      top: waypoints[0].top,
      left: waypoints[0].left,
      scale: 1,
      opacity: 1,
    });

    gsap.set(cards[0], {
      scale: 1.15,
      opacity: 1,
      borderColor: 'rgba(99, 102, 241, 0.95)',
      boxShadow: '0 0 45px rgba(99, 102, 241, 0.45)',
    });

    for (let i = 1; i < cards.length; i++) {
      gsap.set(cards[i], {
        scale: 0.94,
        opacity: 0.45,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        boxShadow: 'none',
      });
    }

    // Master Timeline: sequentially travels 1 -> 2 -> 3 -> 4 -> 5 -> 6
    // Each station becomes big when the ball arrives, and shrinks back as it departs
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trackEl,
        start: 'top 40%',
        end: 'bottom 85%',
        scrub: 1.0,
      },
    });

    // 1 -> 2
    tl.to(cards[0], { scale: 0.94, opacity: 0.45, borderColor: 'rgba(255,255,255,0.08)', boxShadow: 'none', duration: 0.5 }, 'leg1')
      .to(beacon, { top: waypoints[1].top, left: waypoints[1].left, duration: 2.0, ease: 'power1.inOut' }, 'leg1')
      .to(cards[1], { scale: 1.16, opacity: 1, borderColor: 'rgba(56, 189, 248, 0.95)', boxShadow: '0 0 45px rgba(56, 189, 248, 0.45)', duration: 0.8, ease: 'back.out(1.7)' })
      .to({}, { duration: 0.4 }); // dwell at 2

    // 2 -> 3
    tl.to(cards[1], { scale: 0.94, opacity: 0.45, borderColor: 'rgba(255,255,255,0.08)', boxShadow: 'none', duration: 0.5 }, 'leg2')
      .to(beacon, { top: waypoints[2].top, left: waypoints[2].left, duration: 2.0, ease: 'power1.inOut' }, 'leg2')
      .to(cards[2], { scale: 1.16, opacity: 1, borderColor: 'rgba(45, 212, 191, 0.95)', boxShadow: '0 0 45px rgba(45, 212, 191, 0.45)', duration: 0.8, ease: 'back.out(1.7)' })
      .to({}, { duration: 0.4 }); // dwell at 3

    // 3 -> 4
    tl.to(cards[2], { scale: 0.94, opacity: 0.45, borderColor: 'rgba(255,255,255,0.08)', boxShadow: 'none', duration: 0.5 }, 'leg3')
      .to(beacon, { top: waypoints[3].top, left: waypoints[3].left, duration: 2.0, ease: 'power1.inOut' }, 'leg3')
      .to(cards[3], { scale: 1.16, opacity: 1, borderColor: 'rgba(251, 191, 36, 0.95)', boxShadow: '0 0 45px rgba(251, 191, 36, 0.45)', duration: 0.8, ease: 'back.out(1.7)' })
      .to({}, { duration: 0.4 }); // dwell at 4

    // 4 -> 5
    tl.to(cards[3], { scale: 0.94, opacity: 0.45, borderColor: 'rgba(255,255,255,0.08)', boxShadow: 'none', duration: 0.5 }, 'leg4')
      .to(beacon, { top: waypoints[4].top, left: waypoints[4].left, duration: 2.0, ease: 'power1.inOut' }, 'leg4')
      .to(cards[4], { scale: 1.16, opacity: 1, borderColor: 'rgba(168, 85, 247, 0.95)', boxShadow: '0 0 45px rgba(168, 85, 247, 0.45)', duration: 0.8, ease: 'back.out(1.7)' })
      .to({}, { duration: 0.4 }); // dwell at 5

    // 5 -> 6
    tl.to(cards[4], { scale: 0.94, opacity: 0.45, borderColor: 'rgba(255,255,255,0.08)', boxShadow: 'none', duration: 0.5 }, 'leg5')
      .to(beacon, { top: waypoints[5].top, left: waypoints[5].left, duration: 2.0, ease: 'power1.inOut' }, 'leg5')
      .to(cards[5], { scale: 1.18, opacity: 1, borderColor: 'rgba(52, 211, 153, 0.95)', boxShadow: '0 0 55px rgba(52, 211, 153, 0.55)', duration: 0.8, ease: 'back.out(1.7)' });

    return () => {
      clearTimeout(timeout);
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === trackEl) t.kill();
      });
    };
  }, []);

  const stages = [
    {
      posStyle: { left: '55%', top: '3%' },
      title: 'Digital Intake & Cryptographic Sealing',
      subtitle: 'SHA-256 Digest Sealing',
      desc: 'Raw FDR & Affidavit intake with SHA-256 hash sealing, anti-tamper timestamping, and canonical statutory metadata registry.',
      icon: Lock,
      step: '01',
      badge: 'SEALED & TIMESTAMPED',
      accent: 'text-indigo-400',
      border: 'border-indigo-500/30',
      pill: 'SHA-256: 7f8a9e22...c41d',
    },
    {
      posStyle: { left: '8%', top: '19%' },
      title: 'Policy Engine Table 1.4 Calculation',
      subtitle: 'Deterministic APH Sizing',
      desc: 'Evaluates required statutory FDR under AICTE APH Table 1.4 norms. Deterministically computes base deposit + 50% concession + ×2.0 leased land multiplier.',
      icon: Scale,
      step: '02',
      badge: 'NORM CHECK PASS',
      accent: 'text-sky-400',
      border: 'border-sky-500/30',
      pill: 'Requirement: ₹20.00 Lakhs verified',
    },
    {
      posStyle: { left: '55%', top: '35%' },
      title: '3-Way Zero-Hallucination Provenance',
      subtitle: 'Triangulated OCR & Bank Verification',
      desc: 'Field-level 3-way match: Institution declared values vs OCR document parsing vs Automated core banking sandbox API response.',
      icon: FileSearch,
      step: '03',
      badge: '3-WAY MATCH 100%',
      accent: 'text-teal-400',
      border: 'border-teal-500/30',
      pill: 'Provenance Delta: 0.00% (Verified)',
    },
    {
      posStyle: { left: '8%', top: '51%' },
      title: '10-Year Custody & Lien Lineage Radar',
      subtitle: 'Continuous Cross-Trust Auditing',
      desc: 'Enforces statutory 10-year lock-in period with automated renewal tracking and cross-trust duplicate pledge detection across all scheduled banks.',
      icon: Clock,
      step: '04',
      badge: 'CUSTODY ACTIVE',
      accent: 'text-amber-400',
      border: 'border-amber-500/30',
      pill: 'Maturity: 10 Years · Lien Active',
    },
    {
      posStyle: { left: '55%', top: '67%' },
      title: 'Clause 6.46 DAG Release Clearances',
      subtitle: 'Multi-Bureau Statutory Gate',
      desc: 'Release request enters a strict Directed Acyclic Graph. Enforces mandatory clearances from PGRC Student Desk, Vigilance Bureau, and Regional Officer.',
      icon: Shield,
      step: '05',
      badge: '3/3 GATES CLEARED',
      accent: 'text-purple-400',
      border: 'border-purple-500/30',
      pill: 'CVO Clear · PGRC Clear · RO Signed',
    },
    {
      posStyle: { left: '8%', top: '83%' },
      title: 'Cryptographic Release Sanction & NOC',
      subtitle: 'Immutable Ledger Finalization',
      desc: 'Issues a dual-signed cryptographic NOC, transmits automated bank sanction release notice, and commits the finalized block into the immutable audit chain.',
      icon: CheckCircle2,
      step: '06',
      badge: 'RELEASE SANCTIONED',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/30',
      pill: 'Block #10492 · Dual-Signed NOC Dispatched',
    },
  ];

  return (
    <section className="my-32 relative z-10">
      {/* 1. Dedicated Header in Normal Flow (Completely Separated from Stage 01 to Guarantee Zero Overlap) */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-[#060812]/95 text-teal-300 text-xs font-mono font-semibold mb-4 backdrop-blur-xl shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
          Out of Thin Air — Autonomous Compliance Pipeline
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg mb-4">
          The 6-Station Autonomous Circuit
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-6">
          Scroll down to guide the live compliance ledger token through each checkpoint. Watch each station dynamically expand as the token arrives.
        </p>
        <div className="inline-flex items-center gap-2 text-xs font-mono text-teal-400 bg-teal-950/40 border border-teal-500/30 px-3.5 py-1.5 rounded-full">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          <span>Scroll down to navigate the pipeline</span>
        </div>
      </div>

      {/* 2. The 400vh Track Container with the 6 Stations and the Animated Ball */}
      <div
        ref={trackRef}
        className="relative h-[400vh] overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(122,133,255,0.03) 0%, transparent 80%)',
        }}
      >
        {/* SVG Connecting Track Curve Passing through Centers of All 6 Stations */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-40"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="20%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#2dd4bf" />
              <stop offset="60%" stopColor="#fbbf24" />
              <stop offset="80%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <path
            d="M 72 7 Q 48 15, 24 23 Q 48 31, 72 39 Q 48 47, 24 55 Q 48 63, 72 71 Q 48 79, 24 87"
            fill="none"
            stroke="url(#circuitGrad)"
            strokeWidth="0.4"
            strokeDasharray="1.4 0.8"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* The Animated Travelling Ball / Compliance Ledger Token */}
        <div
          ref={beaconRef}
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#7a85ff] via-[#38bdf8] to-teal-400 shadow-[0_0_35px_rgba(122,133,255,0.9)]"
        >
          <div className="w-5 h-5 rounded-full bg-white shadow-inner animate-pulse" />
          <div className="absolute -bottom-7 font-mono text-[10px] text-teal-200 font-extrabold whitespace-nowrap bg-black/90 px-2.5 py-0.5 rounded-full border border-teal-400/50 shadow-md">
            LEDGER TOKEN
          </div>
        </div>

        {/* The 6 Statutory Stations — Larger, Roomier & Alternating Left/Right */}
        {stages.map((stg, idx) => {
          const Icon = stg.icon;
          return (
            <div
              key={idx}
              style={stg.posStyle}
              className="absolute w-[92%] sm:w-[420px] md:w-[460px] lg:w-[490px] z-20"
            >
              <div
                id={`station-card-${idx}`}
                className={`w-full rounded-2xl bg-[#0c1322]/95 border ${stg.border} p-6 sm:p-7 flex flex-col justify-between text-left cursor-default backdrop-blur-xl shadow-2xl transition-all duration-300`}
              >
                {/* Header row: Stage number & status badge */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${stg.accent} font-black tracking-wider`}>
                      STAGE {stg.step}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      Statutory Checkpoint
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/10 text-white font-bold border border-white/15">
                    {stg.badge}
                  </span>
                </div>

                {/* Title & Icon */}
                <div className="mb-3.5">
                  <div className="flex items-center gap-3.5 mb-1.5">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                      <Icon className={`w-5 h-5 ${stg.accent}`} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base sm:text-lg tracking-tight leading-snug">
                        {stg.title}
                      </h4>
                      <span className={`text-[11px] ${stg.accent} font-mono font-semibold block mt-0.5`}>
                        {stg.subtitle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-normal">
                  {stg.desc}
                </p>

                {/* Bottom statutory audit pill */}
                <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Ledger Artifact:</span>
                  <span className={`${stg.accent} font-bold`}>{stg.pill}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
