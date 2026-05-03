import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import Magnetic from '../components/Magnetic.jsx';
import { useReveal } from '../hooks/useReveal.js';

const CATEGORIES = [
  { label: 'All',           slug: '' },
  { label: 'Shopping bags', slug: 'shopping-bags' },
  { label: 'Garbage bags',  slug: 'garbage-bags' },
  { label: 'Packing rolls', slug: 'packing-rolls' },
];

const SORTS = [
  { v: 'new',        l: 'Newest' },
  { v: 'price-asc',  l: 'Price · Low to High' },
  { v: 'price-desc', l: 'Price · High to Low' },
  { v: 'popular',    l: 'Most popular' },
];

export default function Products() {
  useReveal();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('new');

  const { data, isLoading } = useQuery({
    queryKey: ['products', q, category, sort],
    queryFn: async () => (await api.get('/products', { params: { q, category, sort } })).data,
  });

  useEffect(() => {
    if (!data) return;
    const els = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), Number(delay));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data]);

  const activeLabel = CATEGORIES.find((c) => c.slug === category)?.label || 'All';

  return (
    <>
      {/* ──────────── HEADER (light, integrated) ──────────── */}
      <section className="page-top pb-12">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted mb-10 reveal">
            <Link to="/" className="link-underline">Home</Link>
            <span>/</span>
            <span className="text-bone">Products</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="section-mark mb-6 reveal">N° 02 — Catalogue</p>
              <h1 className="kinetic text-display-xl text-bone reveal">
                <span className="line-mask"><span>The full</span></span>
                <span className="line-mask"><span><em>archive</em>.</span></span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pl-6 lg:border-l border-black/10 reveal" data-delay="200">
              <p className="text-bone-300 leading-relaxed text-[15px]">
                Sustainable packaging solutions made from 100% recycled materials.
                ISO 9001 certified. Bulk and Private-Label orders welcome.
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted">
                {data?.total ?? 0} products · 3 product lines
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── FILTERS ──────────── */}
      <section className="py-8 border-y border-black/10 sticky top-[5.75rem] z-30 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-x-7 gap-y-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug || 'all'}
                  onClick={() => setCategory(c.slug)}
                  className={`relative pb-1 text-sm font-medium tracking-normal transition-colors ${
                    category === c.slug ? 'text-orange' : 'text-bone-200 hover:text-bone'
                  }`}
                >
                  {c.label}
                  <span className={`absolute bottom-0 left-0 right-0 h-px transition-transform origin-left ${
                    category === c.slug ? 'bg-orange scale-x-100' : 'bg-bone scale-x-0'
                  }`} />
                </button>
              ))}
            </div>

            {/* Search + sort */}
            <div className="flex items-center gap-4 flex-1 sm:flex-none sm:min-w-[420px] justify-end">
              <div className="flex-1 sm:max-w-[260px] relative">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="absolute left-0 top-1/2 -translate-y-1/2 text-muted">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search archive"
                  className="w-full h-9 pl-6 bg-transparent border-b border-black/15 focus:border-bone outline-none text-sm placeholder:text-muted text-bone"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 bg-transparent border-b border-black/15 focus:border-bone text-sm text-bone outline-none cursor-pointer"
              >
                {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── RESULTS ──────────── */}
      <section className="py-20">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex items-center justify-between mb-10 reveal">
            <h2 className="kinetic text-2xl md:text-3xl font-medium tracking-normal text-bone">
              <em>{activeLabel}</em>
            </h2>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              {data?.total ?? 0} {(data?.total ?? 0) === 1 ? 'product' : 'products'}
              {q && <span> — "{q}"</span>}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-ink-800 animate-pulse" />
              ))}
            </div>
          ) : data?.items?.length ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {data.items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="py-32 text-center border-y border-black/10">
              <p className="kinetic text-2xl md:text-3xl font-medium text-bone mb-4">
                Nothing <em>matches</em>.
              </p>
              <p className="text-bone-300 mb-8">Try a different search or clear the filters.</p>
              <button
                onClick={() => { setQ(''); setCategory(''); }}
                className="btn-ghost"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ──────────── BULK ORDER BANNER ──────────── */}
      <section className="py-32 border-t border-black/10">
        <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <p className="section-mark mb-6 reveal">Custom orders</p>
            <h2 className="kinetic text-display-md text-bone reveal">
              <span className="line-mask"><span>Need something</span></span>
              <span className="line-mask"><span><em>specific</em>?</span></span>
            </h2>
            <p className="mt-8 max-w-xl text-bone-300 leading-relaxed reveal" data-delay="100">
              Tell us your dimensions, material specs, and quantity. Our team replies within
              24 hours with a tailored quote — Private Label (PL) contracted solutions for
              major retail chains across Kosovo and Europe.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3 reveal" data-effect="right">
            <Magnetic><Link to="/contact" className="btn-primary w-full justify-between h-14">Request a quote <span>→</span></Link></Magnetic>
            <a href="mailto:info@scampa.eu" className="btn-ghost w-full justify-between h-14">info@scampa.eu <span className="text-xs uppercase tracking-[0.22em] text-muted">Email</span></a>
          </div>
        </div>
      </section>
    </>
  );
}
