import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import Magnetic from './Magnetic.jsx';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-900 text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime to-transparent" />
      <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-lime/10 blur-3xl" />

      <div className="relative container mx-auto px-5 max-w-[88rem] pt-20 pb-12">
        <div className="rounded-lg border border-white/10 bg-white/10 p-6 md:p-10 mb-16">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.22em] text-lime mb-5 font-bold">Talk to us</p>
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Let's engineer your next packaging run.
              </h2>
            </div>
            <div className="lg:col-span-5 flex items-end justify-start lg:justify-end">
              <Magnetic>
                <Link to="/contact" className="btn-primary h-14 px-8">
                  Get in touch
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 pb-12 border-y border-white/10 py-14">
          <div className="lg:col-span-4">
            <Logo size={42} textSize="text-lg" variant="light" />
            <p className="mt-6 text-sm text-white/70 leading-relaxed max-w-xs">
              Sustainable packaging from 100% recycled materials. ISO 9001 certified.
              Founded 1999 in Drenas, Kosovo.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.22em] text-lime mb-5 font-bold">Headquarters</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Industrial Business Park<br />
              Drenas, Kosovo
            </p>
            <a href="mailto:info@scampa.eu" className="block mt-5 text-sm text-white hover:text-lime transition link-underline">
              info@scampa.eu
            </a>
            <div className="mt-3 space-y-1 text-sm text-white/70">
              <a href="tel:+38345265760" className="block hover:text-lime transition tabular">+383 45 265 760</a>
              <a href="tel:+38345265765" className="block hover:text-lime transition tabular">+383 45 265 765</a>
              <a href="tel:+38338500666" className="block hover:text-lime transition tabular">+383 38 500 666</a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.22em] text-lime mb-5 font-bold">Products</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/products" className="hover:text-lime transition link-underline">Shopping Bags</Link></li>
              <li><Link to="/products" className="hover:text-lime transition link-underline">Garbage Bags</Link></li>
              <li><Link to="/products" className="hover:text-lime transition link-underline">Packing Rolls</Link></li>
              <li><Link to="/products" className="hover:text-lime transition link-underline">Custom Orders</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.22em] text-lime mb-5 font-bold">Company</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-lime transition link-underline">About Us</Link></li>
              <li><Link to="/clients" className="hover:text-lime transition link-underline">Our Clients</Link></li>
              <li><Link to="/news" className="hover:text-lime transition link-underline">Journal</Link></li>
              <li><Link to="/contact" className="hover:text-lime transition link-underline">Contact</Link></li>
              <li><a href="#" className="hover:text-lime transition link-underline">Powerpack LLC</a></li>
            </ul>

            <div className="mt-8 flex gap-3">
              {[
                { label: 'Facebook', short: 'Fb' },
                { label: 'Instagram', short: 'Ig' },
                { label: 'LinkedIn', short: 'Li' },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-10 h-10 grid place-items-center rounded-md border border-white/20 hover:border-lime hover:text-lime transition text-xs font-semibold">
                  {s.short}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 pt-8 text-xs text-white/40 uppercase tracking-[0.18em]">
          <p>&copy; {new Date().getFullYear()} SCAMPA Manufacturing & Trading Co.</p>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">ISO 9001</a>
            <a href="#" className="hover:text-white transition">Sustainability</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
