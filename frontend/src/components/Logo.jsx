export default function Logo({ size = 36, showText = true, textSize = 'text-base', className = '', variant = 'dark' }) {
  // 'dark' = on light bg (mark in bone-200), 'light' = on dark bg (mark in white)
  const stroke = variant === 'light' ? '#ffffff' : '#071f45';
  const fill = '#ff7a1a';
  const textColor = variant === 'light' ? 'text-white' : 'text-bone';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SCAMPA"
      >
        {/* Outer industrial hexagon */}
        <path
          d="M24 4 L41 14 L41 34 L24 44 L7 34 L7 14 Z"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Inner triangle (recycling cue) */}
        <path
          d="M24 16 L33 30 L15 30 Z"
          fill={fill}
        />
        {/* Center dot */}
        <circle cx="24" cy="25" r="2.4" fill={stroke} />
      </svg>

      {showText && (
        <span className={`font-medium tracking-[0.14em] uppercase leading-none ${textSize} ${textColor}`}>
          SCAMPA
        </span>
      )}
    </div>
  );
}
