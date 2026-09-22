import React from 'react';

interface PokeballIconProps {
  className?: string;
  size?: number;
  variant?: 'standard' | 'great' | 'ultra' | 'master' | 'gold';
}

export const PokeballIcon: React.FC<PokeballIconProps> = ({
  className = 'w-5 h-5',
  size = 20,
  variant = 'standard',
}) => {
  const topColor =
    variant === 'great'
      ? '#2563EB'
      : variant === 'ultra'
      ? '#0F172A'
      : variant === 'master'
      ? '#7C3AED'
      : variant === 'gold'
      ? '#F59E0B'
      : '#EF4444'; // classic red

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer black stroke */}
      <circle cx="12" cy="12" r="10.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
      
      {/* Top half */}
      <path
        d="M1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12"
        fill={topColor}
        stroke="#0F172A"
        strokeWidth="2.5"
      />
      
      {/* Ultra Ball stripes if variant is ultra */}
      {variant === 'ultra' && (
        <>
          <path d="M6 3.5L9 9" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 3.5L15 9" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Great Ball red marks if variant is great */}
      {variant === 'great' && (
        <>
          <path d="M5 5L9 8" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M19 5L15 8" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Center dividing black line */}
      <line x1="1.5" y1="12" x2="22.5" y2="12" stroke="#0F172A" strokeWidth="2.5" />
      
      {/* Center button ring */}
      <circle cx="12" cy="12" r="3.75" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="1.75" fill={variant === 'gold' ? '#F59E0B' : '#0F172A'} />
    </svg>
  );
};
