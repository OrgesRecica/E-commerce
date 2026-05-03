import { Link } from 'react-router-dom';
import Magnetic from '../components/Magnetic.jsx';
import { useReveal } from '../hooks/useReveal.js';

const articles = [
  {
    slug: 'president-vjosa-osmani-visit',
    tag: 'Visit',
    date: '13.12.2024',
    title: 'President Vjosa Osmani visits Scampa & Powerpack Kosovo.',
    excerpt: 'A step toward empowering women and promoting gender equality in industrial Kosovo.',
    body: 'The President\'s visit highlighted SCAMPA\'s ongoing commitment to creating equal opportunities in the workplace. As one of Kosovo\'s leading manufacturers, we take pride in our diverse workforce and our role in shaping a more inclusive industrial sector. Together with our Powerpack joint venture, we continue to invest in initiatives that empower women across all levels of our organization.',
    img: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=2000&q=85',
    featured: true,
  },
  {
    slug: 'technology-that-brings-change',
    tag: 'Innovation',
    date: '13.12.2024',
    title: 'Technology that brings change.',
    excerpt: 'New machine for producing waste bags — high quality, increased capacity, improved efficiency.',
    body: 'Our new state-of-the-art waste bag production machinery represents a significant investment in the future of sustainable packaging. With increased capacity and advanced multilayer technology, we can now serve more clients faster while reducing our environmental footprint.',
    img: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1400&q=85',
  },
  {
    slug: 'brand-to-brand',
    tag: 'Sustainability',
    date: '13.12.2024',
    title: 'Brand to Brand — partnerships for a circular future.',
    excerpt: 'In a world of significant environmental challenges, partnerships supporting sustainability are critical.',
    body: 'The Brand to Brand initiative represents our commitment to working with partners across the value chain to drive sustainability forward. By collaborating with retailers, recycling facilities, and waste management companies, we\'re building a circular economy where every package has a second life.',
    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1400&q=85',
  },
];

export default function News() {
  useReveal();
  const [hero, ...rest] = articles;

  return (
    <>
      {/* ──────────── MASTHEAD ──────────── */}
      <section className="page-top pb-12">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-muted mb-10 reveal">
            <Link to="/" className="link-underline">Home</Link>
            <span>/</span>
            <span className="text-bone">Journal</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="section-mark mb-6 reveal">N° 05 — Studio journal</p>
              <h1 className="kinetic text-display-2xl text-bone reveal">
                <span className="line-mask"><span>Field <em>notes</em>.</span></span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pl-6 lg:border-l border-black/10 reveal" data-delay="200">
              <p className="text-bone-300 leading-relaxed text-[15px]">
                Industry news, product launches, sustainability updates, and stories from
                inside the SCAMPA factory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── FEATURED HERO ARTICLE ──────────── */}
      <section className="py-12">
        <div className="container mx-auto px-5 max-w-[96rem]">
          <article className="reveal grid lg:grid-cols-12 gap-10 lg:gap-16 items-end group" data-cursor="hover">
            <div className="lg:col-span-7 img-mask aspect-[4/3] order-2 lg:order-1" data-effect="mask">
              <img src={hero.img} alt={hero.title} className="w-full h-full object-cover" />
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 border border-black/15 text-xs uppercase tracking-[0.28em] text-bone">{hero.tag}</span>
                <span className="text-xs uppercase tracking-[0.28em] text-muted tabular">{hero.date}</span>
                <span className="text-xs uppercase tracking-[0.28em] text-lime">Featured</span>
              </div>
              <h2 className="kinetic text-display-md text-bone leading-tight tracking-normal mb-6">
                {hero.title}
              </h2>
              <p className="text-bone-300 leading-relaxed mb-6">{hero.excerpt}</p>
              <p className="text-bone-300 leading-relaxed mb-10 line-clamp-4 text-sm">{hero.body}</p>
              <Magnetic>
                <button className="btn-primary">Read article →</button>
              </Magnetic>
            </div>
          </article>
        </div>
      </section>

      {/* ──────────── MORE ARTICLES ──────────── */}
      <section className="py-32 border-t border-black/10">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
            <h2 className="kinetic text-display-md text-bone reveal">
              <span className="line-mask"><span>More <em>stories</em>.</span></span>
            </h2>
            <p className="text-xs uppercase tracking-[0.28em] text-muted reveal">{rest.length} entries</p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-black/10">
            {rest.map((article, i) => (
              <article
                key={article.slug}
                className="reveal group bg-white hover:bg-ink-800 transition-colors duration-700 p-8 lg:p-12"
                data-delay={i * 100}
                data-cursor="hover"
              >
                <div className="aspect-[16/10] mb-8 img-mask">
                  <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 border border-black/15 text-[10px] uppercase tracking-[0.28em] text-bone">{article.tag}</span>
                  <span className="text-xs uppercase tracking-[0.28em] text-muted tabular">{article.date}</span>
                </div>
                <h3 className="kinetic text-2xl md:text-3xl font-medium text-bone leading-tight tracking-normal mb-4 group-hover:text-lime transition-colors">
                  {article.title}
                </h3>
                <p className="text-bone-300 leading-relaxed mb-6 line-clamp-3 text-sm">{article.excerpt}</p>
                <span className="text-sm font-medium text-bone link-underline group-hover:text-lime transition">Read more →</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── NEWSLETTER ──────────── */}
      <section className="py-32 border-t border-black/10 bg-ink-800">
        <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <p className="section-mark mb-6 reveal">N° 06 — Newsletter</p>
            <h2 className="kinetic text-display-md text-bone reveal">
              <span className="line-mask"><span>Never miss</span></span>
              <span className="line-mask"><span>an <em>update</em>.</span></span>
            </h2>
          </div>
          <form className="lg:col-span-5 reveal flex gap-3" data-effect="right">
            <input
              type="email"
              placeholder="you@company.com"
              className="flex-1 h-14 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone placeholder:text-muted"
            />
            <Magnetic><button type="submit" className="btn-primary">Subscribe</button></Magnetic>
          </form>
        </div>
      </section>
    </>
  );
}
