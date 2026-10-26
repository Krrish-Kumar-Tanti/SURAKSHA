import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Shield, Sparkles, X } from 'lucide-react';

interface HeroIntroSplashProps {
  onComplete: () => void;
}

export function HeroIntroSplash({ onComplete }: HeroIntroSplashProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shackleRef = useRef<SVGPathElement>(null);
  const lockBodyRef = useRef<SVGGElement>(null);
  const lockGroupRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef<HTMLDivElement>(null);
  const logoGroupRef = useRef<HTMLDivElement>(null);
  const goldenFlashRef = useRef<HTMLDivElement>(null);

  const [skipped, setSkipped] = useState(false);

  const handleSkip = () => {
    if (skipped) return;
    setSkipped(true);
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete,
      });
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete,
        });
      },
    });

    // 0.0s - Initial Setup
    gsap.set(shackleRef.current, { y: -24 }); // Unlocked (shackle lifted up)
    gsap.set(keyRef.current, { x: 120, opacity: 0, rotate: -45 });
    gsap.set(logoGroupRef.current, { scale: 0.8, opacity: 0 });
    gsap.set(lockGroupRef.current, { x: 0, scale: 0.9, opacity: 0 });
    gsap.set(goldenFlashRef.current, { opacity: 0, scale: 0.5 });

    // 0.1s - 0.8s: Lock smoothly appears in center
    tl.to(lockGroupRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: 'back.out(1.4)',
    })

    // 0.8s - 1.6s: Golden Key glides in towards keyhole
    .to(
      keyRef.current,
      {
        opacity: 1,
        x: 0,
        rotate: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.2'
    )

    // 1.6s - 2.1s: Key turns to lock
    .to(
      keyRef.current,
      {
        rotate: 90,
        duration: 0.45,
        ease: 'power1.inOut',
      }
    )

    // 2.1s - 2.4s: Shackle snaps shut with a crisp click & golden shockwave!
    .to(
      shackleRef.current,
      {
        y: 0,
        duration: 0.22,
        ease: 'bounce.out',
      },
      '+=0.05'
    )
    .to(
      goldenFlashRef.current,
      {
        opacity: 1,
        scale: 1.6,
        duration: 0.2,
        ease: 'power1.out',
      },
      '<'
    )
    .to(
      goldenFlashRef.current,
      {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
      }
    )

    // 2.5s - 3.5s: Locked lock moves LEFT, Key fades RIGHT, Logo reveals in the CENTER
    .to(
      lockGroupRef.current,
      {
        x: -160,
        scale: 0.85,
        duration: 0.9,
        ease: 'power2.inOut',
      },
      '+=0.2'
    )
    .to(
      keyRef.current,
      {
        x: 160,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      '<'
    )
    .to(
      logoGroupRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 0.85,
        ease: 'back.out(1.6)',
      },
      '-=0.6'
    )

    // 3.5s - 4.4s: Hold state so user can appreciate the branded lock transition
    .to({}, { duration: 0.9 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#F8F5EE] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Background subtle noise and warm linen vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#ECE7DE]/50 to-[#DDD6C9]/40 pointer-events-none" />

      {/* Top Bar with Skip Button */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <button
          onClick={handleSkip}
          className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFEAE1] hover:bg-[#E3DDCF] border border-[#DDD6C9] text-[#444C3D] text-xs font-mono font-medium transition cursor-pointer shadow-sm"
        >
          <span>Skip</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>

      {/* Golden Shockwave Pulse on Lock */}
      <div
        ref={goldenFlashRef}
        className="absolute w-64 h-64 rounded-full pointer-events-none bg-radial from-[#FBBF24]/50 via-[#F59E0B]/20 to-transparent blur-xl"
      />

      {/* Central Animation Stage */}
      <div className="relative w-full max-w-[680px] h-[320px] flex items-center justify-center">
        
        {/* 1. The Brass Padlock */}
        <div ref={lockGroupRef} className="absolute flex flex-col items-center justify-center">
          <svg
            className="w-28 h-36 drop-shadow-[0_15px_30px_rgba(245,158,11,0.25)]"
            viewBox="0 0 120 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Shackle (Silver Steel Curved Bar with stroke) */}
            <path
              ref={shackleRef}
              d="M 35 70 V 42 C 35 26 85 26 85 42 V 70"
              stroke="url(#shackleGradient)"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Lock Body (Warm Golden / Brass Rounded Rectangle) */}
            <g ref={lockBodyRef}>
              <rect
                x="15"
                y="65"
                width="90"
                height="75"
                rx="16"
                fill="url(#brassBodyGradient)"
                stroke="#D97706"
                strokeWidth="2.5"
              />
              {/* Beveled highlight on body */}
              <rect
                x="20"
                y="70"
                width="80"
                height="65"
                rx="12"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Keyhole Outer Ring */}
              <circle cx="60" cy="102" r="14" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
              {/* Keyhole Slot */}
              <path
                d="M 60 96 C 57.5 96 56 98 56 100 C 56 101.5 57 103 58 104 L 56.5 111 C 56.5 112 57.5 113 60 113 C 62.5 113 63.5 112 63.5 111 L 62 104 C 63 103 64 101.5 64 100 C 64 98 62.5 96 60 96 Z"
                fill="#1C1D1A"
              />
            </g>

            {/* SVG Gradients for high-fidelity golden appearance */}
            <defs>
              <linearGradient id="shackleGradient" x1="30" y1="20" x2="90" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="40%" stopColor="#94A3B8" />
                <stop offset="70%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>

              <linearGradient id="brassBodyGradient" x1="15" y1="65" x2="105" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="25%" stopColor="#F59E0B" />
                <stop offset="65%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 2. The Golden Key */}
        <div
          ref={keyRef}
          className="absolute flex items-center justify-center pointer-events-none drop-shadow-[0_8px_20px_rgba(217,119,6,0.35)]"
        >
          <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
            <path
              d="M 28 50 C 28 42 34 36 42 36 C 50 36 56 42 56 50 C 56 58 50 64 42 64 C 34 64 28 58 28 50 Z"
              fill="url(#keyGrad)"
              stroke="#B45309"
              strokeWidth="2"
            />
            <circle cx="42" cy="50" r="6" fill="#1C1D1A" />
            <path
              d="M 54 50 L 82 50 L 82 57 L 76 57 L 76 50 L 70 50 L 70 55 L 65 55 L 65 50"
              fill="url(#keyGrad)"
              stroke="#B45309"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="keyGrad" x1="28" y1="36" x2="82" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 3. The Central Brand Logo Reveal (Dark Olive Badge + Instrument Serif) */}
        <div
          ref={logoGroupRef}
          className="absolute z-20 flex items-center gap-3.5 bg-white/80 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-[#DDD6C9] shadow-[0_15px_35px_rgba(68,76,61,0.12)]"
        >
          {/* Circular Olive Badge */}
          <div className="w-12 h-12 rounded-full bg-[#444C3D] flex items-center justify-center text-white shadow-md">
            <Shield className="w-6 h-6 text-[#F8F5EE]" />
          </div>

          {/* Brand Typography */}
          <div className="text-left">
            <div className="font-['Instrument_Serif'] text-3xl font-normal tracking-tight text-[#1C1D1A] leading-none">
              SURAKSHA
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[#706E66] uppercase mt-1">
              AICTE Security Deposit Control Tower
            </div>
          </div>
        </div>

      </div>

      {/* Subtitle Message at Bottom */}
      <div className="absolute bottom-10 text-center font-mono text-xs text-[#706E66]">
        <span>Pledged to AICTE</span>
        <span className="mx-2">•</span>
        <span>APH 2024–27</span>
        <span className="mx-2">•</span>
        <span>SIH26265</span>
      </div>
    </div>
  );
}
