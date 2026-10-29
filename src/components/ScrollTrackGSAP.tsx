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

import { BotanicalBranch } from './BotanicalBranch';

function GuillocheCorner({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M2 30 V 10 C 2 5.58 5.58 2 10 2 H 30" stroke="#444C3D" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M5 30 V 12 C 5 8.13 8.13 5 12 5 H 30" stroke="#DDD6C9" strokeWidth="0.75" />
      <circle cx="12" cy="12" r="2.5" fill="#D4AF37" fillOpacity="0.35" stroke="#444C3D" strokeWidth="0.7" />
    </svg>
  );
}

function BotanicalWatermark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M10 90 C 20 60, 45 40, 90 10" stroke="#444C3D" strokeWidth="1.2" strokeOpacity="0.12" strokeLinecap="round" />
      <path d="M40 65 C 30 55, 20 60, 22 72 C 32 72, 38 68, 40 65 Z" fill="#444C3D" fillOpacity="0.08" stroke="#444C3D" strokeWidth="0.8" strokeOpacity="0.15" />
      <path d="M60 48 C 52 38, 42 42, 44 54 C 54 54, 58 50, 60 48 Z" fill="#444C3D" fillOpacity="0.08" stroke="#444C3D" strokeWidth="0.8" strokeOpacity="0.15" />
      <path d="M78 32 C 72 20, 62 24, 64 36 C 72 38, 76 34, 78 32 Z" fill="#444C3D" fillOpacity="0.08" stroke="#444C3D" strokeWidth="0.8" strokeOpacity="0.15" />
      <circle cx="34" cy="58" r="2" fill="#D4AF37" fillOpacity="0.2" />
      <circle cx="54" cy="42" r="2" fill="#D4AF37" fillOpacity="0.2" />
    </svg>
  );
}

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
      posStyle: { left: '56%', top: '5%' },
      dockSide: 'left',
      title: 'Add receipt details',
      subtitle: 'Planned intake step',
      desc: 'Enter the receipt details and attach supporting documents for review.',
      icon: Lock,
      step: '01',
      badge: 'Planned',
      accent: 'text-indigo-400',
      border: 'border-indigo-500/30',
      pill: 'Sample fingerprint only',
      paired: {
        posStyle: { left: '6%', top: '5%' },
        tag: 'STATUTORY MANDATE // REGULATION 1.4',
        title: 'Tripartite Security Deposit Pledge',
        quote: 'Every technical institution seeking approval must establish an irrevocable tripartite fixed deposit jointly with AICTE, ensuring institutional corpus custody before admissions commence.',
        citation: 'AICTE Act §10(1) · APH Regulation 1.4',
        seal: 'INVIOLABLE PLEDGE',
        sealSub: 'Corpus Secured',
        pill: 'Joint Lien Form 1A',
      },
    },
    {
      posStyle: { left: '6%', top: '21%' },
      dockSide: 'right',
      title: 'Estimate the deposit amount',
      subtitle: 'Simplified demo calculation',
      desc: 'Use programme, concession, and premises details to estimate the deposit amount. Confirm requirements against current official guidance.',
      icon: Scale,
      step: '02',
      badge: 'Example',
      accent: 'text-sky-400',
      border: 'border-sky-500/30',
      pill: 'Estimated amount',
      paired: {
        posStyle: { left: '56%', top: '21%' },
        tag: 'DETERMINISTIC SIZING // MULTIPLIER 2.0×',
        title: 'Table 1.4 Sizing Matrix',
        quote: 'Base deposit obligations scale strictly by programme capacity, doubled by a 2.0× multiplier for leased educational campuses, calibrated against statutory concessions.',
        citation: 'Table 1.4 Regulatory Schedule · Gazette 2026–27',
        seal: 'CALCULUS CERTIFIED',
        sealSub: 'Zero Ambiguity',
        pill: 'APH Multiplier Applied',
      },
    },
    {
      posStyle: { left: '56%', top: '37%' },
      dockSide: 'left',
      title: 'Compare receipt and bank details',
      subtitle: 'Planned verification step',
      desc: 'The intended check compares submitted details, receipt contents, and bank records. This demo uses fixed sample values instead.',
      icon: FileSearch,
      step: '03',
      badge: 'Sample only',
      accent: 'text-teal-400',
      border: 'border-teal-500/30',
      pill: 'Compare submitted, receipt, and bank details',
      paired: {
        posStyle: { left: '6%', top: '37%' },
        tag: 'DIRECT CORE BANKING // SFTP LEDGER',
        title: 'Two-Way Inter-Bank Validation',
        quote: 'Physical receipt declarations are reconciled field-by-field against Core Banking System SFTP records, eliminating counterfeit instruments and forged seals.',
        citation: 'RBI-AICTE Inter-Bank Clearing Protocol',
        seal: '99.4% OCR MATCH',
        sealSub: 'Bank CBS Confirmed',
        pill: 'Cryptographic Hash Match',
      },
    },
    {
      posStyle: { left: '6%', top: '53%' },
      dockSide: 'right',
      title: 'Track a deposit and its maturity',
      subtitle: 'Planned tracking step',
      desc: 'The intended service tracks deposit terms and renewal dates. Automatic reminders and duplicate-pledge monitoring are not running here.',
      icon: Clock,
      step: '04',
      badge: 'Planned',
      accent: 'text-amber-400',
      border: 'border-amber-500/30',
      pill: 'Tenor and lien status',
      paired: {
        posStyle: { left: '56%', top: '53%' },
        tag: 'SOVEREIGN TENURE // 10-YEAR LOCK-IN',
        title: '120-Month Custody Sentinel',
        quote: 'Deposits remain locked under sovereign lien for 120 continuous calendar months. Automated maturity sentinels prevent premature liquidation or unauthorized trust encashment.',
        citation: 'Clause 6.46 Custody Framework',
        seal: '120-MONTH TENURE',
        sealSub: 'CAG Audit Bound',
        pill: 'Active Sovereign Lien',
      },
    },
    {
      posStyle: { left: '56%', top: '69%' },
      dockSide: 'left',
      title: 'Review a release request',
      subtitle: 'Planned review step',
      desc: 'Gather required clearances before a reviewer makes a release decision.',
      icon: Shield,
      step: '05',
      badge: 'Preview',
      accent: 'text-purple-400',
      border: 'border-purple-500/30',
      pill: 'No clearance recorded',
      paired: {
        posStyle: { left: '6%', top: '69%' },
        tag: 'AUTONOMOUS CONSENSUS // 13-GATE DAG',
        title: '13-Gate Clearance Graph',
        quote: 'Release requests traverse an autonomous directed acyclic graph, verifying student grievances, vigilance investigations, and institutional liabilities before clearance.',
        citation: 'Autonomous Clearance DAG §8.2',
        seal: '13-GATE CLEARANCE',
        sealSub: 'Zero Disputes',
        pill: 'Concurrence Matrix Clear',
      },
    },
    {
      posStyle: { left: '6%', top: '85%' },
      dockSide: 'right',
      title: 'Record a release decision',
      subtitle: 'Planned final step',
      desc: 'Record the authorized release decision and prepare the related documents.',
      icon: CheckCircle2,
      step: '06',
      badge: 'Final review',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/30',
      pill: 'No release order created',
      paired: {
        posStyle: { left: '56%', top: '85%' },
        tag: 'FINAL SETTLEMENT // DIGITAL SANCTION',
        title: 'Digital Sanction Order & NOC',
        quote: 'Upon unanimous multi-role sign-off, an automated RTGS sanction order and cryptographically signed Digital NOC are transmitted to the depository bank.',
        citation: 'RPGF Release & Settlement Order §14',
        seal: 'DIGITAL NOC ISSUED',
        sealSub: 'SHA-256 Sealed',
        pill: 'RTGS Instruction Active',
      },
    },
  ];

  return (
    <section className="my-28 relative z-10">
      {/* Editorial Botanical Vine spanning whole left to right */}
      <div className="w-full overflow-hidden mb-6 opacity-85">
        <BotanicalBranch className="w-full text-[#444C3D]" />
      </div>

      {/* Editorial Section Header */}
      <div className="text-center max-w-2xl mx-auto px-6 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-semibold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D] animate-spin" style={{ animationDuration: '6s' }} />
          Planned process
        </div>
        
        <AnimatedHeading
          as="h2"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] mb-4"
        >
          The deposit *lifecycle*
        </AnimatedHeading>
        
        <p className="text-[#55544E] text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6">
          Explore the stages from entering receipt details to reviewing a release.
        </p>
        
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#444C3D] bg-[#EFEAE1] border border-[#DDD6C9] px-4 py-2 rounded-full">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          <span>Scroll to explore the six example stages</span>
        </div>
      </div>

      {/* GSAP Circuit Track with Paired Editorial Panels */}
      <div
        ref={trackRef}
        className="relative h-[280vh] max-w-[1540px] mx-auto px-4 sm:px-8 bg-[#F8F5EE]"
      >
        {/* Dynamic Circuit SVG Trace */}
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

        {/* Floating GSAP Beacon */}
        <div
          ref={beaconRef}
          className="absolute z-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#444C3D] border-2 border-amber-400/90 transition-colors duration-200 shadow-md"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <div className="absolute -top-6 font-mono text-[9px] text-[#F8F5EE] font-bold whitespace-nowrap bg-[#1C1D1A] px-2.5 py-0.5 rounded-full border border-amber-400/50 shadow-md tracking-wider">
            Digit token
          </div>
        </div>

        {/* Dual Paired Spread: Stage Card + Editorial Botanical Panel */}
        {stages.map((stg, idx) => {
          const Icon = stg.icon;
          const paired = stg.paired;

          return (
            <React.Fragment key={idx}>
              {/* Paired Editorial Botanical Panel (Fills the Opposite Side) */}
              <div
                style={paired.posStyle}
                className="hidden md:flex absolute w-[92%] sm:w-[420px] md:w-[460px] lg:w-[490px] z-10 flex-col justify-between rounded-2xl bg-[#FAF8F5]/90 backdrop-blur-sm border border-[#E5DFD5] p-6 sm:p-7 text-left shadow-xs transition-all duration-300 hover:border-[#DDD6C9] hover:bg-white overflow-hidden"
              >
                {/* Guilloche Corner Accents */}
                <GuillocheCorner className="absolute top-2 left-2 w-5 h-5 pointer-events-none opacity-60" />
                <GuillocheCorner className="absolute top-2 right-2 w-5 h-5 pointer-events-none opacity-60 rotate-90" />
                <GuillocheCorner className="absolute bottom-2 left-2 w-5 h-5 pointer-events-none opacity-60 -rotate-90" />
                <GuillocheCorner className="absolute bottom-2 right-2 w-5 h-5 pointer-events-none opacity-60 rotate-180" />

                {/* Subtle Botanical Watermark */}
                <BotanicalWatermark className="absolute -bottom-6 -right-6 w-32 h-32 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-[#444C3D] tracking-wider uppercase">
                      {paired.tag}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#E5DFD5] text-[#706E66]">
                      {paired.seal}
                    </span>
                  </div>

                  <h5 className="font-normal text-[#1C1D1A] font-['Instrument_Serif'] text-xl tracking-tight mb-2">
                    {paired.title}
                  </h5>

                  <blockquote className="text-xs sm:text-[13px] text-[#55544E] italic font-serif leading-relaxed pl-3 border-l-2 border-[#D4AF37]/50 my-3">
                    "{paired.quote}"
                  </blockquote>
                </div>

                <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-between text-[11px] font-mono mt-2">
                  <span className="text-[#8F8D84]">{paired.citation}</span>
                  <span className="text-[#1F6F50] font-semibold">{paired.sealSub}</span>
                </div>
              </div>

              {/* Active Interactive Stage Card */}
              <div
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
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}