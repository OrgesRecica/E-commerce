import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart.items.reduce((n, i) => n + i.quantity, 0));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-2' : 'py-5'
      }`}
    >
      <div
        className={`container mx-auto px-4 transition-all duration-500 ${
          scrolled ? 'max-w-5xl' : 'max-w-7xl'
        }`}
      >
        <nav
          className={`flex items-center justify-between rounded-full px-5 transition-all duration-500 ${
            scrolled
              ? 'glass h-14 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)]'
              : 'h-16 bg-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-lime grid place-items-center text-ink font-black text-sm group-hover:rotate-45 transition-transform duration-500">
              M
            </div>
            <span className="font-extrabold tracking-tight text-lg">MONO</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    isActive ? 'text-lime' : 'text-bone/70 hover:text-bone'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative w-10 h-10 grid place-items-center rounded-full border border-ink-600 hover:border-lime hover:text-lime transition-colors"
              aria-label="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-lime text-ink text-[10px] font-bold rounded-full grid place-items-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <button
                onClick={() => dispatch(logout())}
                className="hidden sm:inline-flex px-4 h-10 rounded-full border border-ink-600 text-sm font-medium hover:border-coral hover:text-coral transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-5 h-10 rounded-full bg-lime text-ink text-sm font-semibold hover:bg-lime-600 transition-colors"
              >
                Sign in
              </Link>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-10 h-10 grid place-items-center rounded-full border border-ink-600"
              aria-label="Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></> : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>}
              </svg>
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-ink-700 text-lime' : 'text-bone/80'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
