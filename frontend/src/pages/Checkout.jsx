import { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { clear } from '../store/cartSlice.js';
import api from '../api/axios.js';
import Magnetic from '../components/Magnetic.jsx';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EMPTY_DETAILS = { fullName: '', email: '', phone: '', line1: '', city: '', postalCode: '', country: '' };

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.22em] text-muted">{label}</span>
      <input
        {...props}
        className="mt-3 w-full h-12 bg-transparent border-b border-black/15 focus:border-bone outline-none text-bone"
      />
    </label>
  );
}

function PaymentForm({ total }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/order-success` },
    });
    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
    } else {
      dispatch(clear());
    }
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="border border-black/10 p-6">
        <PaymentElement
          options={{
            layout: 'tabs',
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#ff7a1a',
                colorBackground: '#ffffff',
                colorText: '#071f45',
                colorDanger: '#c94f2c',
                fontFamily: 'Poppins, sans-serif',
                borderRadius: '4px',
              },
            },
          }}
        />
      </div>
      {error && <div className="text-sm text-coral">— {error}</div>}
      <Magnetic>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn-primary w-full justify-between h-14 disabled:opacity-50"
        >
          {loading ? 'Processing…' : `Pay €${total.toFixed(2)}`}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </Magnetic>
      <p className="text-center text-xs text-muted uppercase tracking-[0.22em]">Secured by Stripe — card details never stored</p>
    </form>
  );
}

export default function Checkout() {
  const { state } = useLocation();
  const { user, status } = useSelector((s) => s.auth);
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (status === 'loading') {
    return (
      <div className="page-top pb-32 text-center">
        <div className="w-10 h-10 border border-bone border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!state?.items?.length) {
    return (
      <section className="page-top pb-32">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted mb-10">
            <Link to="/" className="link-underline">Home</Link>
            <span>/</span>
            <span className="text-bone">Checkout</span>
          </div>
          <h1 className="kinetic text-display-lg text-bone mb-10">No active <em>checkout</em>.</h1>
          <Magnetic><Link to="/cart" className="btn-primary">Back to cart →</Link></Magnetic>
        </div>
      </section>
    );
  }

  const { items, total } = state;

  const submitDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const order = await api.post('/orders', {
        items: items.map((i) => ({ product: i.productId, quantity: i.quantity })),
        shippingAddress: details,
      });
      const intent = await api.post('/payments/intent', { orderId: order.data._id });
      setClientSecret(intent.data.clientSecret);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setDetails((d) => ({ ...d, [field]: e.target.value }));

  return (
    <>
      <section className="page-top pb-12">
        <div className="container mx-auto px-5 max-w-[88rem]">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted mb-10">
            <Link to="/" className="link-underline">Home</Link>
            <span>/</span>
            <Link to="/cart" className="link-underline">Cart</Link>
            <span>/</span>
            <span className="text-bone">Checkout</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="section-mark mb-6">Step {step} / 2 · {step === 1 ? 'Shipping' : 'Payment'}</p>
              <h1 className="kinetic text-display-xl text-bone">
                {step === 1 ? <><span className="line-mask"><span>Your <em>details</em>.</span></span></> : <><span className="line-mask"><span>Complete <em>order</em>.</span></span></>}
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pl-6 lg:border-l border-black/10">
              <p className="text-xs uppercase tracking-[0.22em] text-muted mb-2">Total</p>
              <p className="text-3xl font-light text-bone tabular tracking-normal">€{total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-black/10">
        <div className="container mx-auto px-5 max-w-[88rem] grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            {step === 1 ? (
              <form onSubmit={submitDetails} className="space-y-8 max-w-2xl">
                <Field label="Full name *" required value={details.fullName} onChange={set('fullName')} placeholder="Jane Doe" />
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                  <Field label="Email *" type="email" required value={details.email} onChange={set('email')} placeholder="jane@example.com" />
                  <Field label="Phone *" type="tel" required value={details.phone} onChange={set('phone')} placeholder="+383 45 000 000" />
                </div>
                <Field label="Address *" required value={details.line1} onChange={set('line1')} placeholder="Street address" />
                <div className="grid sm:grid-cols-3 gap-x-8 gap-y-8">
                  <Field label="City *"        required value={details.city}       onChange={set('city')}       placeholder="Pristina" />
                  <Field label="Postal code *" required value={details.postalCode} onChange={set('postalCode')} placeholder="10000" />
                  <Field label="Country *"     required value={details.country}    onChange={set('country')}    placeholder="XK" />
                </div>

                {error && <div className="text-sm text-coral">— {error}</div>}

                <Magnetic>
                  <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                    {loading ? 'Saving…' : 'Continue to payment →'}
                  </button>
                </Magnetic>
              </form>
            ) : (
              <div className="max-w-2xl">
                <div className="mb-10 p-6 border border-black/10 text-sm space-y-1">
                  <p className="text-bone font-medium tracking-normal">{details.fullName}</p>
                  <p className="text-bone-300">{details.email} · {details.phone}</p>
                  <p className="text-bone-300">{details.line1}, {details.city}, {details.postalCode}, {details.country}</p>
                  <button onClick={() => setStep(1)} className="text-xs uppercase tracking-[0.22em] text-orange mt-3 link-underline">Edit details</button>
                </div>

                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <PaymentForm total={total} />
                </Elements>
              </div>
            )}
          </div>

          {/* Order summary */}
          <aside className="lg:col-span-5 lg:pl-12 lg:border-l border-black/10">
            <p className="text-xs uppercase tracking-[0.24em] text-muted mb-6">Summary</p>
            <ul className="space-y-5 mb-6 pb-6 border-b border-black/10">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-ink-800 overflow-hidden shrink-0 p-2">
                    {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-contain" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-bone tracking-normal truncate">{item.title}</p>
                    <p className="text-xs text-muted">×{item.quantity}</p>
                  </div>
                  <span className="text-sm text-bone tabular shrink-0">€{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-baseline">
              <span className="text-base font-medium text-bone">Total</span>
              <span className="text-2xl font-light text-bone tabular tracking-normal">€{total.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
