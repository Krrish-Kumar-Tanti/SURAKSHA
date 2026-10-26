import React, { useEffect, useRef, useState } from 'react';

interface AnimatedHeadingProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  style?: React.CSSProperties;
  id?: string;
}

export function AnimatedHeading({
  children,
  className = '',
  as = 'h2',
  style = {},
  id,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Trigger immediately if already near top of viewport, else on scroll
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Component = as;
  const words = (typeof children === 'string' ? children : '').split(' ');
  let charCounter = 0;

  return (
    <Component ref={ref} id={id} className={className} style={style}>
      {words.map((word, wIdx) => {
        const wordChars = word.split('');
        const startIdx = charCounter;
        charCounter += wordChars.length;

        return (
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.28em]">
            {wordChars.map((char, cIdx) => {
              const delay = (startIdx + cIdx) * 0.025;
              return (
                <span
                  key={cIdx}
                  className="inline-block"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.92)',
                    transition: isVisible
                      ? `opacity 0.45s ease-out ${delay}s, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`
                      : 'none',
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </Component>
  );
}
