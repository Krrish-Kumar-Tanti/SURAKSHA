import React, { useId } from 'react';

interface BotanicalBranchProps {
  className?: string;
}

// Botanical SVG line-art illustrations matching warm linen theme
export function BotanicalBranch({ className = '' }: BotanicalBranchProps) {
  const rawId = useId();
  const patternId = `botanical-vine-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <div className={`w-full overflow-hidden flex items-center ${className}`}>
      <svg className="w-full h-8" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patternId} width="160" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M0 16 Q 40 14, 80 16 T 160 16"
              stroke="#444C3D"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.55"
            />
            <path
              d="M24 15 C 22 8, 14 6, 12 10 C 17 13, 21 14, 24 15 Z"
              fill="#444C3D"
              fillOpacity="0.25"
              stroke="#444C3D"
              strokeWidth="0.75"
            />
            <path
              d="M36 17 C 38 24, 46 26, 48 22 C 43 19, 39 18, 36 17 Z"
              fill="#444C3D"
              fillOpacity="0.25"
              stroke="#444C3D"
              strokeWidth="0.75"
            />
            <path
              d="M56 15 C 54 7, 46 5, 44 9 C 49 13, 53 14, 56 15 Z"
              fill="#444C3D"
              fillOpacity="0.25"
              stroke="#444C3D"
              strokeWidth="0.75"
            />
            <path
              d="M72 17 C 74 25, 82 27, 84 23 C 79 20, 75 19, 72 17 Z"
              fill="#444C3D"
              fillOpacity="0.25"
              stroke="#444C3D"
              strokeWidth="0.75"
            />
            <path
              d="M96 15 C 94 8, 86 6, 84 10 C 89 14, 93 15, 96 15 Z"
              fill="#444C3D"
              fillOpacity="0.25"
              stroke="#444C3D"
              strokeWidth="0.75"
            />
            <path
              d="M112 17 C 114 24, 122 25, 124 21 C 119 19, 115 18, 112 17 Z"
              fill="#444C3D"
              fillOpacity="0.25"
              stroke="#444C3D"
              strokeWidth="0.75"
            />
            <path
              d="M136 15 C 134 9, 128 7, 126 11 C 130 14, 133 15, 136 15 Z"
              fill="#444C3D"
              fillOpacity="0.25"
              stroke="#444C3D"
              strokeWidth="0.75"
            />
            <path
              d="M150 17 C 152 24, 157 25, 159 21 C 155 19, 152 18, 150 17 Z"
              fill="#444C3D"
              fillOpacity="0.25"
              stroke="#444C3D"
              strokeWidth="0.75"
            />
            <circle cx="30" cy="11" r="1.5" fill="#D4AF37" fillOpacity="0.7" />
            <circle cx="66" cy="11" r="1.5" fill="#D4AF37" fillOpacity="0.7" />
            <circle cx="106" cy="11" r="1.5" fill="#D4AF37" fillOpacity="0.7" />
            <circle cx="144" cy="11" r="1.5" fill="#D4AF37" fillOpacity="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="32" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
