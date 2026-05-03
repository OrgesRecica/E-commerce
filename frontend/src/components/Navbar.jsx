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

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 8h16" />
          <path d="M4 16h16" />
        </>
      )}
    </svg>
  );
}

function DesktopLink({ link }) {
  return (
    <NavLink
      to={link.to}
      end={link.end}
      className={({ isActive }) =>
        `relative flex h-16 items-center px-2 text-[13px] font-medium transition-colors ${
          isActive ? 'text-white' : 'text-white/66 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span>{link.label}</span>
          <span
            className={`absolute bottom-0 left-2 right-2 h-0.5 origin-left rounded-full bg-orange transition-transform duration-300 ${
              isActive ? 'scale-x-100' : 'scale-x-0'
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

function MobileLink({ link, onClick }) {
  return (
    <NavLink
      to={link.to}
      end={link.end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex h-12 items-center justify-between rounded-md border px-4 text-sm font-medium transition ${
          isActive
            ? 'border-orange bg-orange text-white'
            : 'border-white/10 bg-white/6 text-white/72 hover:border-white/20 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span>{link.label}</span>
          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-orange/70'}`} />
        </>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart.items.reduce((n, i) => n + i.quantity, 0));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy text-white shadow-glow-navy">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-5">
        <nav className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-5">
          <Link to="/" onClick={closeMenu} className="flex items-center" data-cursor="hover">
            <Logo size={36} textSize="text-base" variant="light" />
          </Link>

          <div className="hidden h-full items-center justify-center lg:flex">
            <div className="flex h-full items-center gap-6">
              {links.map((link) => (
                <DesktopLink key={link.to} link={link} />
              ))}
              {user?.role === 'admin' && <DesktopLink link={{ to: '/admin', label: 'Admin' }} />}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <a
              href="mailto:info@scampa.eu"
              className="hidden text-xs font-medium text-white/60 transition hover:text-white xl:inline-flex"
            >
              info@scampa.eu
            </a>

            <span className="hidden h-5 w-px bg-white/14 xl:block" />

            <Link
              to="/cart"
              onClick={closeMenu}
              className="relative grid h-10 w-10 place-items-center rounded-md border border-white/12 bg-white/6 text-white transition hover:border-orange hover:text-orange"
              aria-label="Cart"
            >
              <BagIcon />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-orange px-1 text-[10px] font-medium text-white tabular">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="hidden h-10 items-center rounded-md border border-white/12 bg-white/6 px-4 text-[13px] font-medium text-white/75 transition hover:border-coral/40 hover:text-white sm:inline-flex"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="hidden h-10 items-center rounded-md border border-white/12 bg-white/6 px-4 text-[13px] font-medium text-white/75 transition hover:border-orange hover:text-white sm:inline-flex"
              >
                Sign in
              </Link>
            )}

            <Link
              to="/contact"
              onClick={closeMenu}
              className="hidden h-10 items-center rounded-md bg-orange px-4 text-[13px] font-medium text-white shadow-glow transition hover:bg-orange-600 md:inline-flex"
            >
              Request quote
            </Link>

            <button
              onClick={() => setOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-md border border-white/12 bg-white/6 text-white transition hover:border-orange hover:text-orange lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="fixed inset-0 top-16 bg-navy/55 backdrop-blur-sm" onClick={closeMenu} />
          <div className="relative mx-3 mb-3 rounded-md border border-white/10 bg-navy-800 p-3 shadow-soft">
            <div className="grid gap-2">
              {links.map((link) => (
                <MobileLink key={link.to} link={link} onClick={closeMenu} />
              ))}
              {user?.role === 'admin' && <MobileLink link={{ to: '/admin', label: 'Admin' }} onClick={closeMenu} />}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="h-11 rounded-md border border-white/12 bg-white/6 text-sm font-medium text-white/75 transition hover:border-coral/40 hover:text-white"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="grid h-11 place-items-center rounded-md border border-white/12 bg-white/6 text-sm font-medium text-white/75 transition hover:border-orange hover:text-white"
                >
                  Sign in
                </Link>
              )}
              <Link
                to="/contact"
                onClick={closeMenu}
                className="grid h-11 place-items-center rounded-md bg-orange text-sm font-medium text-white shadow-glow transition hover:bg-orange-600"
              >
                Request quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
