import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee.jsx';
import Magnetic from '../components/Magnetic.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { useCounter } from '../hooks/useCounter.js';

const clientGroups = [
  {
    sector: 'Retail & Supermarkets',
    clients: ['Agora', 'Aktiv', 'Albini Market', 'Conad', 'Comodita', 'Dukagjini', 'Durmart', 'Emona Center', 'Gogaj Market', 'Kam Market', 'Lorik Center', 'Spar', 'Tregu Group', 'Interex'],
  },
  {
    sector: 'Pharmacies',
    clients: ['Doa Pharmacy', 'Gogaj Pharm', 'Jara Pharmacy', 'Kastrati Pharmacy'],
  },
  {
    sector: 'Fuel & Energy',
    clients: ['IP Petrol', 'Petrol Company', 'Shell'],
  },
  {
    sector: 'Sports & Leisure',
    clients: ['Bibaj Sport', 'Intersport', 'SunaSport', 'Vlera Sport', 'Sport Vision', 'Runners', 'Steps'],
  },
  {
    sector: 'Restaurants & Food Service',
    clients: ['Sach Pizza', 'Sarajeva Grill', 'Sarajeva Steakhouse', 'Jaffa'],
  },
  {
    sector: 'Specialty Retail',
    clients: ['Aztech', 'Arrbi', 'Auto LLapi', 'Buzuku', 'Caramel Kids', 'Carnival', 'EBC', 'ENGHOME', 'Flutra Prizren', 'Gentli Shoes', 'Giffi', 'HEBS', 'Herta Center', 'Herta Kids', 'Hoffman', 'Label Nue', 'Lab Oil', 'Meridian', 'Nagavci', 'Neptune', 'Papirun', 'Piano', 'Runis Home', 'Veda', 'Wish by Tech', 'Dage', 'Gorenje 75mall'],
  },
];

const totalClients = clientGroups.reduce((s, g) => s + g.clients.length, 0);

function HeaderCounter({ value, label }) {
  const [v, ref] = useCounter(value);
  return (
    <div ref={ref}>
      <div className="text-5xl md:text-6xl font-light text-bone tabular tracking-normal">{v}+</div>
      <p className="text-xs uppercase tracking-[0.28em] text-muted mt-1">{label}</p>
    </div>
  );
}

export default function Clients() {
  useReveal();

  return (
    <>
      {/* ──────────── HEADER ──────────── */}
      <section className="page-top pb-12">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-muted mb-10 reveal">
            <Link to="/" className="link-underline">Home</Link>
            <span>/</span>
            <span className="text-bone">Clients</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="section-mark mb-6 reveal">N° 04 — Trusted partners</p>
              <h1 className="kinetic text-display-2xl text-bone reveal">
                <span className="line-mask"><span>{totalClients}+ partners.</span></span>
                <span className="line-mask"><span>One <em>promise</em>.</span></span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pl-6 lg:border-l border-black/10 reveal" data-delay="200">
              <p className="text-bone-300 leading-relaxed text-[15px]">
                From major retail chains and pharmacies to fuel stations and specialty stores —
                SCAMPA values long-term relationships, treating every client as a partner.
              </p>
            </div>
          </div>

          {/* Counters row */}
          <div className="mt-20 grid grid-cols-3 gap-12 reveal" data-delay="200">
            <HeaderCounter value={totalClients} label="Active clients" />
            <HeaderCounter value={clientGroups.length} label="Sectors served" />
            <HeaderCounter value={25} label="Years of partnerships" />
          </div>
        </div>
      </section>

      <Marquee variant="default" items={['Retail Chains', '— Pharmacies', 'Fuel Stations', '— Sport Retailers', 'Food Service', '— Specialty Shops']} />

      {/* ──────────── GROUPS ──────────── */}
      <section className="py-24">
        <div className="container mx-auto px-5 max-w-[88rem] space-y-32">
          {clientGroups.map((group, gi) => (
            <div key={group.sector} className="reveal" data-delay={gi * 60}>
              <div className="grid lg:grid-cols-12 gap-12 mb-12 items-end">
                <div className="lg:col-span-4">
                  <p className="text-xs uppercase tracking-[0.32em] text-muted mb-4">
                    Sector {String(gi + 1).padStart(2, '0')} · {group.clients.length} clients
                  </p>
                  <h2 className="kinetic text-3xl md:text-4xl font-medium tracking-normal text-bone">
                    {group.sector}
                  </h2>
                </div>
                <div className="lg:col-span-8 lg:pl-12 lg:border-l border-black/10">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {group.clients.map((client, ci) => (
                      <div key={client} className="group flex items-baseline gap-3 py-2 border-b border-black/10">
                        <span className="text-xs text-muted tabular w-6">{String(ci + 1).padStart(2, '0')}</span>
                        <span className="text-bone text-sm font-medium tracking-normal group-hover:text-lime transition">
                          {client}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── PHILOSOPHY ──────────── */}
      <section className="py-32 bg-bone text-white">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <p className="text-xs uppercase tracking-[0.32em] text-white/50 mb-8 reveal">N° 05 — Philosophy</p>
          <blockquote className="kinetic text-3xl md:text-5xl font-light leading-[1.15] tracking-normal reveal max-w-5xl">
            "SCAMPA values <em className="text-lime">long-term relationships</em>,
            treating clients as partners."
          </blockquote>
          <p className="mt-12 text-white/60 max-w-2xl reveal" data-delay="200">
            Quality, competitive pricing, and consistency — the three commitments that have built
            our reputation across two decades and dozens of industry sectors.
          </p>
        </div>
      </section>

      {/* ──────────── CTA ──────────── */}
      <section className="py-32 border-t border-black/10">
        <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <p className="section-mark mb-6 reveal">Become a partner</p>
            <h2 className="kinetic text-display-md text-bone reveal">
              <span className="line-mask"><span>Join {totalClients}+ businesses</span></span>
              <span className="line-mask"><span>that trust <em>SCAMPA</em>.</span></span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end reveal" data-effect="right">
            <Magnetic><Link to="/contact" className="btn-primary">Start a partnership</Link></Magnetic>
            <Link to="/products" className="btn-ghost">Browse catalogue</Link>
          </div>
        </div>
      </section>
    </>
  );
}
