const LOGOS = {
  dark: {
    full: '/assets/scampa-logo.svg',
    mark: '/assets/scampa-logo.svg',
  },
  light: {
    full: '/assets/scampa-logo-light.svg',
    mark: '/assets/scampa-logo-light.svg',
  },
};

export default function Logo({ size = 36, showText = true, textSize: _textSize = 'text-base', className = '', variant = 'dark' }) {
  const assets = LOGOS[variant] || LOGOS.dark;
  const src = showText ? assets.full : assets.mark;
  const width = showText ? size * 4.03 : size * 4.03;

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={src}
        alt="SCAMPA"
        className="object-contain"
        style={{ width: `${width}px`, height: `${size}px` }}
        draggable="false"
      />
    </div>
  );
}
