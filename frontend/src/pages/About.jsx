import Marquee from '../components/Marquee.jsx';
import { useReveal } from '../hooks/useReveal.js';

const values = [
  { n: '01', t: 'Fewer, better', d: 'We reject the infinite catalog. Everything you see was debated, rejected twice, approved once.' },
  { n: '02', t: 'Makers first', d: 'We pay on acceptance, not on sale. No consignment, no unpaid labor.' },
  { n: '03', t: 'Shipped slowly', d: 'Carbon-neutral by default. Consolidated shipments, reused packaging, no same-day anything.' },
  { n: '04', t: 'Honest prices', d: "We show the maker's cut on every product page. No markup theater." },
];

const team = [
  { name: 'Ines Moreira', role: 'Founder & Buyer', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600' },
  { name: 'Theo Lang', role: 'Head of Studio', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600' },
  { name: 'Mika Tanaka', role: 'Creative Director', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600' },
  { name: 'Noa Fischer', role: 'Maker Relations', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600' },
];

const timeline = [
  { y: '2019', t: 'Founded in Lisbon', d: 'Ines opens a 14-sqm storefront on Rua do Século with eight ceramic pieces.' },
  { y: '2021', t: 'Online edition', d: 'First online drop sells out in 40 minutes. Waitlist hits 2,000 people overnight.' },
  { y: '2023', t: '100 studios', d: 'Hits 100 makers across 14 countries. Launches The Memo, our Monday newsletter.' },
  { y: '2025', t: 'The Archive', d: 'Over 12,000 objects catalogued. A second showroom opens in Copenhagen.' },
];

export default function About() {
  useReveal();
  return (
    <div className="pt-32 pb-24">
      <section className="container mx-auto px-4 max-w-7xl mb-24">
        <p className="text-xs uppercase tracking-[0.3em] text-lime mb-6 reveal">About MONO</p>
        <h1 className="text-display-xl font-extrabold mb-8 reveal">
          <span className="line-mask"><span>A quiet shop</span></span>
          <span className="line-mask"><span>for <em className="not-italic text-lime">loud</em> things.</span></span>
        </h1>
        <div className="grid md:grid-cols-12 gap-8 mt-12">
          <p className="md:col-span-7 text-xl md:text-2xl leading-relaxed text-bone/90 reveal" data-delay="200">
            MONO is a curated modern store run out of Lisbon and Copenhagen. We work with 340+
            independent studios to bring you the objects we'd buy ourselves — and nothing else.
            No fast fashion, no dropshipping, no AI-written descriptions.
          </p>
          <div className="md:col-span-4 md:col-start-9 reveal" data-delay="300">
            <p className="text-muted leading-relaxed">
              Every piece is photographed in-house, written about by a human, and shipped from our
              own warehouse in Lisbon. If you need help choosing something, a real person named
              Ines will reply.
            </p>
          </div>
        </div>
      </section>

      <Marquee items={['Est. 2019', 'Lisbon · Copenhagen', '340 Makers', 'Fewer, Better', 'Made Slowly']} />

      {/* VALUES */}
      <section className="py-24 container mx-auto px-4 max-w-7xl">
        <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3 reveal">Principles</p>
        <h2 className="text-display-md mb-16 reveal">How we work.</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <div key={v.t} className="reveal p-8 rounded-2xl border border-ink-600 hover:border-lime/50 transition group" data-delay={i * 80}>
              <div className="flex items-start gap-6">
                <span className="text-6xl font-extrabold text-lime/20 group-hover:text-lime transition">{v.n}</span>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{v.t}</h3>
                  <p className="text-muted leading-relaxed">{v.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IMAGE BANNER */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="reveal relative aspect-[16/8] rounded-3xl overflow-hidden" data-effect="scale">
            <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600" alt="Studio" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-lime">Lisbon showroom — Rua do Século 41</p>
              <p className="text-xs uppercase tracking-[0.3em] text-bone/60 hidden md:block">Open Tue – Sat, 11–19</p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 container mx-auto px-4 max-w-5xl">
        <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3 reveal">Timeline</p>
        <h2 className="text-display-md mb-16 reveal">Six years, slowly.</h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-ink-600" />
          {timeline.map((t, i) => (
            <div
              key={t.y}
              className={`reveal relative flex gap-6 md:grid md:grid-cols-2 mb-12 ${i % 2 ? 'md:text-left' : 'md:text-right'}`}
              data-effect={i % 2 ? 'right' : 'left'}
              data-delay={i * 100}
            >
              <div className={`${i % 2 ? 'md:order-2 md:pl-12' : 'md:pr-12'}`}>
                <div className="text-5xl font-extrabold text-lime mb-2">{t.y}</div>
                <h3 className="text-xl font-bold mb-2">{t.t}</h3>
                <p className="text-muted leading-relaxed">{t.d}</p>
              </div>
              <div className="absolute left-4 md:left-1/2 top-2 w-3 h-3 rounded-full bg-lime -translate-x-1/2 ring-4 ring-ink" />
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 container mx-auto px-4 max-w-7xl">
        <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3 reveal">The team</p>
        <h2 className="text-display-md mb-16 reveal">Small, curious, human.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m, i) => (
            <div key={m.name} className="reveal group" data-delay={i * 80}>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-ink-700 mb-4">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms]" />
              </div>
              <h3 className="font-bold text-lg">{m.name}</h3>
              <p className="text-sm text-muted">{m.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
