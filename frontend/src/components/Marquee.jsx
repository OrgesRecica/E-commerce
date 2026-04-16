export default function Marquee({ items, className = '' }) {
  return (
    <div className={`overflow-hidden py-6 border-y border-ink-600 bg-ink-800 ${className}`}>
      <div className="flex w-max animate-marquee">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-10 px-6">
            <span className="text-3xl md:text-5xl font-extrabold tracking-tight whitespace-nowrap">
              {item}
            </span>
            <span className="w-3 h-3 rounded-full bg-lime shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
