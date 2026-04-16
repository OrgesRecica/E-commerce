import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-[2] mt-24 border-t border-ink-600 bg-ink-800">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-lime grid place-items-center text-ink font-black">M</div>
              <span className="font-extrabold tracking-tight text-2xl">MONO</span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              A curated modern store. We source the most considered objects of our time, from
              independent makers and design-forward brands.
            </p>
            <div className="mt-6 flex gap-3">
              {['Instagram', 'Twitter', 'Pinterest', 'TikTok'].map((s) => (
                <a key={s} href="#" className="w-10 h-10 grid place-items-center rounded-full border border-ink-600 text-xs hover:border-lime hover:text-lime transition">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-lime">All products</Link></li>
              <li><Link to="/products" className="hover:text-lime">New arrivals</Link></li>
              <li><Link to="/products" className="hover:text-lime">Best sellers</Link></li>
              <li><Link to="/products" className="hover:text-lime">Sale</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-lime">About</Link></li>
              <li><Link to="/contact" className="hover:text-lime">Contact</Link></li>
              <li><a href="#" className="hover:text-lime">Careers</a></li>
              <li><a href="#" className="hover:text-lime">Press</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Newsletter</h4>
            <p className="text-sm text-muted mb-4">Weekly drops, no noise.</p>
            <form className="flex gap-2">
              <input type="email" placeholder="you@domain.com" className="flex-1 bg-ink border border-ink-600 rounded-full px-4 py-2 text-sm focus:border-lime outline-none" />
              <button className="w-10 h-10 rounded-full bg-lime text-ink grid place-items-center hover:bg-lime-600 transition" aria-label="Subscribe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ink-600 flex flex-wrap justify-between items-center gap-4 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} MONO Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-bone">Privacy</a>
            <a href="#" className="hover:text-bone">Terms</a>
            <a href="#" className="hover:text-bone">Shipping</a>
            <a href="#" className="hover:text-bone">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
