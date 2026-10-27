import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Lock, FileSearch, Scale, Clock, CheckCircle2, Sparkles, ArrowDown } from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading';

gsap.registerPlugin(ScrollTrigger);

const GOLDEN_GLOW = '0 0 35px rgba(251, 191, 36, 0.45), 0 0 15px rgba(245, 158, 11, 0.25)';
const TOKEN_GOLDEN_GLOW = '0 0 25px rgba(251, 191, 36, 0.95), 0 0 45px rgba(245, 158, 11, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)';
const TOKEN_DEFAULT_SHADOW = '0 0 12px rgba(68, 76, 61, 0.5)';
const GOLDEN_BORDER = 'rgba(251, 191, 36, 0.95)';
const INACTIVE_CARD_BORDER = 'rgba(229, 223, 213, 0.7)';

export function ScrollTrackGSAP() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const beaconRef = useRef<HTMLDivElement | null>(null);
  const [svgPath, setSvgPath] = useState(
    'M 58 6 Q 48 14, 37 22 Q 48 30, 58 38 Q 48 46, 37 54 Q 48 62, 58 70 Q 48 78, 37 86'
  );

  useEffect(() => {
    const trackEl = trackRef.current;
    const beacon = beaconRef.current;
    if (!trackEl || !beacon) return;

    let tl: gsap.core.Timeline | null = null;

    const buildTimeline = () => {
      const trackRect = trackEl.getBoundingClientRect();
      const cards = [
        trackEl.querySelector('#station-card-0'),
        trackEl.querySelector('#station-card-1'),
        trackEl.querySelector('#station-card-2'),
        trackEl.querySelector('#station-card-3'),
        trackEl.querySelector('#station-card-4'),
        trackEl.querySelector('#station-card-5'),
      ];

      // Measure exact corner dock coordinates from the DOM
      const waypoints = [0, 1, 2, 3, 4, 5].map((i) => {
        const dock = trackEl.querySelector(`#dock-node-${i}`);
        if (dock) {
          const rect = dock.getBoundingClientRect();
          const topPct = ((rect.top - trackRect.top + rect.height / 2) / trackRect.height) * 100;
          const leftPct = ((rect.left - trackRect.left + rect.width / 2) / trackRect.width) * 100;
          return { top: `${topPct}%`, left: `${leftPct}%`, x: leftPct, y: topPct };
        }
        return i % 2 === 0
          ? { top: `${6 + i * 16}%`, left: '58%', x: 58, y: 6 + i * 16 }
          : { top: `${6 + i * 16}%`, left: '37%', x: 37, y: 6 + i * 16 };
      });

      // Update SVG path to trace through every corner dock without distortion
      const pathD =
        `M ${waypoints[0].x} ${waypoints[0].y} ` +
        `Q 48 ${(waypoints[0].y + waypoints[1].y) / 2}, ${waypoints[1].x} ${waypoints[1].y} ` +
        `Q 48 ${(waypoints[1].y + waypoints[2].y) / 2}, ${waypoints[2].x} ${waypoints[2].y} ` +
        `Q 48 ${(waypoints[2].y + waypoints[3].y) / 2}, ${waypoints[3].x} ${waypoints[3].y} ` +
        `Q 48 ${(waypoints[3].y + waypoints[4].y) / 2}, ${waypoints[4].x} ${waypoints[4].y} ` +
        `Q 48 ${(waypoints[4].y + waypoints[5].y) / 2}, ${waypoints[5].x} ${waypoints[5].y}`;
      setSvgPath(pathD);

      gsap.set(beacon, {
        top: waypoints[0].top,
        left: waypoints[0].left,
        scale: 1,
        opacity: 1,
        boxShadow: TOKEN_GOLDEN_GLOW,
        borderColor: GOLDEN_BORDER,
      });

      gsap.set(cards[0], {
        scale: 1.08,
        opacity: 1,
        borderColor: GOLDEN_BORDER,
        boxShadow: GOLDEN_GLOW,
      });

      for (let i = 1; i < cards.length; i++) {
        if (cards[i]) {
          gsap.set(cards[i], {
            scale: 0.96,
            opacity: 0.45,
            borderColor: INACTIVE_CARD_BORDER,
            boxShadow: 'none',
          });
        }
      }

      if (tl) tl.kill();

      // GSAP ScrollTrigger timeline with scrub smooth delay
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackEl,
          start: 'top 30%',
          end: 'bottom 85%',
          scrub: 1.2,
        },
      });

      for (let i = 0; i < 5; i++) {
        const fromCard = cards[i];
        const toCard = cards[i + 1];
        const nextPoint = waypoints[i + 1];
        const toDock = trackEl.querySelector(`#dock-node-${i + 1}`);

        tl.to(
          fromCard,
          {
            scale: 0.96,
            opacity: 0.45,
            borderColor: INACTIVE_CARD_BORDER,
            boxShadow: 'none',
            duration: 0.5,
          },
          `leg_${i}`
        )
          .to(
            beacon,
            {
              boxShadow: TOKEN_DEFAULT_SHADOW,
              borderColor: 'transparent',
              duration: 0.35,
              ease: 'power1.out',
            },
            `leg_${i}`
          )
          .to(
            beacon,
            {
              top: nextPoint.top,
              left: nextPoint.left,
              duration: 2.2,
              ease: 'power1.inOut',
            },
            `leg_${i}`
          )
          .to(
            toCard,
            {
              scale: 1.08,
              opacity: 1,
              borderColor: GOLDEN_BORDER,
              boxShadow: GOLDEN_GLOW,
              duration: 0.7,
              ease: 'back.out(1.5)',
            },
            `leg_${i}+=1.85`
          )
          .to(
            beacon,
            {
              boxShadow: TOKEN_GOLDEN_GLOW,
              borderColor: GOLDEN_BORDER,
              duration: 0.4,
              ease: 'back.out(1.5)',
            },
            `leg_${i}+=1.85`
          )
          .fromTo(
            toDock,
            { scale: 1 },
            { scale: 1.35, duration: 0.35, yoyo: true, repeat: 1 },
            `leg_${i}+=1.85`
          )
          .to({}, { duration: 0.6 });
      }
    };

    const timer = setTimeout(() => {
      buildTimeline();
      ScrollTrigger.refresh();
    }, 300);

    const onResize = () => {
      buildTimeline();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      if (tl) tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === trackEl) t.kill();
      });
    };
  }, []);

  const stages = [
    {
      posStyle: { left: '56%', top: '6%' },
      dockSide: 'left',
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
      posStyle: { left: '6%', top: '22%' },
      dockSide: 'right',
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
      posStyle: { left: '56%', top: '38%' },
      dockSide: 'left',
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
      posStyle: { left: '6%', top: '54%' },
      dockSide: 'right',
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
      posStyle: { left: '56%', top: '70%' },
      dockSide: 'left',
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
      posStyle: { left: '6%', top: '86%' },
      dockSide: 'right',
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
    <section className="my-36 relative z-10">
      <div className="text-center max-w-2xl mx-auto px-6 mb-40">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-semibold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D] animate-spin" style={{ animationDuration: '6s' }} />
          Out of Thin Air — Autonomous Compliance Pipeline
        </div>
        <AnimatedHeading
          as="h2"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] mb-4"
        >
          The 6-Station Autonomous *Circuit*
        </AnimatedHeading>
        <p className="text-[#55544E] text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6">
          Scroll down to guide the live compliance ledger token through each checkpoint. Watch each station dynamically expand as the token docks at its corner.
        </p>
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#444C3D] bg-[#EFEAE1] border border-[#DDD6C9] px-4 py-2 rounded-full">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          <span>Scroll down to navigate through the 6 statutory stations</span>
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative h-[380vh] max-w-[1540px] mx-auto px-4 sm:px-8 bg-[#F8F5EE]"
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-50"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#444C3D" />
              <stop offset="30%" stopColor="#6E7A65" />
              <stop offset="60%" stopColor="#8F9C84" />
              <stop offset="100%" stopColor="#444C3D" />
            </linearGradient>
          </defs>
          <path
            d={svgPath}
            fill="none"
            stroke="url(#circuitGrad)"
            strokeWidth="0.5"
            strokeDasharray="1.6 0.9"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div
          ref={beaconRef}
          className="absolute z-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#444C3D] border-2 border-amber-400/90 transition-colors duration-200 shadow-md"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <div className="absolute -top-6 font-mono text-[9px] text-[#F8F5EE] font-bold whitespace-nowrap bg-[#1C1D1A] px-2.5 py-0.5 rounded-full border border-amber-400/50 shadow-md tracking-wider">
            Digit token
          </div>
        </div>

        {stages.map((stg, idx) => {
          const Icon = stg.icon;
          return (
            <div
              key={idx}
              style={stg.posStyle}
              className="absolute w-[92%] sm:w-[420px] md:w-[460px] lg:w-[490px] z-20"
            >
              <div
                id={`dock-node-${idx}`}
                className={`absolute -top-3.5 ${
                  stg.dockSide === 'left' ? '-left-3.5' : '-right-3.5'
                } w-7 h-7 rounded-full border border-[#444C3D] bg-white flex items-center justify-center z-30 shadow-md pointer-events-none transition-transform`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#444C3D]" />
              </div>

              <div
                id={`station-card-${idx}`}
                className="w-full rounded-2xl bg-white border border-[#E5DFD5] p-6 sm:p-7 flex flex-col justify-between text-left cursor-default shadow-sm transition-transform duration-300"
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#444C3D] font-bold tracking-wider">
                      STAGE {stg.step}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DDD6C9]" />
                    <span className="text-[11px] font-mono text-[#706E66] uppercase tracking-wider">
                      Statutory Checkpoint
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#55544E] font-medium border border-[#E5DFD5]">
                    {stg.badge}
                  </span>
                </div>

                <div className="mb-3.5">
                  <div className="flex items-center gap-3.5 mb-1.5">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] shrink-0 text-[#444C3D]">
                      <Icon className="w-5 h-5 text-[#444C3D]" />
                    </div>
                    <div>
                      <h4 className="font-normal text-[#1C1D1A] font-['Instrument_Serif'] text-2xl tracking-tight leading-snug">
                        {stg.title}
                      </h4>
                      <span className="text-[11px] text-[#706E66] font-mono font-medium block mt-0.5">
                        {stg.subtitle}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#55544E] leading-relaxed mb-5 font-normal">
                  {stg.desc}
                </p>

                <div className="pt-3.5 border-t border-[#E5DFD5] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#706E66]">Ledger Artifact:</span>
                  <span className="text-[#444C3D] font-bold">{stg.pill}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}