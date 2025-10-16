import React from 'react';

interface CredXLogoProps {
  size?: number;
  className?: string;
}

export function CredXLogo({ size = 40, className = '' }: CredXLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="credX-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#1e3a8a" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* 3D Cube Structure */}
      {/* Top segment */}
      <path
        d="M20 30 L50 15 L80 30 L50 45 Z"
        fill="url(#credX-gradient)"
        filter="url(#shadow)"
        stroke="#ffffff"
        strokeWidth="0.5"
        strokeOpacity="0.2"
      />
      
      {/* Left segment */}
      <path
        d="M20 30 L20 70 L50 85 L50 45 Z"
        fill="url(#credX-gradient)"
        filter="url(#shadow)"
        stroke="#ffffff"
        strokeWidth="0.5"
        strokeOpacity="0.2"
      />
      
      {/* Right segment */}
      <path
        d="M80 30 L80 70 L50 85 L50 45 Z"
        fill="url(#credX-gradient)"
        filter="url(#shadow)"
        stroke="#ffffff"
        strokeWidth="0.5"
        strokeOpacity="0.2"
      />
      
      {/* Bottom segment */}
      <path
        d="M20 70 L50 85 L80 70 L50 55 Z"
        fill="url(#credX-gradient)"
        filter="url(#shadow)"
        stroke="#ffffff"
        strokeWidth="0.5"
        strokeOpacity="0.2"
      />
      
      {/* Inner X shape */}
      <path
        d="M35 50 L50 40 L65 50 L50 60 Z"
        fill="#ffffff"
        fillOpacity="0.1"
        stroke="#ffffff"
        strokeWidth="0.3"
        strokeOpacity="0.3"
      />
    </svg>
  );
}










