import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js';
import Logo from './Logo.jsx';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/clients', label: 'Clients' },
  { to: '/news', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart.items.reduce((n, i) => n + i.quantity, 0));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('EN');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Slim utility row */}
      <div
        className={`bg-bone text-white text-[11px] tracking-wide overflow-hidden transition-all duration-500 ${
          scrolled ? 'h-0 opacity-0' : 'h-7 opacity-100'
        }`}
      >
        <div className="container mx-auto px-5 max-w-[88rem] h-full flex items-center justify-between">
          <div className="hidden md:flex items-center gap-5 text-white/70">
            <span>Drenas, Kosovo</span>
            <span className="text-white/30">·</span>
            <a href="mailto:info@scampa.eu" className="hover:text-lime transition link-underline">info@scampa.eu</a>
            <span className="text-white/30">·</span>
            <a href="tel:+38345265760" className="hover:text-lime transition link-underline">+383 45 265 760</a>
          </div>
          <div className="flex items-center gap-4 ml-auto text-white/60">
            <span className="hidden sm:inline">ISO 9001 — Est. 1999</span>
            <span className="text-white/30 hidden sm:inline">·</span>
            <button
              onClick={() => setLang(lang === 'EN' ? 'KS' : 'EN')}
              className="hover:text-lime transition uppercase tracking-[0.18em]"
              aria-label="Toggle language"
            >
              {lang}
            </button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className={`transition-all duration-500 ${scrolled ? 'glass' : 'bg-white/95 border-b border-bone/10'}`}>
        <div className="container mx-auto px-5 max-w-[88rem]">
          <nav className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
            <Link to="/" className="flex items-center group" data-cursor="hover">
              <Logo size={scrolled ? 34 : 40} textSize={scrolled ? 'text-base' : 'text-lg'} />
            </Link>

            <div className="hidden lg:flex items-center gap-1 rounded-md border border-bone/10 bg-ink-700/70 p-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-[13px] font-medium tracking-normal transition-colors ${
                      isActive ? 'text-lime' : 'text-bone-200 hover:text-bone'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="link-underline">{l.label}</span>
                      {isActive && <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-lime" />}
                    </>
                  )}
                </NavLink>
              ))}
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `px-4 py-2 text-[13px] font-medium tracking-normal transition-colors ${
                      isActive ? 'text-lime' : 'text-bone-200 hover:text-bone'
                    }`
                  }
                >
                  Admin
                </NavLink>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                  className="relative w-10 h-10 grid place-items-center rounded-md border border-bone/10 bg-white text-bone hover:border-lime hover:text-lime transition"
                aria-label="Cart"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-lime text-white text-[10px] font-bold rounded-full grid place-items-center tabular">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <button
                  onClick={() => dispatch(logout())}
                  className="hidden sm:inline-flex items-center text-[13px] font-medium text-bone-200 hover:text-coral transition link-underline"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center px-5 h-10 rounded-md bg-bone text-white text-[13px] font-semibold hover:bg-lime transition tracking-normal shadow-glow"
                >
                  Sign in
                </Link>
              )}

              <button
                onClick={() => setOpen((v) => !v)}
                className="lg:hidden w-10 h-10 grid place-items-center text-bone"
                aria-label="Menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {open ? (
                    <>
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </>
                  ) : (
                    <>
                      <path d="M3 7h18" />
                      <path d="M3 17h18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </nav>

          {open && (
            <div className="lg:hidden pb-5 flex flex-col border-t border-black/5 mt-1 pt-3 -mx-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-base font-medium tracking-normal ${
                      isActive ? 'text-lime' : 'text-bone-200'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-base font-medium tracking-normal text-bone-200"
                >
                  Admin
                </NavLink>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
