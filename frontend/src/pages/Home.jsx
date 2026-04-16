import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import Marquee from '../components/Marquee.jsx';
import { useReveal } from '../hooks/useReveal.js';

const categories = [
  { name: 'Furniture', count: '128 pieces', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900' },
  { name: 'Lighting', count: '64 pieces', img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900' },
  { name: 'Ceramics', count: '92 pieces', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900' },
  { name: 'Textiles', count: '57 pieces', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900' },
];

const stats = [
  { n: '12K+', l: 'Curated objects' },
  { n: '340', l: 'Independent makers' },
  { n: '48', l: 'Countries shipped' },
  { n: '4.9', l: 'Average review' },
];

const testimonials = [
  { name: 'Lena M.', role: 'Interior Designer', q: 'MONO is the only shop where every piece feels like it was chosen for me. Fast shipping and packaging worth keeping.' },
  { name: 'Ari K.', role: 'Architect', q: 'Editorial eye, honest pricing, and real makers behind every object. I source half my projects here.' },
  { name: 'Jules P.', role: 'Creative Director', q: 'The closest a shop has gotten to a gallery. Buying here feels like collecting.' },
];

const journal = [
  { tag: 'Studio visit', title: 'Inside the Copenhagen ceramics studio we can\'t stop thinking about', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900' },
  { tag: 'Guide', title: 'How to light a small apartment without ruining it', img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900' },
  { tag: 'Interview', title: 'Maker notes — on slowness, seasons, and saying no', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900' },
];

export default function Home() {
  useReveal();
  const { data } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => (await api.get('/products', { params: { featured: true, limit: 8 } })).data,
  });

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-end pt-32 pb-16 overflow-hidden">
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-violet/20 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-lime/15 blur-3xl animate-blob" style={{ animationDelay: '-6s' }} />

        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="flex items-center gap-3 mb-8 reveal">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">Spring 25 — Issue 07</span>
          </div>

          <h1 className="text-display-xl font-extrabold reveal">
            <span className="line-mask"><span>Objects</span></span>
            <span className="line-mask"><span>of modern</span></span>
            <span className="line-mask"><span>living, <em className="not-italic text-lime">curated</em>.</span></span>
          </h1>

          <div className="mt-12 grid md:grid-cols-12 gap-8 items-end">
            <p className="md:col-span-5 text-muted text-lg leading-relaxed reveal" data-delay="200">
              A shop, a journal, a slow directory. We collaborate with independent studios and
              design-forward brands to bring you 2,000+ considered objects — fewer, better.
            </p>
            <div className="md:col-span-4 md:col-start-8 flex flex-wrap gap-3 reveal" data-delay="300">
              <Link to="/products" className="h-14 px-8 rounded-full bg-lime text-ink font-semibold inline-flex items-center gap-2 hover:bg-lime-600 transition">
                Shop the edit
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <Link to="/about" className="h-14 px-8 rounded-full border border-ink-600 font-medium inline-flex items-center hover:border-bone transition">
                Our story
              </Link>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-3 text-xs text-muted reveal">
            <div className="w-px h-10 bg-muted/40 animate-pulse" />
            Scroll
          </div>
        </div>
      </section>

      <Marquee items={['New Arrivals', 'Limited Run', 'Studio Picks', 'Made Slowly', 'Shipped From Lisbon']} />

      {/* CATEGORIES */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3 reveal">01 — Categories</p>
              <h2 className="text-display-md reveal">Browse by room,<br/>by mood, by maker.</h2>
            </div>
            <Link to="/products" className="text-sm underline underline-offset-4 hover:text-lime reveal">View all categories →</Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((c, i) => (
              <Link
                key={c.name}
                to="/products"
                className="reveal group relative aspect-[3/4] rounded-2xl overflow-hidden border border-ink-600"
                data-delay={i * 80}
              >
                <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <p className="text-xs uppercase tracking-[0.2em] text-lime mb-1">{c.count}</p>
                  <h3 className="text-2xl font-bold">{c.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-ink-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3 reveal">02 — The Edit</p>
              <h2 className="text-display-md reveal">This week's picks.</h2>
            </div>
            <p className="max-w-sm text-muted reveal">
              Hand-selected every Monday. Eight objects we're quietly obsessed with — until they sell out.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.items?.length
              ? data.items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
              : Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="reveal bg-ink-700 rounded-2xl aspect-[4/5] animate-pulse" data-delay={i * 60} />
                ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={s.l} className="reveal p-8 rounded-2xl border border-ink-600 hover:border-lime/50 transition" data-delay={i * 80}>
                <div className="text-5xl md:text-6xl font-extrabold text-lime tracking-tight">{s.n}</div>
                <p className="mt-2 text-sm text-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-xs uppercase tracking-[0.3em] text-lime mb-8 reveal">03 — Manifesto</p>
          <p className="text-3xl md:text-5xl font-light leading-[1.2] tracking-tight reveal">
            We believe in <span className="text-lime font-semibold">fewer, better</span> things.
            Objects that outlast seasons. Made by hands we can name, from studios we visit.
            Shipped slowly, unwrapped carefully — and kept for a long, long time.
          </p>
          <div className="mt-12 flex items-center gap-4 reveal">
            <div className="w-12 h-12 rounded-full bg-lime" />
            <div>
              <p className="font-semibold">Ines Moreira</p>
              <p className="text-sm text-muted">Founder — Lisbon</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-ink-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3 reveal">04 — Voices</p>
          <h2 className="text-display-md mb-12 reveal">Read before you buy.</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <figure key={t.name} className="reveal p-8 rounded-2xl border border-ink-600 bg-ink flex flex-col gap-6" data-delay={i * 100}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-lime">
                  <path d="M7 7h4v4H7V7zm0 6h4v4H7v-4zm6-6h4v4h-4V7zm0 6h4v4h-4v-4z" opacity=".3"/><path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"/>
                </svg>
                <blockquote className="text-lg leading-relaxed">"{t.q}"</blockquote>
                <figcaption className="mt-auto">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3 reveal">05 — Journal</p>
              <h2 className="text-display-md reveal">Writing on the studio.</h2>
            </div>
            <a href="#" className="text-sm underline underline-offset-4 hover:text-lime reveal">Read more →</a>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {journal.map((j, i) => (
              <article key={j.title} className="reveal group" data-delay={i * 100}>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                  <img src={j.img} alt={j.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms]" />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-lime mb-2">{j.tag}</p>
                <h3 className="text-xl font-semibold leading-snug group-hover:text-lime transition">{j.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="reveal relative rounded-3xl overflow-hidden border border-ink-600 p-10 md:p-16 bg-gradient-to-br from-ink-800 to-ink">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-lime/20 blur-3xl" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3">The Memo</p>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
                  New drops,<br/>first dibs.
                </h3>
                <p className="mt-4 text-muted">One short email each Monday. Studio stories, early access, nothing else.</p>
              </div>
              <form className="flex flex-col sm:flex-row gap-3">
                <input type="email" placeholder="your@email.com" className="flex-1 bg-ink border border-ink-600 rounded-full h-14 px-6 focus:border-lime outline-none" />
                <button className="h-14 px-8 rounded-full bg-lime text-ink font-semibold hover:bg-lime-600 transition">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
