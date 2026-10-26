import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';

interface HeroIntroSplashProps {
  onComplete: () => void;
}

export function HeroIntroSplash({ onComplete }: HeroIntroSplashProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoOverlayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [skipped, setSkipped] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleSkip = () => {
    if (skipped) return;
    setSkipped(true);
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.45,
        ease: 'power2.out',
        onComplete,
      });
    } else {
      onComplete();
    }
  };

  const handleVideoEnded = () => {
    // Show brand logo flourish before exiting
    if (logoOverlayRef.current) {
      gsap.to(logoOverlayRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.5)',
        onComplete: () => {
          setTimeout(handleSkip, 700);
        },
      });
    } else {
      handleSkip();
    }
  };

  useEffect(() => {
    // Attempt autoplay immediately
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if autoplay is blocked
      });
    }

    // Safety timeout: auto-skip after 6 seconds max
    const timer = setTimeout(() => {
      handleSkip();
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current || !progressBarRef.current) return;
    const progress = (videoRef.current.currentTime / (videoRef.current.duration || 5)) * 100;
    progressBarRef.current.style.width = `${progress}%`;

    // Reveal logo overlay at 75% video progress
    if (progress > 72 && logoOverlayRef.current && logoOverlayRef.current.style.opacity !== '1') {
      gsap.to(logoOverlayRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#F8F5EE] flex flex-col items-center justify-center overflow-hidden select-none transition-opacity duration-300"
    >
      {/* Top Skip Button */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <button
          onClick={handleSkip}
          className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#EFEAE1]/90 hover:bg-white backdrop-blur-md border border-[#DDD6C9] text-[#444C3D] hover:text-[#1C1D1A] text-xs font-mono font-bold transition-all cursor-pointer shadow-md hover:scale-105"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Video Presentation Stage */}
      <div className="relative w-full max-w-[1080px] aspect-video max-h-[75vh] flex items-center justify-center rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(28,29,26,0.12)] border border-[#DDD6C9] bg-black">
        {/* The MP4 Video */}
        <video
          ref={videoRef}
          src="/videos/hero_intro.mp4"
          autoPlay
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover object-center"
        />

        {/* Ambient Subtle Warm Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-transparent to-black/30" />

        {/* Brand Reveal Overlay during final lock phase */}
        <div
          ref={logoOverlayRef}
          style={{ opacity: 0, transform: 'scale(0.85)' }}
          className="absolute z-20 flex items-center gap-4 bg-[#F8F5EE]/95 backdrop-blur-md px-7 py-4 rounded-2xl border border-[#DDD6C9] shadow-2xl pointer-events-none"
        >
          {/* Circular Olive Badge with Shield */}
          <div className="w-12 h-12 rounded-full bg-[#444C3D] flex items-center justify-center text-white shadow-md">
            <Shield className="w-6 h-6 text-[#F8F5EE]" />
          </div>

          {/* Typography */}
          <div className="text-left">
            <div className="font-['Instrument_Serif'] text-3xl font-normal tracking-tight text-[#1C1D1A] leading-none">
              SURAKSHA
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[#706E66] uppercase mt-1 font-semibold">
              AICTE Security Deposit Control Tower
            </div>
          </div>
        </div>

        {/* Subtle Video Progress Bar at Bottom of Video Frame */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] transition-all duration-100 ease-linear"
            style={{ width: '0%' }}
          />
        </div>
      </div>

      {/* Subtitle / Context at Bottom */}
      <div className="mt-6 flex items-center gap-3 text-xs font-mono text-[#706E66]">
        <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
        <span>10-Year Statutory Lock-in & Custody Assurance</span>
        <span className="text-[#DDD6C9]">•</span>
        <span>SIH26265</span>
      </div>
    </div>
  );
}
