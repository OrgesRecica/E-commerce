import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../api/axios.js';
import { setCredentials } from '../store/authSlice.js';
import Logo from '../components/Logo.jsx';
import Magnetic from '../components/Magnetic.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', form);
      dispatch(setCredentials(data));
      navigate(data.user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 grid lg:grid-cols-12">
      {/* Left brand panel */}
      <div className="relative hidden lg:block lg:col-span-5 bg-bone text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1600"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-bone/95 via-bone/85 to-bone" />

        <div className="relative h-full p-12 flex flex-col justify-between">
          <Link to="/">
            <Logo size={48} textSize="text-2xl" variant="light" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-lime mb-6">Manufacturing & Trading Co.</p>
            <blockquote className="kinetic text-3xl lg:text-4xl font-light leading-tight tracking-normal">
              "SCAMPA values <em className="text-lime">long-term relationships</em>,
              treating clients as partners."
            </blockquote>
            <div className="mt-12 flex items-center gap-4 pt-6 border-t border-white/20">
              <div>
                <p className="font-medium tracking-normal">Kujtim Gjevori</p>
                <p className="text-sm text-white/50 mt-1">Founder · Est. 1999</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-8 lg:p-20 bg-white">
        <div className="w-full max-w-md">
          <p className="section-mark mb-6">Welcome back</p>
          <h1 className="kinetic text-display-md text-bone mb-3">Sign in</h1>
          <p className="text-bone-300 mb-12">
            New here? <Link to="/register" className="text-lime link-underline font-medium">Create an account</Link>
          </p>

          <form onSubmit={submit} className="space-y-8">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.28em] text-muted">Email</span>
              <input
                required type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.28em] text-muted">Password</span>
              <input
                required type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone"
              />
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-bone-300">
                <input type="checkbox" className="accent-lime" /> Remember me
              </label>
              <a href="#" className="text-bone-300 hover:text-lime transition link-underline">Forgot?</a>
            </div>

            {error && <div className="text-sm text-coral">— {error}</div>}

            <Magnetic>
              <button disabled={loading} className="btn-primary w-full justify-between h-14 disabled:opacity-50">
                {loading ? 'Signing in…' : 'Sign in →'}
              </button>
            </Magnetic>
          </form>

          <div className="mt-12 pt-12 border-t border-black/10">
            <p className="text-xs uppercase tracking-[0.28em] text-muted mb-4">Or continue with</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="h-12 border border-black/15 hover:border-bone transition text-sm font-medium text-bone">Google</button>
              <button className="h-12 border border-black/15 hover:border-bone transition text-sm font-medium text-bone">Microsoft</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
