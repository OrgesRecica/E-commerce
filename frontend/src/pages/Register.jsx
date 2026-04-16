import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../api/axios.js';
import { setCredentials } from '../store/authSlice.js';

const perks = [
  { t: 'Early access', d: 'Monday drops, one hour before the public.' },
  { t: 'Studio notes', d: 'Weekly letters from makers we love.' },
  { t: 'Saved wishlists', d: 'Bookmark pieces across sessions and devices.' },
  { t: 'Free returns', d: 'Always — 30 days, any reason.' },
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
    <div className="min-h-screen pt-24 grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <p className="text-xs uppercase tracking-[0.3em] text-lime mb-4">Join MONO</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Create account.</h1>
          <p className="text-muted mb-10">Already a member? <Link to="/login" className="text-lime hover:underline">Sign in</Link></p>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Full name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full h-12 px-4 bg-ink-800 border border-ink-600 rounded-xl focus:border-lime outline-none"
              />
            </label>
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
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Password (min. 6)</span>
              <input
                required
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-2 w-full h-12 px-4 bg-ink-800 border border-ink-600 rounded-xl focus:border-lime outline-none"
              />
            </label>

            {error && <p className="p-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-sm">{error}</p>}

            <p className="text-xs text-muted">
              By creating an account you agree to our <a href="#" className="underline">terms</a> and{' '}
              <a href="#" className="underline">privacy policy</a>.
            </p>

            <button
              disabled={loading}
              className="w-full h-14 rounded-full bg-lime text-ink font-semibold hover:bg-lime-600 transition disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create account →'}
            </button>
          </form>
        </div>
      </div>

      <div className="relative hidden lg:block order-1 lg:order-2 bg-gradient-to-br from-violet/30 via-ink-800 to-ink">
        <div className="absolute inset-0 p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-lime mb-6">Members only</p>
            <h2 className="text-4xl font-bold mb-10">Four small perks<br/>for joining us.</h2>
            <div className="space-y-6">
              {perks.map((p, i) => (
                <div key={p.t} className="flex gap-4">
                  <span className="text-lime font-mono text-sm pt-1">0{i + 1}</span>
                  <div>
                    <h3 className="font-semibold mb-1">{p.t}</h3>
                    <p className="text-sm text-muted">{p.d}</p>
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
