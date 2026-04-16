import { useState } from 'react';
import api from '../api/axios.js';
import { useReveal } from '../hooks/useReveal.js';

const channels = [
  { t: 'General', d: 'Questions about an order, product, or return.', c: 'hello@mono.studio' },
  { t: 'Wholesale', d: 'Retailers, interior projects, hospitality.', c: 'wholesale@mono.studio' },
  { t: 'Press', d: 'Editorial, interviews, lookbook requests.', c: 'press@mono.studio' },
  { t: 'Makers', d: 'Pitch your studio. We read everything.', c: 'studios@mono.studio' },
];

const faqs = [
  { q: 'How long does shipping take?', a: 'Europe: 2–4 days. North America: 5–7 days. Rest of world: 7–12 days. You\'ll get a tracking link the moment we dispatch.' },
  { q: 'Can I return something?', a: 'Yes — 30 days, any reason. Commissioned or made-to-order pieces are the only exception, and we flag those clearly on the product page.' },
  { q: 'Do you ship everywhere?', a: 'We ship to 48 countries. If yours isn\'t in the checkout list, write us — we\'ve set up one-off routes before.' },
  { q: 'Can I visit the showroom?', a: 'Of course. Lisbon is open Tue–Sat, 11–19. Copenhagen is by appointment — drop us a line.' },
];

export default function Contact() {
  useReveal();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', form);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="pt-32 pb-24">
      <section className="container mx-auto px-4 max-w-7xl mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-lime mb-6 reveal">Contact</p>
        <h1 className="text-display-lg reveal">
          <span className="line-mask"><span>Let's talk.</span></span>
        </h1>
        <p className="mt-6 max-w-xl text-muted text-lg reveal" data-delay="200">
          Real humans, real replies — usually within 24 hours. Pick the channel that fits, or
          drop us a note below.
        </p>
      </section>

      {/* CHANNELS */}
      <section className="container mx-auto px-4 max-w-7xl mb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map((ch, i) => (
            <a
              key={ch.t}
              href={`mailto:${ch.c}`}
              className="reveal p-6 rounded-2xl border border-ink-600 hover:border-lime transition-colors group flex flex-col"
              data-delay={i * 80}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-lime mb-3">{ch.t}</p>
              <p className="text-muted text-sm mb-6 flex-1">{ch.d}</p>
              <p className="font-semibold group-hover:text-lime transition break-all">{ch.c}</p>
            </a>
          ))}
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="container mx-auto px-4 max-w-7xl grid lg:grid-cols-5 gap-8">
        <form onSubmit={submit} className="lg:col-span-3 reveal p-8 md:p-12 rounded-3xl border border-ink-600 bg-ink-800 space-y-5" data-effect="left">
          <h2 className="text-3xl font-bold mb-2">Send us a note</h2>
          <p className="text-muted mb-6">We read every message, in the order it arrives.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Your name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full h-12 px-4 bg-ink border border-ink-600 rounded-xl focus:border-lime outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full h-12 px-4 bg-ink border border-ink-600 rounded-xl focus:border-lime outline-none"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-muted">Message</span>
            <textarea
              required
              rows="6"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 w-full p-4 bg-ink border border-ink-600 rounded-xl focus:border-lime outline-none resize-none"
            />
          </label>
          <button
            disabled={status === 'sending'}
            className="h-14 px-8 rounded-full bg-lime text-ink font-semibold hover:bg-lime-600 transition disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending...' : 'Send message →'}
          </button>
          {status === 'sent' && <p className="text-lime text-sm">Thanks — we'll be in touch within 24 hours.</p>}
          {status === 'error' && <p className="text-coral text-sm">Something went wrong. Please try again.</p>}
        </form>

        <aside className="lg:col-span-2 space-y-4 reveal" data-effect="right">
          <div className="p-8 rounded-2xl border border-ink-600 bg-ink-800">
            <p className="text-xs uppercase tracking-[0.2em] text-lime mb-4">Lisbon showroom</p>
            <p className="font-semibold mb-1">Rua do Século 41</p>
            <p className="text-muted text-sm">1200-436 Lisboa, PT</p>
            <p className="text-muted text-sm mt-4">Tue – Sat · 11:00 – 19:00</p>
          </div>
          <div className="p-8 rounded-2xl border border-ink-600 bg-ink-800">
            <p className="text-xs uppercase tracking-[0.2em] text-lime mb-4">Copenhagen studio</p>
            <p className="font-semibold mb-1">Jægersborggade 28</p>
            <p className="text-muted text-sm">2200 København, DK</p>
            <p className="text-muted text-sm mt-4">By appointment</p>
          </div>
          <div className="p-8 rounded-2xl border border-ink-600 bg-gradient-to-br from-violet/30 to-ink-800">
            <p className="text-xs uppercase tracking-[0.2em] text-lime mb-4">Quick reply</p>
            <p className="font-semibold mb-2">WhatsApp us</p>
            <p className="text-muted text-sm">+351 914 000 000 — 9–18, Mon–Fri (PT)</p>
          </div>
        </aside>
      </section>

      {/* FAQ */}
      <section className="py-24 container mx-auto px-4 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3 reveal">FAQ</p>
        <h2 className="text-display-md mb-10 reveal">Quick answers.</h2>
        <div className="divide-y divide-ink-600 border-y border-ink-600">
          {faqs.map((f, i) => (
            <details key={f.q} className="reveal group py-6" data-delay={i * 60}>
              <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-lg">
                {f.q}
                <span className="w-8 h-8 rounded-full border border-ink-600 grid place-items-center group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-muted leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
