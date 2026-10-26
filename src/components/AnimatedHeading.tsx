import React, { useEffect, useRef, useState } from 'react';

interface AnimatedHeadingProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
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

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88) {
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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Component = as;

  // Parse words and track whether word is inside *italic* emphasis
  const rawText = typeof children === 'string' ? children : '';
  
  // Tokenize preserving spaces and *italic* tags
  const tokens: { text: string; isItalic: boolean }[] = [];
  let isCurrentlyItalic = false;

  const parts = rawText.split(/(\*[^*]+\*)/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('*') && part.endsWith('*')) {
      const inner = part.slice(1, -1);
      const innerWords = inner.split(' ');
      innerWords.forEach((w, i) => {
        if (i > 0) tokens.push({ text: ' ', isItalic: true });
        tokens.push({ text: w, isItalic: true });
      });
    } else {
      const outerWords = part.split(' ');
      outerWords.forEach((w, i) => {
        if (i > 0) tokens.push({ text: ' ', isItalic: false });
        if (w) tokens.push({ text: w, isItalic: false });
      });
    }
  }

  let charCounter = 0;

  return (
    <Component
      ref={ref}
      id={id}
      className={`font-['Instrument_Serif'] tracking-[-0.01em] ${className}`}
      style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        ...style,
      }}
    >
      {tokens.map((token, tIdx) => {
        if (token.text === ' ') {
          return <span key={tIdx} className="inline-block w-[0.24em]">&nbsp;</span>;
        }

        const chars = token.text.split('');
        const startIdx = charCounter;
        charCounter += chars.length;

        return (
          <span
            key={tIdx}
            className={`inline-block whitespace-nowrap ${token.isItalic ? 'italic' : ''}`}
          >
            {chars.map((char, cIdx) => {
              const delay = (startIdx + cIdx) * 0.022;
              return (
                <span
                  key={cIdx}
                  className="inline-block"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.94)',
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

