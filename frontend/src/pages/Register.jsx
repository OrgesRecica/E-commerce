import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../api/axios.js';
import { setCredentials } from '../store/authSlice.js';
import Logo from '../components/Logo.jsx';
import Magnetic from '../components/Magnetic.jsx';

const perks = [
  { t: 'Bulk pricing',     d: 'Competitive wholesale rates for retailers and businesses.' },
  { t: 'Order tracking',   d: 'Real-time order status and delivery tracking on every purchase.' },
  { t: 'Custom quotes',    d: 'Request tailored quotes for Private Label and bulk orders.' },
  { t: 'Priority support', d: 'Dedicated account manager for orders above €1,000.' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', form);
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 grid lg:grid-cols-12">
      {/* Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-8 lg:p-20 bg-white order-2 lg:order-1">
        <div className="w-full max-w-md">
          <p className="section-mark mb-6">Become a member</p>
          <h1 className="kinetic text-display-md text-bone mb-3">Create account</h1>
          <p className="text-bone-300 mb-12">
            Already a member? <Link to="/login" className="text-orange link-underline font-medium">Sign in</Link>
          </p>

          <form onSubmit={submit} className="space-y-8">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Full name</span>
              <input
                required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Email</span>
              <input
                required type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Password - min. 12</span>
              <input
                required type="password" minLength={12} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone"
              />
            </label>

            {error && <div className="text-sm text-coral">— {error}</div>}

            <p className="text-xs text-bone-300 leading-relaxed">
              By creating an account you agree to our <a href="#" className="link-underline text-bone">terms</a> and{' '}
              <a href="#" className="link-underline text-bone">privacy policy</a>.
            </p>

            <Magnetic>
              <button disabled={loading} className="btn-primary w-full justify-between h-14 disabled:opacity-50">
                {loading ? 'Creating…' : 'Create account →'}
              </button>
            </Magnetic>
          </form>
        </div>
      </div>

      {/* Brand panel */}
      <div className="relative hidden lg:block lg:col-span-5 bg-bone text-white overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 dot-grid opacity-10" />

        <div className="relative h-full p-12 flex flex-col justify-between">
          <Logo size={48} textSize="text-2xl" variant="light" />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-orange mb-8">Member benefits</p>
            <h2 className="kinetic text-4xl lg:text-5xl font-light tracking-normal mb-12 leading-tight">
              Four reasons to <em className="text-orange">join</em>.
            </h2>
            <div className="space-y-px bg-white/10">
              {perks.map((p, i) => (
                <div key={p.t} className="bg-bone p-5 flex gap-5 items-start">
                  <span className="text-xs text-white/40 tabular tracking-[0.22em] w-8 pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-medium tracking-normal mb-1">{p.t}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
