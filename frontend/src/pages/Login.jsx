import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../api/axios.js';
import { setCredentials } from '../store/authSlice.js';

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
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/80 via-ink/40 to-violet/40" />
        <div className="absolute inset-0 p-12 flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-lime grid place-items-center text-ink font-black">M</div>
            <span className="font-extrabold text-xl">MONO</span>
          </Link>
          <div className="max-w-md">
            <blockquote className="text-3xl font-semibold leading-snug">
              "A quiet shop for loud things. We choose once, slowly."
            </blockquote>
            <p className="mt-4 text-sm text-bone/60">— Ines, founder</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <p className="text-xs uppercase tracking-[0.3em] text-lime mb-4">Welcome back</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Sign in.</h1>
          <p className="text-muted mb-10">New here? <Link to="/register" className="text-lime hover:underline">Create an account</Link></p>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full h-12 px-4 bg-ink-800 border border-ink-600 rounded-xl focus:border-lime outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Password</span>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-2 w-full h-12 px-4 bg-ink-800 border border-ink-600 rounded-xl focus:border-lime outline-none"
              />
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted">
                <input type="checkbox" className="accent-lime" /> Remember me
              </label>
              <a href="#" className="text-muted hover:text-lime">Forgot?</a>
            </div>

            {error && <p className="p-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-sm">{error}</p>}

            <button
              disabled={loading}
              className="w-full h-14 rounded-full bg-lime text-ink font-semibold hover:bg-lime-600 transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-ink-600">
            <p className="text-xs text-muted uppercase tracking-[0.2em] mb-4">Or continue with</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="h-12 rounded-xl border border-ink-600 hover:border-bone transition text-sm font-medium">Google</button>
              <button className="h-12 rounded-xl border border-ink-600 hover:border-bone transition text-sm font-medium">Apple</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
