import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import Marquee from '../components/Marquee.jsx';
import Magnetic from '../components/Magnetic.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { useCounter } from '../hooks/useCounter.js';

const categories = [
  {
    no: '01',
    name: 'Shopping Bags',
    sub: 'Boutique & retail',
    body: 'Premium presentation bags for retail, boutique, and pharmaceutical environments.',
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
  },
  {
    no: '02',
    name: 'Garbage Bags',
    sub: '100% recycled',
    body: 'Durable PE waste bags from post-consumer recycled materials. Drawtape, bottom-seal, wavetop.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  },
  {
    no: '03',
    name: 'Packing Roll',
    sub: 'Industrial grade',
    body: 'Multilayer flexible packaging foil. Cost-efficient, sustainable, tailored to spec.',
    img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80',
  },
];

const milestones = [
  { y: '1999', t: 'Founded',          d: 'Kujtim Gjevori founds SCAMPA as a HOREKA distribution company.' },
  { y: '2003', t: 'Manufacturing',    d: 'Expansion into sugar sachet packaging - first step into production.' },
  { y: '2007', t: 'Plastic industry', d: 'Establishment as a manufacturer in the plastic packaging sector.' },
  { y: '2019', t: 'Powerpack LLC',    d: 'Joint venture with Powerpack NV (Belgium) - 100% EU exports.' },
];

const news = [
  {
    tag: 'Visit',
    date: 'Dec - 2024',
    title: 'President Vjosa Osmani visits Scampa & Powerpack Kosovo.',
    excerpt: 'A step toward empowering women and promoting gender equality in industrial Kosovo.',
    img: '/assets/presidentja.jpg',
  },
  {
    tag: 'Innovation',
    date: 'Dec - 2024',
    title: 'New waste-bag production line is online.',
    excerpt: 'Higher capacity, multilayer technology, and lower prime-material consumption.',
    img: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=900&q=80',
  },
  {
    tag: 'Sustainability',
    date: 'Dec - 2024',
    title: 'Brand to Brand - partnerships for a circular future.',
    excerpt: 'Working with retailers, recyclers, and waste management to close the loop.',
    img: '/assets/brand-to-brand.png',
  },
];

const clients = ['Petrol', 'Conad', 'Shell', 'Spar', 'Kastrati', 'Intersport', 'Neptune', 'Meridian', 'Gorenje', 'Papirun', 'Sport Vision', 'Kam Market'];

function Stat({ to, label, suffix = '+', prefix = '' }) {
  const [v, ref] = useCounter(to);
  return (
    <div ref={ref} className="premium-panel p-5">
      <div className="text-3xl md:text-4xl font-semibold leading-none tabular text-bone">
        {prefix}{v}{suffix}
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted font-medium">{label}</p>
    </div>
  );
}

function HeroVideoFrame() {
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const duration = 19;
  const progress = Math.max(8, Math.min(100, (seconds / duration) * 100));
  const formatted = `00:${String(seconds).padStart(2, '0')}`;

  useEffect(() => {
    if (!playing) return undefined;
    const interval = window.setInterval(() => {
      setSeconds((value) => (value >= duration ? 0 : value + 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [playing]);

  const togglePlayback = () => {
    setPlaying((value) => {
      if (!value && seconds >= duration) setSeconds(0);
      return !value;
    });
  };

  return (
    <div className="relative mx-auto w-full max-w-[43rem] lg:max-w-[48rem]">
      <div className={`hero-reel relative overflow-hidden rounded-lg border border-white/14 bg-navy-900 shadow-[0_34px_90px_-42px_rgba(0,0,0,0.72)] ${playing ? 'is-playing' : ''}`}>
        <div className="flex h-11 items-center justify-end border-b border-white/10 bg-white/8 px-4">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/54">
            <span>SCAMPA</span>
            <span className="hidden sm:inline">Production reel</span>
          </div>
        </div>

        <div className="hero-reel__scene relative aspect-[16/9] overflow-hidden bg-[radial-gradient(circle_at_24%_20%,rgba(255,122,26,0.22),transparent_30%),linear-gradient(135deg,#082b5f_0%,#061f49_48%,#f4f8ff_100%)]">
          <div className="absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
          <div className="hero-reel__scan absolute inset-0 z-[1] bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[length:100%_12px] opacity-45" />
          <div className="absolute left-4 top-4 z-[3] rounded-md border border-white/14 bg-navy/72 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/72 backdrop-blur">
            {formatted}
          </div>
          <div className="hero-reel__pulse absolute right-4 top-4 z-[3] flex items-center gap-2 rounded-md border border-white/14 bg-navy/72 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/72 backdrop-blur">
            <span className="h-1.5 w-3 rounded-full bg-orange" />
            <span>{playing ? 'Rolling' : 'Ready'}</span>
          </div>

          <img
            src="/assets/hero-v2/factory-stage.png"
            alt="Claymorphism SCAMPA factory stage with conveyor belt"
            className="hero-reel__asset absolute inset-0 z-[2] h-full w-full object-cover"
          />

          <div className="hero-reel__motion-layer" aria-hidden="true">
            <img className="hero-reel__sprite hero-reel__sprite--blue-bag" src="/assets/hero-v2/blue-recycle-bag.png" alt="" />
            <img className="hero-reel__sprite hero-reel__sprite--white-bag" src="/assets/hero-v2/white-recycle-bag.png" alt="" />
            <img className="hero-reel__sprite hero-reel__sprite--folded" src="/assets/hero-v2/folded-bags.png" alt="" />
          </div>

          <div className="hero-reel__facts" aria-hidden="true">
            <span>100% recycled materials</span>
            <span>Exported across the EU</span>
            <span>Premium flexible packaging</span>
          </div>

          <div className="absolute inset-0 z-[3] pointer-events-none bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
          <button
            type="button"
            onClick={togglePlayback}
            className={`hero-reel__center absolute inset-0 z-[4] m-auto grid h-16 w-16 place-items-center rounded-full border border-white/22 bg-white/16 text-white shadow-glow backdrop-blur transition sm:h-20 sm:w-20 ${playing ? 'opacity-0 hover:opacity-100 focus:opacity-100' : 'opacity-100'}`}
            aria-label={playing ? 'Pause production reel' : 'Play production reel'}
          >
            {playing ? (
              <span className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-6 w-2 rounded-sm bg-current" />
                <span className="h-6 w-2 rounded-sm bg-current" />
              </span>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.8v12.4c0 .8.9 1.3 1.6.9l9.7-6.2c.6-.4.6-1.4 0-1.8L9.6 4.9C8.9 4.5 8 5 8 5.8Z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex h-14 items-center gap-4 border-t border-white/10 bg-navy-900 px-4">
          <button
            type="button"
            onClick={togglePlayback}
            className="grid h-9 w-9 place-items-center rounded-md border border-white/12 bg-white/8 text-white transition hover:border-orange hover:text-orange"
            aria-label={playing ? 'Pause production reel' : 'Play production reel'}
          >
            {playing ? (
              <span className="flex items-center gap-1" aria-hidden="true">
                <span className="h-3.5 w-1 rounded-sm bg-current" />
                <span className="h-3.5 w-1 rounded-sm bg-current" />
              </span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.8v12.4c0 .8.9 1.3 1.6.9l9.7-6.2c.6-.4.6-1.4 0-1.8L9.6 4.9C8.9 4.5 8 5 8 5.8Z" />
              </svg>
            )}
          </button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/12">
            <div className="h-full rounded-full bg-orange transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-medium tabular text-white/58">{formatted}</span>
        </div>
      </div>
    </div>
  );
}

function LineExplorer() {
  const [active, setActive] = useState(1);
  const item = categories[active];
  const values = [
    [82, 76, 69, 88],
    [94, 91, 84, 97],
    [78, 86, 92, 81],
  ][active];
  const labels = ['Durability', 'PCR fit', 'Print', 'Scale'];
  const points = values.map((v, i) => `${30 + i * 72},${115 - v}`).join(' ');

  return (
    <section className="py-28 bg-white border-y border-bone/10">
      <div className="container mx-auto px-5 max-w-[88rem]">
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-5">
            <p className="section-mark mb-5 reveal">Product intelligence</p>
            <h2 className="text-display-md text-bone reveal">Choose a line. Watch the spec profile move.</h2>
            <div className="mt-8 flex flex-col gap-3">
              {categories.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setActive(i)}
                  className={`text-left rounded-lg border p-4 transition ${
                    active === i ? 'border-orange bg-orange text-white shadow-glow' : 'border-bone/10 bg-ink-800 text-bone hover:border-violet/30'
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{c.no} / {c.sub}</span>
                  <span className="mt-1 block text-xl font-semibold">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 premium-panel p-5 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="img-mask aspect-[4/3]">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <p className="mt-5 text-bone-300 leading-relaxed">{item.body}</p>
              </div>

              <div className="rounded-lg bg-navy p-5 text-white">
                <div className="flex justify-between items-center mb-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/60 font-medium">Spec graph</p>
                  <span className="text-orange font-semibold">{item.no}</span>
                </div>
                <svg viewBox="0 0 260 130" className="w-full h-44">
                  {[25, 50, 75, 100].map((y) => (
                    <line key={y} x1="20" x2="244" y1={120 - y} y2={120 - y} stroke="rgba(255,255,255,.12)" />
                  ))}
                  <polyline points={points} fill="none" stroke="#ff7a1a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  {values.map((v, i) => (
                    <circle key={labels[i]} cx={30 + i * 72} cy={115 - v} r="5" fill="#fff" stroke="#ff7a1a" strokeWidth="3" />
                  ))}
                </svg>
                <div className="grid grid-cols-2 gap-3">
                  {values.map((v, i) => (
                    <div key={labels[i]} className="rounded-md bg-white/10 p-3">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-white/50 font-medium">{labels[i]}</p>
                      <p className="mt-1 text-2xl font-semibold tabular">{v}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactDashboard() {
  const metrics = [
    { label: 'Years strong', value: 25, max: 30 },
    { label: 'Recycled', value: 100, max: 100 },
    { label: 'Active clients', value: 60, max: 80 },
    { label: 'Product lines', value: 3, max: 5 },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-5 max-w-[88rem]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <Stat key={m.label} to={m.value} label={m.label} suffix={m.label === 'Recycled' ? '%' : i === 3 ? '' : '+'} />
          ))}
        </div>

        <div className="mt-6 premium-panel overflow-hidden">
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-4 bg-navy p-6 md:p-8 text-white">
              <p className="text-xs uppercase tracking-[0.14em] text-orange font-semibold mb-4">Operating system</p>
              <h3 className="text-3xl font-semibold leading-tight">Manufacturing data, not marketing noise.</h3>
              <p className="mt-5 text-sm text-white/70 leading-relaxed">
                A compact view of the same business facts already on the site: longevity, recycled production, clients, and product lines.
              </p>
            </div>
            <div className="lg:col-span-8 p-6 md:p-8">
              <div className="grid gap-5">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs uppercase tracking-[0.13em] font-medium text-muted mb-2">
                      <span>{m.label}</span>
                      <span className="tabular">{m.value}</span>
                    </div>
                    <div className="h-3 rounded-full bg-ink-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet to-orange"
                        style={{ width: `${Math.min(100, (m.value / m.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useReveal();
  const { data } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => (await api.get('/products', { params: { featured: true, limit: 8 } })).data,
  });

  const featureCount = useMemo(() => data?.items?.length || 8, [data]);

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white pt-32 lg:pt-40 pb-16">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-orange/20 blur-3xl" />
        <div className="relative container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 py-4 lg:py-16">
            <div className="flex flex-wrap gap-3 mb-8 reveal">
              <span className="rounded-md bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] font-medium text-white/75">Manufacturing & Trading Co.</span>
              <span className="rounded-md bg-orange px-3 py-1 text-xs uppercase tracking-[0.14em] font-medium text-white">Est. 1999</span>
            </div>
            <h1 className="text-display-2xl reveal">
              <span className="line-mask"><span>Premium packaging</span></span>
              <span className="line-mask"><span>with industrial precision.</span></span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 reveal" data-delay="120">
              We deliver high-quality, sustainable garbage bags and flexible packaging made from 100% recycled materials, engineered in Drenas, Kosovo, exported across the European Union.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 reveal" data-delay="220">
              <Magnetic>
                <Link to="/products" className="btn-primary">View catalogue</Link>
              </Magnetic>
              <Link to="/contact" className="btn-ghost border-white/20 bg-white/10 text-white hover:bg-white hover:text-bone">Request a quote</Link>
            </div>
          </div>

          <div className="relative lg:col-span-6 lg:self-stretch reveal" data-effect="right">
            <div className="relative grid min-h-[25rem] place-items-center sm:min-h-[31rem] lg:h-full lg:min-h-[34rem]">
              <HeroVideoFrame />
            </div>
          </div>
        </div>
      </section>

      <ImpactDashboard />
      <LineExplorer />

      <Marquee
        variant="dark"
        items={['Recycled materials', 'ISO 9001', 'EU export', 'Multilayer technology', 'Custom orders', 'Drenas, Kosovo']}
      />

      <section className="py-28">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex flex-wrap items-end justify-between gap-8 mb-12">
            <div>
              <p className="section-mark mb-5 reveal">Featured catalogue</p>
              <h2 className="text-display-md text-bone reveal">What clients order most.</h2>
            </div>
            <p className="max-w-md text-bone-300 leading-relaxed reveal">
              A selection from our active catalogue. Bulk pricing available; every order ships from our Drenas facility.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {data?.items?.length
              ? data.items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
              : Array.from({ length: featureCount }).map((_, i) => (
                  <div key={i} className="reveal aspect-[4/5] rounded-lg bg-white animate-pulse shadow-card" data-delay={i * 60} />
                ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-white border-y border-bone/10">
        <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="section-mark mb-5 reveal">Heritage</p>
            <h2 className="text-display-md text-bone reveal">Twenty-five years of growth.</h2>
            <Link to="/about" className="mt-8 inline-flex text-sm font-medium text-orange link-underline reveal">Read the full story</Link>
          </div>
          <div className="lg:col-span-8 grid gap-3">
            {milestones.map((m, i) => (
              <div key={m.y} className="reveal premium-panel p-5 grid md:grid-cols-12 gap-5 items-start" data-delay={i * 80}>
                <span className="md:col-span-2 text-2xl font-semibold text-orange tabular">{m.y}</span>
                <div className="md:col-span-10">
                  <h3 className="text-xl font-semibold text-bone">{m.t}</h3>
                  <p className="mt-2 text-bone-300 leading-relaxed">{m.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="container mx-auto px-5 max-w-[88rem] mb-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-mark mb-5 reveal">Trusted by</p>
              <h2 className="text-display-md text-bone reveal">Sixty businesses and counting.</h2>
            </div>
            <Link to="/clients" className="text-sm font-medium text-orange link-underline reveal">View all partners</Link>
          </div>
        </div>
        <Marquee variant="default" items={clients} speed="fast" />
        <Marquee variant="dark" items={[...clients].reverse()} />
      </section>

      <section className="py-28 bg-ink-700 border-t border-bone/10">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-mark mb-5 reveal">Journal</p>
              <h2 className="text-display-md text-bone reveal">Latest field notes.</h2>
            </div>
            <Link to="/news" className="text-sm font-medium text-orange link-underline reveal">All entries</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {news.map((n, i) => (
              <article key={n.title} className="reveal premium-panel overflow-hidden group" data-delay={i * 100}>
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={n.img} alt={n.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.13em] text-muted font-medium mb-4">
                    <span>{n.tag}</span>
                    <span>{n.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-bone leading-snug group-hover:text-orange transition-colors">{n.title}</h3>
                  <p className="mt-3 text-sm text-bone-300 leading-relaxed line-clamp-2">{n.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-navy text-white">
        <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.14em] text-orange font-semibold mb-5 reveal">Custom orders</p>
            <h2 className="text-display-lg reveal">Tell us your specifications.</h2>
            <p className="mt-6 max-w-xl text-white/70 leading-relaxed reveal" data-delay="120">
              Dimensions, material, quantity, print. Our team responds within 24 hours with a tailored quote for retailers, pharmacies, and industrial businesses.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3 reveal" data-effect="right">
            <Magnetic>
              <Link to="/contact" className="btn-primary w-full justify-between h-14 px-7">
                Request a quote
                <span className="block w-8 h-px bg-current" />
              </Link>
            </Magnetic>
            <a href="mailto:info@scampa.eu" className="btn-ghost w-full justify-between h-14 px-7 border-white/20 bg-white/10 text-white hover:bg-white hover:text-bone">
              info@scampa.eu
              <span className="text-xs uppercase tracking-[0.13em] text-white/50">Email</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
