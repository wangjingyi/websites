import React from 'react';

const Logo = ({ size = 120, className = '' }) => {
  return (
    <div className={`logo ${className}`} style={{ display: 'inline-block' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 120 120" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle 
          cx="60" 
          cy="60" 
          r="55" 
          fill="#4f46e5" 
          stroke="#6366f1" 
          strokeWidth="2"
        />
        
        {/* Book pages */}
        <rect 
          x="35" 
          y="40" 
          width="50" 
          height="40" 
          rx="3" 
          fill="#ffffff" 
          stroke="#e5e7eb" 
          strokeWidth="1"
        />
        
        {/* Book spine */}
        <rect 
          x="35" 
          y="40" 
          width="8" 
          height="40" 
          fill="#d1d5db"
        />
        
        {/* Microphone */}
        <circle 
          cx="70" 
          cy="30" 
          r="8" 
          fill="#ef4444" 
          stroke="#dc2626" 
          strokeWidth="1"
        />
        
        {/* Microphone stand */}
        <rect 
          x="68" 
          y="38" 
          width="4" 
          height="15" 
          fill="#374151"
        />
        
        {/* Sound waves */}
        <path 
          d="M 85 25 Q 90 30 85 35" 
          stroke="#fbbf24" 
          strokeWidth="2" 
          fill="none"
        />
        <path 
          d="M 90 22 Q 97 30 90 38" 
          stroke="#fbbf24" 
          strokeWidth="2" 
          fill="none"
        />
        
        {/* Text lines on book */}
        <line x1="45" y1="50" x2="75" y2="50" stroke="#9ca3af" strokeWidth="1"/>
        <line x1="45" y1="55" x2="70" y2="55" stroke="#9ca3af" strokeWidth="1"/>
        <line x1="45" y1="60" x2="75" y2="60" stroke="#9ca3af" strokeWidth="1"/>
        <line x1="45" y1="65" x2="65" y2="65" stroke="#9ca3af" strokeWidth="1"/>
        
        {/* AI sparkle */}
        <g transform="translate(25, 25)">
          <path 
            d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" 
            fill="#fbbf24"
          />
        </g>
        
        {/* PDF icon */}
        <g transform="translate(90, 85)">
          <rect x="-8" y="-8" width="16" height="12" rx="1" fill="#dc2626"/>
          <text x="0" y="0" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">PDF</text>
        </g>
      </svg>
    </div>
  );
};

export default Logo;
