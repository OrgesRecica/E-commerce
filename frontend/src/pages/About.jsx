import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee.jsx';
import Magnetic from '../components/Magnetic.jsx';
import { useReveal } from '../hooks/useReveal.js';

const principles = [
  { n: '01', t: 'Quality first',          d: 'ISO 9001 certified. Every product meets international quality standards before it ships.' },
  { n: '02', t: 'Sustainability',         d: 'In-house recycling, post-consumer materials, multilayer film tech reducing prime resin use.' },
  { n: '03', t: 'Long-term partnerships', d: 'We treat clients as partners — competitive pricing, consistency, decades-long relationships.' },
  { n: '04', t: 'Quiet innovation',       d: 'Continuous investment in advanced manufacturing — new machinery, smarter formulations.' },
];

const timeline = [
  { y: '1999', t: 'The beginning',        d: 'Kujtim Gjevori founds SCAMPA as a HOREKA (hotel/restaurant/catering) distribution company in Kosovo.' },
  { y: '2003', t: 'First production',     d: 'Expansion into sugar sachet packaging — our first step into manufacturing.' },
  { y: '2007', t: 'Plastic industry',     d: 'Established as a manufacturing company in the plastic industry — laying the foundation for SCAMPA today.' },
  { y: '2019', t: 'Powerpack LLC',        d: 'Joint venture with Powerpack NV (Belgium). 100% EU exports. Drenas Industrial Park, Kosovo.' },
];

const products = [
  { name: 'Drawtape',     description: 'Convenient drawstring closure for easy disposal.' },
  { name: 'Bottom-seal',  description: 'Reinforced bottom for heavy-duty applications.' },
  { name: 'Wavetop',      description: 'Wavy edge design for premium presentation.' },
];

export default function About() {
  useReveal();

  return (
    <>
      {/* ════════════════ HEADER (light, integrated, no big navy block) ════════════════ */}
      <section className="page-top pb-12">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted mb-10 reveal">
            <Link to="/" className="link-underline">Home</Link>
            <span>/</span>
            <span className="text-bone">About</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="section-mark mb-6 reveal">N° 01 — Studio profile</p>
              <h1 className="kinetic text-display-2xl text-bone reveal">
                <span className="line-mask"><span>A quarter-century</span></span>
                <span className="line-mask"><span>of <em>quiet, sustainable</em></span></span>
                <span className="line-mask"><span>manufacturing.</span></span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pl-6 lg:border-l border-black/10 reveal" data-delay="200">
              <p className="text-bone-300 leading-relaxed">
                SCAMPA Manufacturing & Trading Co. — founded 1999 in Drenas, Kosovo. We deliver
                high-quality, sustainable garbage bags and flexible packaging made from
                100% recycled materials.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.22em] text-muted">
                <span>ISO 9001</span>
                <span>·</span>
                <span>Drenas, KS</span>
                <span>·</span>
                <span>EU Export</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Big editorial photo — full bleed, masked reveal */}
      <section className="py-12">
        <div className="container mx-auto px-5 max-w-[96rem]">
          <div className="reveal img-mask aspect-[16/8] w-full" data-effect="mask">
            <img src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=2200&q=85" alt="SCAMPA factory" className="w-full h-full object-cover" />
          </div>
          <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted">
            <span>— Manufacturing facility</span>
            <span>Industrial Business Park · Drenas</span>
          </div>
        </div>
      </section>

      <Marquee variant="default" items={['Est. 1999', '— ISO 9001', 'Drenas, Kosovo', '— Powerpack LLC', '100% EU Export']} />

      {/* ════════════════ VISION + PHILOSOPHY (asymmetric two-column) ════════════════ */}
      <section className="py-32">
        <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-6 reveal">
            <p className="section-mark mb-6">Vision</p>
            <h2 className="kinetic text-display-md text-bone mb-8">
              Manufacturing <em>leadership</em>.
            </h2>
            <div className="space-y-5 text-bone-300 leading-relaxed text-[15px]">
              <p>
                "Being a manufacturing leader in quality, consistency, and innovation."
              </p>
              <p>
                Our vision focuses on long-term client partnerships, sustainability through
                cutting-edge technology, and continuous investment in our production capabilities.
              </p>
              <p>
                Within just a decade of our 2007 manufacturing establishment, SCAMPA emerged
                as an industry leader in plastic manufacturing across Kosovo and the broader
                Balkans region.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-12 lg:border-l border-black/10 reveal" data-delay="150">
            <p className="section-mark mb-6">Philosophy</p>
            <h2 className="kinetic text-display-md text-bone mb-8">
              Clients as <em>partners</em>.
            </h2>
            <div className="space-y-5 text-bone-300 leading-relaxed text-[15px]">
              <p>
                SCAMPA values long-term relationships, treating every client as a partner.
                We prioritize quality, competitive pricing, and consistency — order after order.
              </p>
              <p>
                Our private-label (PL) contracted solutions serve major retail chains in Kosovo
                and beyond, with custom specifications, dimensions, and printing on demand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ PRINCIPLES — 4-up minimal grid with running numbers ════════════════ */}
      <section className="py-32 border-t border-black/10 bg-ink-800">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-20">
            <div>
              <p className="section-mark mb-6 reveal">N° 02 — Principles</p>
              <h2 className="kinetic text-display-md text-bone reveal">
                Four <em>commitments</em>.
              </h2>
            </div>
            <p className="max-w-md text-bone-300 reveal" data-delay="100">
              The way we approach every order, every partnership, and every kilo of recycled film.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
            {principles.map((p, i) => (
              <div
                key={p.t}
                className="reveal bg-ink-800 hover:bg-white transition-colors duration-700 p-10 group"
                data-delay={i * 100}
              >
                <div className="text-xs uppercase tracking-[0.24em] text-muted mb-12 group-hover:text-orange transition">
                  N° {p.n}
                </div>
                <h3 className="kinetic text-2xl font-medium tracking-normal text-bone mb-4">{p.t}</h3>
                <p className="text-sm text-bone-300 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ TIMELINE — sticky scroll story ════════════════ */}
      <section className="py-32">
        <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <p className="section-mark mb-6 reveal">N° 03 — Timeline</p>
            <h2 className="kinetic text-display-md text-bone mb-6 reveal">
              Twenty-five years, <em>one factory</em>.
            </h2>
            <p className="text-bone-300 leading-relaxed reveal" data-delay="100">
              From a small distribution outfit to a regional manufacturing leader serving
              60+ enterprise clients across the European Union.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-px">
            {timeline.map((m, i) => (
              <div
                key={m.y}
                className="reveal grid grid-cols-12 gap-6 py-12 border-t border-black/10 last:border-b group"
                data-delay={i * 80}
              >
                <div className="col-span-12 md:col-span-3">
                  <span className="text-3xl md:text-4xl font-light tabular text-bone tracking-normal">
                    {m.y}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-9">
                  <h3 className="text-xl md:text-2xl font-medium text-bone tracking-normal mb-3 group-hover:translate-x-2 transition-transform duration-700">
                    {m.t}
                  </h3>
                  <p className="text-bone-300 leading-relaxed max-w-xl">{m.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ POWERPACK MODULE — full bleed dark ════════════════ */}
      <section className="py-32 bg-bone text-white relative overflow-hidden">
        <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.24em] text-white/50 mb-6 reveal">N° 04 — Joint venture</p>
            <h2 className="kinetic text-display-lg leading-[0.95] reveal">
              <span className="line-mask"><span>Powerpack LLC</span></span>
              <span className="line-mask"><span><em className="text-orange">100% EU exports</em>.</span></span>
            </h2>
            <p className="mt-10 text-lg text-white/70 leading-relaxed max-w-xl reveal" data-delay="100">
              Established October 2019, Powerpack LLC is our joint venture with Powerpack NV
              from Belgium. Operating from Drenas Industrial Park, Kosovo, we manufacture
              high-quality PE waste bags exclusively for the European Union market.
            </p>

            <div className="mt-14 grid sm:grid-cols-3 gap-x-6 gap-y-8 reveal" data-delay="200">
              {products.map((p) => (
                <div key={p.name} className="border-t border-white/20 pt-5">
                  <h4 className="font-medium tracking-normal mb-2">{p.name}</h4>
                  <p className="text-sm text-white/60 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 reveal" data-effect="right" data-delay="200">
            <div className="border border-white/20 p-8 lg:p-10">
              <div className="flex items-baseline justify-between mb-10 pb-6 border-b border-white/10">
                <h3 className="text-2xl font-medium tracking-normal">Powerpack LLC</h3>
                <span className="text-xs uppercase tracking-[0.24em] text-orange">2019 →</span>
              </div>
              <dl className="space-y-5">
                {[
                  ['Partner',     'Powerpack NV — Belgium'],
                  ['Established', 'October 2019'],
                  ['Location',    'Drenas Industrial Park, KS'],
                  ['Market',      '100% European Union'],
                  ['Products',    'Drawtape · Bottom-seal · Wavetop'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 text-sm">
                    <dt className="text-white/50 uppercase tracking-[0.14em] text-xs">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ SUSTAINABILITY — three pillars ════════════════ */}
      <section className="py-32 border-t border-black/10">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="max-w-3xl mb-20">
            <p className="section-mark mb-6 reveal">N° 05 — Sustainability</p>
            <h2 className="kinetic text-display-md text-bone reveal">
              Responsible production <em>at scale</em>.
            </h2>
            <p className="mt-6 text-bone-300 leading-relaxed reveal" data-delay="100">
              We recycle all in-house waste, integrate post-consumer recycled (PCR) materials,
              and invest in multilayer technology to reduce prime materials — without compromising
              on performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { n: '01', t: 'In-house recycling', d: 'All production waste recycled and reintegrated into our manufacturing chain.' },
              { n: '02', t: 'PCR integration',    d: 'Post-consumer recycled materials integrated across all product lines.' },
              { n: '03', t: 'Multilayer tech',    d: 'Advanced film technology reduces prime resin without compromising durability.' },
            ].map((s, i) => (
              <div key={s.t} className="reveal" data-delay={i * 100}>
                <div className="text-7xl font-light tracking-normal text-orange mb-6 tabular">{s.n}</div>
                <h3 className="text-xl font-medium tracking-normal text-bone mb-3">{s.t}</h3>
                <p className="text-sm text-bone-300 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA ════════════════ */}
      <section className="py-32 border-t border-black/10 bg-ink-800">
        <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-2 gap-12 items-center">
          <h2 className="kinetic text-display-lg text-bone reveal">
            Become a <em>SCAMPA partner</em>.
          </h2>
          <div className="flex flex-wrap gap-4 lg:justify-end reveal" data-delay="100">
            <Magnetic><Link to="/contact" className="btn-primary">Get in touch</Link></Magnetic>
            <Link to="/products" className="btn-ghost">Browse products</Link>
          </div>
        </div>
      </section>
    </>
  );
}
