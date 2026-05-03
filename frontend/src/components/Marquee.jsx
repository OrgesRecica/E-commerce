export default function Marquee({ items, className = '', variant = 'default', speed = 'normal' }) {
  const wrapper = {
    default: 'bg-white text-bone border-y border-bone/10',
    dark: 'bg-navy text-white border-y border-white/10',
    navy: 'bg-navy text-white border-y border-white/10',
  }[variant];

  const animation = speed === 'fast' ? 'animate-marquee-fast' : 'animate-marquee';

  return (
    <div className={`marquee-host overflow-hidden py-6 ${wrapper} ${className}`} data-cursor="hover">
      <div className={`marquee-track flex w-max ${animation}`}>
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-10 px-7">
            <span className="text-xl md:text-3xl font-medium tracking-normal whitespace-nowrap">
              {item}
            </span>
            <span className="h-2.5 w-10 rounded-full bg-orange/90 shadow-glow" />
          </div>
        ))}
      </div>
    </div>
  );
}
