import React from 'react';

export const Lantern: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`w-16 h-24 ${className}`} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="0" x2="50" y2="20" stroke="#FFD700" strokeWidth="2"/>
    <rect x="20" y="20" width="60" height="80" rx="10" fill="#D00000" stroke="#FFD700" strokeWidth="2"/>
    <path d="M20 30H80" stroke="#FFD700" strokeOpacity="0.5"/>
    <path d="M20 90H80" stroke="#FFD700" strokeOpacity="0.5"/>
    <circle cx="50" cy="60" r="15" fill="#FFD700" fillOpacity="0.8"/>
    <path d="M30 100L25 130" stroke="#FFD700" strokeWidth="2"/>
    <path d="M50 100L50 140" stroke="#FFD700" strokeWidth="2"/>
    <path d="M70 100L75 130" stroke="#FFD700" strokeWidth="2"/>
  </svg>
);

export const BlossomBranch: React.FC<{ className?: string, flipped?: boolean }> = ({ className = "", flipped = false }) => (
  <svg className={`w-32 h-32 ${className} ${flipped ? 'scale-x-[-1]' : ''}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 100C20 80 40 90 60 50C70 30 90 10 100 0" stroke="#5D4037" strokeWidth="3"/>
    <circle cx="60" cy="50" r="5" fill="#FFD700"/>
    <circle cx="80" cy="20" r="4" fill="#FFD700"/>
    <circle cx="40" cy="70" r="4" fill="#FFD700"/>
    <circle cx="90" cy="40" r="3" fill="#FFD700"/>
  </svg>
);

export const Coin: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`w-8 h-8 ${className} animate-bounce-slow`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
    <rect x="35" y="35" width="30" height="30" stroke="#B8860B" strokeWidth="2"/>
    <text x="50" y="65" textAnchor="middle" fill="#B8860B" fontSize="40" fontFamily="serif">Tài</text>
  </svg>
);