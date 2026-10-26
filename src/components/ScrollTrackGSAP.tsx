import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Lock, FileSearch, Scale, Clock, CheckCircle2, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ScrollTrackGSAP() {
  const mainRef = useRef<HTMLElement | null>(null);
  const beaconRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    const boxes = mainEl.querySelectorAll('.track-box');
    const containers = mainEl.querySelectorAll('.track-container');

    // Individual station animations as user scrolls past each one
    boxes.forEach((box, i) => {
      gsap.fromTo(
        box,
        {
          opacity: 0.35,
          scale: 0.85,
          y: 30,
          rotation: i % 2 === 0 ? -8 : 8,
        },
        {
          opacity: 1,
          scale: 1.05,
          y: 0,
          rotation: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containers[i],
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1,
          },
        }
      );
    });

    // Traveling Compliance Beacon along the 300vh section
    if (beaconRef.current) {
      gsap.fromTo(
        beaconRef.current,
        { top: '9%', left: '86%', scale: 0.8, opacity: 0.7 },
        {
          top: '94%',
          left: '18%',
          scale: 1.25,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: mainEl,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
          },
        }
      );
    }

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === mainEl || (t.vars.trigger && (t.vars.trigger as Element).classList?.contains('track-container'))) {
          t.kill();
        }
      });
    };
  }, []);

  const stages = [
    {
      posStyle: { right: '6%', top: '9%' },
      title: 'Digital Intake',
      subtitle: 'SHA-256 Digest',
      desc: 'Raw FDR & Affidavit intake with cryptographic sealing and anti-tamper timestamping.',
      icon: Lock,
      step: '01',
      badge: 'SEALED',
      accent: 'text-indigo-400',
      border: 'border-indigo-500/40',
      glow: 'shadow-[0_0_25px_rgba(99,102,241,0.25)]',
    },
    {
      posStyle: { left: '12%', top: '23%' },
      title: 'Policy Engine',
      subtitle: 'Table 1.4 Native',
      desc: 'Deterministic rules: Base norms + 50% concession + ×2.0 leased land multiplier.',
      icon: Scale,
      step: '02',
      badge: 'NORM CHECK',
      accent: 'text-sky-400',
      border: 'border-sky-500/40',
      glow: 'shadow-[0_0_25px_rgba(56,189,248,0.25)]',
    },
    {
      posStyle: { right: '12%', top: '41%' },
      title: '3-Way Provenance',
      subtitle: 'Zero Hallucinations',
      desc: 'Triangulated match: Declared values vs Document OCR vs Bank Sandbox API.',
      icon: FileSearch,
      step: '03',
      badge: 'TRIANGULATED',
      accent: 'text-teal-400',
      border: 'border-teal-500/40',
      glow: 'shadow-[0_0_25px_rgba(45,212,191,0.25)]',
    },
    {
      posStyle: { left: '16%', top: '59%' },
      title: '10-Yr Custody',
      subtitle: 'Lineage Radar',
      desc: 'Continuous lien tracking, renewal monitoring, and cross-trust duplicate pledge detection.',
      icon: Clock,
      step: '04',
      badge: 'MONITORED',
      accent: 'text-amber-400',
      border: 'border-amber-500/40',
      glow: 'shadow-[0_0_25px_rgba(251,191,36,0.25)]',
    },
    {
      posStyle: { left: '62%', top: '77%' },
      title: 'Clause 6.46 DAG',
      subtitle: 'Clearance Gating',
      desc: 'Direct acyclic graph: Student desk, Vigilance Bureau, and Regional Officer signatures.',
      icon: Shield,
      step: '05',
      badge: 'GATED DAG',
      accent: 'text-purple-400',
      border: 'border-purple-500/40',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.25)]',
    },
    {
      posStyle: { left: '18%', top: '94%' },
      title: 'Release Sanction',
      subtitle: 'Hash-Chained Audit',
      desc: 'Cryptographic NOC issue, automatic banker notification, and append-only audit trail.',
      icon: CheckCircle2,
      step: '06',
      badge: 'AUDITED NOC',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/40',
      glow: 'shadow-[0_0_25px_rgba(52,211,153,0.25)]',
    },
  ];

  return (
    <section
      ref={mainRef}
      className="main relative h-[320vh] my-32 overflow-hidden z-10"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(122,133,255,0.03) 0%, transparent 80%)',
      }}
    >
      {/* Sticky Header Track Label */}
      <div className="sticky top-28 z-30 text-center max-w-2xl mx-auto px-6 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-[#060812]/90 text-teal-300 text-xs font-mono font-semibold mb-3 backdrop-blur-xl shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
          Out of Thin Air — Autonomous Compliance Pipeline
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
          The 6-Station Autonomous Circuit
        </h2>
        <p className="text-slate-300 text-xs md:text-sm mt-3 leading-relaxed max-w-lg mx-auto">
          Scroll down to scrub the live compliance ledger token traveling across all 6 statutory checkpoints.
        </p>
      </div>

      {/* SVG Connecting Circuit Track */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="trackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="25%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2dd4bf" />
            <stop offset="75%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          d="M 68% 6% Q 30% 14% 20% 23% T 82% 41% T 26% 59% T 70% 77% T 26% 94%"
          fill="none"
          stroke="url(#trackGrad)"
          strokeWidth="2.5"
          strokeDasharray="8 8"
        />
      </svg>

      {/* Traveling Compliance Beacon */}
      <div
        ref={beaconRef}
        className="absolute z-25 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#7a85ff] to-teal-400 shadow-[0_0_30px_rgba(122,133,255,0.8)]"
        style={{ left: '60%', top: '6%' }}
      >
        <div className="w-4 h-4 rounded-full bg-white animate-ping" />
        <div className="absolute -bottom-6 font-mono text-[9px] text-teal-300 font-bold whitespace-nowrap bg-black/80 px-2 py-0.5 rounded border border-teal-500/40">
          LEDGER TOKEN
        </div>
      </div>

      {/* Dashed Marker Stations & Animated Boxes (Exact CodePen Layout) */}
      {stages.map((stg, idx) => {
        const Icon = stg.icon;
        return (
          <div
            key={idx}
            style={stg.posStyle}
            className={`track-container absolute w-[190px] h-[190px] sm:w-[240px] sm:h-[240px] border-2 border-dashed border-white/15 rounded-3xl flex flex-col items-center justify-center p-3 transition-colors hover:border-white/35 backdrop-blur-sm bg-black/25 z-20`}
          >
            {/* Animated Station Box */}
            <div
              className={`track-box w-[165px] h-[165px] sm:w-[210px] sm:h-[210px] rounded-2xl bg-[#0d1424]/90 border ${stg.border} ${stg.glow} p-4 flex flex-col justify-between text-left cursor-default backdrop-blur-md transition-all hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono ${stg.accent} font-extrabold tracking-wider`}>
                  STAGE {stg.step}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-medium border border-white/15">
                  {stg.badge}
                </span>
              </div>

              <div className="my-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${stg.accent}`} />
                  <h4 className="font-extrabold text-white text-xs sm:text-sm tracking-tight leading-tight">
                    {stg.title}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {stg.subtitle}
                </span>
              </div>

              <p className="text-[10px] text-slate-300 line-clamp-3 leading-relaxed">
                {stg.desc}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
