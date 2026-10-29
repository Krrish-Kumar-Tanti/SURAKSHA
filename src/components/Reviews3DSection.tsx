import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Landmark,
  Scale
} from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading';
import { BotanicalBranch } from './BotanicalBranch';

interface Review {
  id: number;
  author: string;
  designation: string;
  institution: string;
  category: 'University' | 'Regional Bureau' | 'Nodal Bank' | 'Auditor' | 'College';
  rating: number;
  highlight: string;
  quote: string;
  date: string;
  avatarInitials: string;
  icon: React.ElementType;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    author: 'Dr. Arvind R. Kulkarni',
    designation: 'Registrar & Member Secretary',
    institution: 'COEP Technological University, Pune',
    category: 'University',
    rating: 5,
    highlight: 'Verification: 3 weeks → 4 hours',
    quote: 'The automated FDR lien validation transformed our compliance cycle. We previously dispatched liaisons to the Western Regional Office for physical FDR scrutiny. With SURAKSHA, our SBI term deposit was verified, hashed, and tagged in under four hours.',
    date: 'October 2026',
    avatarInitials: 'AK',
    icon: Building2,
  },
  {
    id: 2,
    author: 'Meenakshi Sundaram',
    designation: 'Assistant Director (Approvals)',
    institution: 'AICTE Western Regional Office (WRO)',
    category: 'Regional Bureau',
    rating: 5,
    highlight: '100% Audit Provenance',
    quote: 'Cross-institutional duplicate pledge detection is a game changer for regulatory vigilance. In our dry-run audit across 140 institutions, the automated fingerprint scanner immediately surfaced conflicting claims without manual cross-referencing.',
    date: 'September 2026',
    avatarInitials: 'MS',
    icon: ShieldCheck,
  },
  {
    id: 3,
    author: 'Rajeshwar V. Rao',
    designation: 'Chief General Manager (Govt Business)',
    institution: 'State Bank of India — Nodal Operations',
    category: 'Nodal Bank',
    rating: 5,
    highlight: 'Zero Reconciliation Lag',
    quote: 'The tripartite SFTP/API linkage creates an unbroken chain of custody. When a deposit matures or requires safe early release under court order, bank officers and AICTE regulators see synchronized ledger records without ambiguity.',
    date: 'August 2026',
    avatarInitials: 'RR',
    icon: Landmark,
  },
  {
    id: 4,
    author: 'Dr. Shalini Deshmukh',
    designation: 'Dean of Approvals & Accreditation',
    institution: 'Symbiosis Institute of Technology',
    category: 'College',
    rating: 5,
    highlight: 'Clause 1.12 Compliance',
    quote: 'Calculating deposit requirements under APH 2024–27 used to involve confusing circulars on leased land and trust concessions. The dynamic policy estimator gave us exact, transparent values with cited handbook clauses.',
    date: 'October 2026',
    avatarInitials: 'SD',
    icon: Scale,
  },
  {
    id: 5,
    author: 'Suresh K. Nair',
    designation: 'Senior Audit & Vigilance Inspector',
    institution: 'Directorate of Technical Education (DTE)',
    category: 'Auditor',
    rating: 5,
    highlight: 'SHA-256 Tamper Proof',
    quote: 'Having SHA-256 integrity digests computed in real-time in the client browser prevents any post-facto document swapping or forged fixed deposit receipts. It sets the gold standard for e-governance in higher education.',
    date: 'September 2026',
    avatarInitials: 'SN',
    icon: ShieldCheck,
  },
  {
    id: 6,
    author: 'Prof. K. N. Somaiya',
    designation: 'Principal & Executive Trustee',
    institution: 'K.J. Somaiya College of Engineering, Mumbai',
    category: 'College',
    rating: 5,
    highlight: 'Discharge NOC in 48 hrs',
    quote: 'The multi-stage release DAG brings complete peace of mind. Every single legal caveat, vigilance clearance, and holding-period check is tracked visibly before AICTE issues the final digital discharge NOC.',
    date: 'July 2026',
    avatarInitials: 'KS',
    icon: Building2,
  },
];

export function Reviews3DSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragCurrentX, setDragCurrentX] = useState<number | null>(null);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const total = REVIEWS.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Touch and drag handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragCurrentX(clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartX === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragCurrentX(clientX);
  };

  const handleTouchEnd = () => {
    if (dragStartX !== null && dragCurrentX !== null) {
      const diff = dragCurrentX - dragStartX;
      if (diff > 50) {
        prevSlide();
      } else if (diff < -50) {
        nextSlide();
      }
    }
    setDragStartX(null);
    setDragCurrentX(null);
    setIsPaused(false);
  };

  // Subtle 3D mouse parallax tilt on active card
  const handleMouseMoveOnCard = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 6, y: -y * 6 });
    setGlarePos({ x: (x + 0.5) * 100, y: (y + 0.5) * 100 });
  };

  const handleMouseLeaveCard = () => {
    setMouseTilt({ x: 0, y: 0 });
    setGlarePos({ x: 50, y: 50 });
  };

  return (
    <section className="py-20 relative z-10 overflow-hidden">
      {/* Full-width Botanical Vine divider */}
      <div className="w-full overflow-hidden mb-10 opacity-85">
        <BotanicalBranch className="w-full text-[#444C3D]" />
      </div>

      <div className="max-w-[1376px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Decorative ambient background accents */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-[#DDD6C9]/25 to-[#EFEAE1]/20 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true" 
        />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          Verified Stakeholder Perspectives
        </div>
        <AnimatedHeading
          as="h2"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] leading-tight"
        >
          Trusted Across *Institutions & Banks*
        </AnimatedHeading>
        <p className="text-[#55544E] text-xs sm:text-sm mt-3.5 max-w-lg mx-auto leading-relaxed font-normal">
          Operational testimonials from registrars, regional AICTE directors, SBI nodal managers, and vigilance auditors.
        </p>
      </div>

      {/* 3D Perspective Stage */}
      <div
        ref={containerRef}
        className="relative h-[450px] sm:h-[410px] md:h-[380px] w-full max-w-[1100px] mx-auto flex items-center justify-center select-none"
        style={{ 
          perspective: '1600px',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          handleTouchEnd();
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
      >
        {REVIEWS.map((review, idx) => {
          // Calculate relative circular distance (-1, 0, 1, or beyond)
          let diff = idx - activeIndex;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          const isActive = diff === 0;
          const isPrev = diff === -1;
          const isNext = diff === 1;

          // Smart 3D transformation: rich spatial deck layering without raster blur
          let transformStyle = '';
          let opacity = 0;
          let zIndex = 5;
          let boxShadow = '';
          let pointerEvents: 'auto' | 'none' = 'none';

          if (isActive) {
            // Elevated front card with subtle interactive parallax tilt
            transformStyle = `translate3d(0%, -8px, 30px) rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg) scale(1)`;
            opacity = 1;
            zIndex = 30;
            boxShadow = '0 4px 6px -1px rgba(28,29,26,0.04), 0 20px 38px -6px rgba(68,76,61,0.14), 0 36px 72px -12px rgba(28,29,26,0.18)';
            pointerEvents = 'auto';
          } else if (isPrev) {
            // Left card angled in 3D space like a fanned deck
            transformStyle = 'translate3d(-56%, 10px, -50px) rotateY(16deg) rotateZ(-1.5deg) scale(0.93)';
            opacity = 0.62;
            zIndex = 20;
            boxShadow = '-12px 20px 40px -10px rgba(28,29,26,0.14)';
            pointerEvents = 'auto';
          } else if (isNext) {
            // Right card angled in 3D space like a fanned deck
            transformStyle = 'translate3d(56%, 10px, -50px) rotateY(-16deg) rotateZ(1.5deg) scale(0.93)';
            opacity = 0.62;
            zIndex = 20;
            boxShadow = '12px 20px 40px -10px rgba(28,29,26,0.14)';
            pointerEvents = 'auto';
          } else {
            // Far back offstage
            const dir = diff > 0 ? 1 : -1;
            transformStyle = `translate3d(${dir * 110}%, 25px, -140px) rotateY(${-dir * 28}deg) scale(0.82)`;
            opacity = 0;
            zIndex = 10;
          }

          const IconComponent = review.icon;

          return (
            <div
              key={review.id}
              onClick={() => {
                if (isPrev) prevSlide();
                if (isNext) nextSlide();
              }}
              onMouseMove={isActive ? handleMouseMoveOnCard : undefined}
              onMouseLeave={isActive ? handleMouseLeaveCard : undefined}
              className={`absolute top-0 w-full max-w-[340px] sm:max-w-[540px] md:max-w-[620px] p-6 sm:p-8 rounded-3xl bg-white border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive
                  ? 'border-[#444C3D]/45 ring-1 ring-[#444C3D]/15 cursor-default'
                  : 'border-[#E5DFD5] cursor-pointer hover:opacity-85'
              }`}
              style={{
                transform: transformStyle,
                opacity,
                zIndex,
                boxShadow,
                pointerEvents,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
              }}
            >
              {/* Dynamic specular light sheen on active card */}
              {isActive && (
                <div 
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-40 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)`,
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Top Accent Bar with 3D glow */}
              <div 
                className={`absolute top-0 left-8 right-8 h-1 rounded-b-full transition-colors duration-500 ${
                  isActive ? 'bg-[#444C3D] shadow-[0_2px_8px_rgba(68,76,61,0.35)]' : 'bg-transparent'
                }`} 
              />

              {/* Card Header: Category Badge + Star Rating */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5DFD5] text-[11px] font-mono text-[#444C3D] font-semibold">
                  <IconComponent className="w-3.5 h-3.5 text-[#444C3D]" />
                  <span>{review.category}</span>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, starIdx) => (
                    <Star 
                      key={starIdx} 
                      className="w-4 h-4 fill-[#C59B27] text-[#C59B27]" 
                    />
                  ))}
                </div>
              </div>

              {/* Quote Statement - Razor-sharp readable modern typography */}
              <div className="relative mb-5">
                <Quote className="w-7 h-7 text-[#444C3D]/20 absolute -top-2.5 -left-2 -z-10" />
                <p className="text-[#1A1C19] text-[15px] sm:text-[16px] leading-[1.65] font-normal font-sans tracking-normal">
                  "{review.quote}"
                </p>
              </div>

              {/* Highlight Pill */}
              <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#EFEAE1]/90 border border-[#DDD6C9] text-xs font-mono text-[#444C3D] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#444C3D]" />
                <span>{review.highlight}</span>
              </div>

              {/* Stakeholder Details */}
              <div className="pt-4 border-t border-[#E5DFD5] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#EFEAE1] border border-[#DDD6C9] flex items-center justify-center font-mono text-xs font-bold text-[#444C3D] shrink-0 shadow-sm">
                    {review.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-semibold text-[#151614] truncate tracking-tight">
                      {review.author}
                    </h4>
                    <p className="text-xs text-[#525048] truncate font-normal">
                      {review.designation}
                    </p>
                    <p className="text-[11px] text-[#73716A] truncate font-medium">
                      {review.institution}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-[#73716A] shrink-0 hidden sm:inline-block font-medium">
                  {review.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls: Arrows and Pill Indicators */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous Review"
          className="w-11 h-11 rounded-full border border-[#DDD6C9] bg-white text-[#444C3D] flex items-center justify-center shadow-sm hover:bg-[#444C3D] hover:text-white hover:border-[#444C3D] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Dots */}
        <div className="flex items-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i
                  ? 'w-8 bg-[#444C3D]'
                  : 'w-2 bg-[#DDD6C9] hover:bg-[#A8A49B]'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Review"
          className="w-11 h-11 rounded-full border border-[#DDD6C9] bg-white text-[#444C3D] flex items-center justify-center shadow-sm hover:bg-[#444C3D] hover:text-white hover:border-[#444C3D] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Statutory Trust Notice */}
      <div className="mt-8 text-center">
        <p className="text-[11px] font-mono text-[#8C8980] uppercase tracking-wider">
          • Real-time audit logs cryptographically verified under AICTE SIH26265 Protocol •
        </p>
      </div>
    </div>
  </section>
);
}
