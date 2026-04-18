import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import { useReveal } from '../hooks/useReveal.js';

const CATEGORIES = ['All', 'Furniture', 'Lighting', 'Ceramics', 'Textiles', 'Books', 'Accessories'];
const SORTS = [
  { v: 'new', l: 'Newest' },
  { v: 'price-asc', l: 'Price: low to high' },
  { v: 'price-desc', l: 'Price: high to low' },
  { v: 'popular', l: 'Most popular' },
];

export default function Products() {
  useReveal();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('new');

  const { data, isLoading } = useQuery({
    queryKey: ['products', q, category, sort],
    queryFn: async () => (await api.get('/products', { params: { q, category: category === 'All' ? '' : category.toLowerCase(), sort } })).data,
  });

  // Re-run reveal after products load since cards render after initial mount
  useEffect(() => {
    if (!data) return;
    const els = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), Number(delay));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data]);

  return (
    <div className="pt-32 pb-24">
      {/* HEADER */}
      <section className="container mx-auto px-4 max-w-7xl mb-16">
        <div className="flex items-baseline justify-between flex-wrap gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3 reveal">The archive</p>
            <h1 className="text-display-lg reveal">
              <span className="line-mask"><span>All objects.</span></span>
            </h1>
          </div>
          <p className="max-w-sm text-muted reveal" data-delay="150">
            Every piece sourced directly from its maker. Free shipping over $150, returns within 30 days.
          </p>
        </div>

        {/* SEARCH + SORT BAR */}
        <div className="reveal flex flex-wrap gap-3 items-center p-3 bg-ink-800 border border-ink-600 rounded-full">
          <div className="flex-1 flex items-center gap-3 px-4 min-w-[200px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search — chairs, lamps, vases..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-ink text-sm rounded-full h-11 px-4 border border-ink-600 hover:border-lime outline-none"
          >
            {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="mt-6 flex flex-wrap gap-2 reveal" data-delay="100">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`h-10 px-5 rounded-full text-sm font-medium transition-all ${
                category === c
                  ? 'bg-lime text-ink'
                  : 'bg-ink-800 border border-ink-600 text-bone/70 hover:border-lime'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* RESULTS */}
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6 text-sm text-muted">
          <span>{data?.total ?? 0} objects</span>
          <span className="hidden md:block">Showing page {data?.page ?? 1}</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-ink-800 rounded-2xl aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : data?.items?.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data.items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        ) : (
          <div className="py-24 text-center border border-ink-600 rounded-2xl">
            <p className="text-2xl font-semibold mb-2">Nothing matches.</p>
            <p className="text-muted">Try a different search or clear the filters.</p>
          </div>
        )}
      </section>

      {/* EDITORIAL BANNER */}
      <section className="container mx-auto px-4 max-w-7xl mt-24">
        <div className="reveal rounded-3xl overflow-hidden border border-ink-600 p-12 md:p-20 bg-gradient-to-br from-violet/20 via-ink-800 to-ink">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Can't find<br/>what you're after?
            </h2>
            <div>
              <p className="text-muted mb-6">
                Tell us the room, the feeling, the budget. Our team replies within 24 hours with
                three considered options — human-curated, no AI guesswork.
              </p>
              <a href="/contact" className="inline-flex h-12 px-6 rounded-full bg-bone text-ink font-semibold items-center gap-2 hover:bg-lime transition">
                Request a sourcing →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
