import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import Magnetic from '../components/Magnetic.jsx';
import { useReveal } from '../hooks/useReveal.js';

const channels = [
  { t: 'General',     d: 'Questions about products, orders, or company.',          c: 'info@scampa.eu' },
  { t: 'Wholesale',   d: 'Bulk orders, retail chains, custom contracts.',          c: 'info@scampa.eu' },
  { t: 'Sustainability', d: 'Recycling programs, partnerships, sustainability.',    c: 'info@scampa.eu' },
  { t: 'Press & Media',  d: 'Media inquiries, press releases, interviews.',         c: 'info@scampa.eu' },
];

const phones = [
  { number: '+383 45 265 760', label: 'Main' },
  { number: '+383 45 265 765', label: 'Sales' },
  { number: '+383 45 265 770', label: 'Operations' },
  { number: '+383 38 500 666', label: 'Office' },
];

const faqs = [
  { q: 'Do you offer custom dimensions for shopping bags?',
    a: 'Yes — we offer fully customizable shopping bags with your specifications: dimensions, material thickness, color, and printing (up to 4-color flexographic). MOQs typically start at 1,000 units depending on size.' },
  { q: 'What is your minimum order quantity?',
    a: 'MOQs vary by product line. Standard items can be ordered in smaller quantities through our e-commerce shop. For bulk wholesale or custom-printed orders, MOQs typically start at 500–1,000 units. Contact us for a tailored quote.' },
  { q: 'Do you ship to EU countries?',
    a: 'Yes. Through our Powerpack LLC joint venture (with Powerpack NV Belgium), we export 100% to the European Union. We also serve clients across Kosovo and the Western Balkans directly.' },
  { q: 'Are your products certified?',
    a: 'SCAMPA is ISO 9001 certified for quality management. Our products use 100% recycled materials with post-consumer recycled (PCR) integration, and we are continuously expanding our certifications.' },
  { q: 'Can I become a Private Label partner?',
    a: 'Absolutely. We offer Private Label (PL) contracted solutions for major retail chains. We handle dimensions, design, printing, and consistent supply. Reach out to info@scampa.eu to start the conversation.' },
];

export default function Contact() {
  useReveal();
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', subject: 'general', message: '' });
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', form);
      setStatus('sent');
      setForm({ name: '', email: '', company: '', phone: '', subject: 'general', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* ──────────── HEADER ──────────── */}
      <section className="page-top pb-12">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-muted mb-10 reveal">
            <Link to="/" className="link-underline">Home</Link>
            <span>/</span>
            <span className="text-bone">Contact</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="section-mark mb-6 reveal">N° 03 — Get in touch</p>
              <h1 className="kinetic text-display-xl text-bone reveal">
                <span className="line-mask"><span>Tell us about</span></span>
                <span className="line-mask"><span>your <em>project</em>.</span></span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pl-6 lg:border-l border-black/10 reveal" data-delay="200">
              <p className="text-bone-300 leading-relaxed text-[15px]">
                Bulk order, custom print, Private Label, or just a question — our team
                replies within <span className="text-bone font-medium">24 hours</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── CHANNELS ──────────── */}
      <section className="py-12 border-t border-black/10">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
            {channels.map((ch, i) => (
              <a
                key={ch.t}
                href={`mailto:${ch.c}`}
                className="reveal bg-white hover:bg-bone hover:text-white p-8 transition-colors duration-700 group flex flex-col"
                data-delay={i * 80}
                data-cursor="hover"
              >
                <p className="text-xs uppercase tracking-[0.32em] text-muted group-hover:text-lime transition mb-6">{ch.t}</p>
                <p className="text-base text-bone group-hover:text-white transition mb-8 leading-relaxed flex-1">{ch.d}</p>
                <p className="text-sm font-medium text-bone group-hover:text-lime transition link-underline">{ch.c} →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── FORM + INFO ──────────── */}
      <section className="py-32">
        <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-12">
          {/* Form */}
          <form onSubmit={submit} className="lg:col-span-7 reveal" data-effect="left">
            <p className="section-mark mb-6">Brief</p>
            <h2 className="kinetic text-display-md text-bone mb-10">
              <em>Send a message</em>.
            </h2>

            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                <Field label="Full name *" required value={form.name}    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Field label="Email *"     required type="email" value={form.email}   onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Field label="Company"              value={form.company}  onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <Field label="Phone"     type="tel" value={form.phone}    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.28em] text-muted">Subject *</span>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone"
                >
                  <option value="general">General Inquiry</option>
                  <option value="wholesale">Wholesale / Bulk Order</option>
                  <option value="custom">Custom Order / Private Label</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="press">Press & Media</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.28em] text-muted">Message *</span>
                <textarea
                  required
                  rows="6"
                  placeholder="Tell us about your packaging needs — quantity, dimensions, materials, timeline."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-3 w-full p-0 pt-3 bg-transparent border-b border-black/15 focus:border-bone outline-none resize-none text-bone leading-relaxed"
                />
              </label>

              <div className="flex items-center gap-6 flex-wrap">
                <Magnetic>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary disabled:opacity-50"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </button>
                </Magnetic>
                {status === 'sent' && <span className="text-sm text-sage">— Sent. We'll respond within 24 hours.</span>}
                {status === 'error' && <span className="text-sm text-coral">— Something went wrong. Please try again.</span>}
              </div>
            </div>
          </form>

          {/* Info */}
          <aside className="lg:col-span-5 lg:pl-12 lg:border-l border-black/10 space-y-12 reveal" data-effect="right">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted mb-4">Headquarters</p>
              <p className="kinetic text-2xl font-medium text-bone tracking-normal">
                Industrial Business Park
              </p>
              <p className="text-bone-300 mt-1">Drenas, Kosovo</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted mb-4">Phone lines</p>
              <ul className="space-y-2">
                {phones.map((p) => (
                  <li key={p.number}>
                    <a href={`tel:${p.number.replace(/\s/g, '')}`} className="flex justify-between gap-4 group">
                      <span className="text-base font-medium text-bone tabular link-underline">{p.number}</span>
                      <span className="text-xs uppercase tracking-[0.28em] text-muted">{p.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted mb-4">Email</p>
              <a href="mailto:info@scampa.eu" className="kinetic text-2xl font-medium text-bone tracking-normal link-underline">
                info@scampa.eu
              </a>
              <p className="mt-2 text-xs uppercase tracking-[0.28em] text-muted">Response within 24h</p>
            </div>

            <div className="pt-8 border-t border-black/10">
              <p className="text-xs uppercase tracking-[0.28em] text-muted mb-4">Certifications</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 border border-black/15 text-xs uppercase tracking-[0.18em] text-bone">ISO 9001</span>
                <span className="px-3 py-1 border border-black/15 text-xs uppercase tracking-[0.18em] text-bone">100% Recycled</span>
                <span className="px-3 py-1 border border-black/15 text-xs uppercase tracking-[0.18em] text-bone">EU Export</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ──────────── FAQ ──────────── */}
      <section className="py-32 bg-ink-800 border-t border-black/10">
        <div className="container mx-auto px-5 max-w-4xl">
          <div className="mb-16">
            <p className="section-mark mb-6 reveal">N° 04 — FAQ</p>
            <h2 className="kinetic text-display-md text-bone reveal">
              Frequently <em>asked</em>.
            </h2>
          </div>

          <div className="space-y-px bg-black/10 border-y border-black/10">
            {faqs.map((f, i) => (
              <details key={f.q} className="reveal group bg-ink-800 hover:bg-white transition-colors duration-700" data-delay={i * 60}>
                <summary className="flex justify-between items-center cursor-pointer list-none p-6 lg:p-8" data-cursor="hover">
                  <span className="text-base lg:text-lg font-medium text-bone tracking-normal pr-6">{f.q}</span>
                  <span className="w-8 h-8 grid place-items-center text-bone group-open:rotate-45 transition-transform duration-500 text-xl font-light flex-shrink-0">+</span>
                </summary>
                <div className="px-6 lg:px-8 pb-8 -mt-2 max-w-2xl">
                  <p className="text-bone-300 leading-relaxed">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.28em] text-muted">{label}</span>
      <input
        {...props}
        className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone"
      />
    </label>
  );
}
