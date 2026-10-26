import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';

interface HeroIntroSplashProps {
  onComplete: () => void;
}

export function HeroIntroSplash({ onComplete }: HeroIntroSplashProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [skipped, setSkipped] = useState(false);

  const handleSkip = () => {
    if (skipped) return;
    setSkipped(true);
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.out',
        onComplete,
      });
    } else {
      onComplete();
    }
  };

  const handleVideoEnded = () => {
    handleSkip();
  };

  useEffect(() => {
    // Attempt autoplay immediately
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if browser policy blocks unmuted/autoplay
      });
    }

    // Safety timeout: auto-skip if video takes longer than 6 seconds
    const timer = setTimeout(() => {
      handleSkip();
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current || !progressBarRef.current) return;
    const progress = (videoRef.current.currentTime / (videoRef.current.duration || 5)) * 100;
    progressBarRef.current.style.width = `${progress}%`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#F8F5EE] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Top Right Skip Button */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <button
          onClick={handleSkip}
          className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#EFEAE1]/90 hover:bg-white backdrop-blur-md border border-[#DDD6C9] text-[#444C3D] hover:text-[#1C1D1A] text-xs font-mono font-bold transition-all cursor-pointer shadow-md hover:scale-105"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Google AI Studio MP4 Video Frame */}
      <div className="relative w-full max-w-[1080px] aspect-video max-h-[80vh] flex items-center justify-center rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(28,29,26,0.12)] border border-[#DDD6C9] bg-black">
        <video
          ref={videoRef}
          src="/videos/hero_intro.mp4"
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover object-center"
        />

        {/* Video Progress Bar at Bottom of Video Frame */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] transition-all duration-100 ease-linear"
            style={{ width: '0%' }}
          />
        </div>
      </div>
    </div>
  );
}
