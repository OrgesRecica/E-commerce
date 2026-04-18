import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { clear } from '../store/cartSlice.js';
import api from '../api/axios.js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EMPTY_DETAILS = { fullName: '', email: '', phone: '', line1: '', city: '', postalCode: '', country: '' };

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted">{label}</span>
      <input
        {...props}
        className="mt-2 w-full h-12 px-4 bg-ink-900 border border-ink-600 rounded-xl focus:border-lime outline-none text-sm"
      />
    </label>
  );
}

function PaymentForm({ total, onSuccess }) {
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
    <form onSubmit={submit} className="space-y-5">
      <div className="p-4 rounded-2xl border border-ink-600 bg-ink-800">
        <PaymentElement
          options={{
            layout: 'tabs',
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary: '#d4ff00',
                colorBackground: '#1a1a1a',
                colorText: '#f5f0e8',
                colorDanger: '#ff6b6b',
                fontFamily: 'inherit',
                borderRadius: '12px',
              },
            },
          }}
        />
      </div>
      {error && <p className="p-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-14 rounded-full bg-lime text-ink font-semibold hover:bg-lime-600 transition disabled:opacity-60"
      >
        {loading ? 'Processing…' : `Pay $${total.toFixed(2)}`}
      </button>
      <p className="text-center text-xs text-muted">
        Secured by <span className="text-bone font-medium">Stripe</span>. Card details are never stored.
      </p>
    </form>
  );
}

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!state?.items?.length) {
    return (
      <div className="pt-40 pb-24 container mx-auto px-4 max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-coral mb-4">Nothing here</p>
        <h1 className="text-4xl font-bold mb-6">No active checkout.</h1>
        <Link to="/cart" className="inline-flex h-14 px-8 rounded-full bg-lime text-ink font-semibold items-center gap-2 hover:bg-lime-600 transition">
          Back to bag →
        </Link>
      </div>
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
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-lime mb-3">
          {step === 1 ? 'Step 1 of 2 — Shipping' : 'Step 2 of 2 — Payment'}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold">
          {step === 1 ? 'Your details.' : 'Complete your order.'}
        </h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          {step === 1 ? (
            <form onSubmit={submitDetails} className="space-y-4">
              <Field label="Full name" required value={details.fullName} onChange={set('fullName')} placeholder="Jane Doe" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email" type="email" required value={details.email} onChange={set('email')} placeholder="jane@example.com" />
                <Field label="Phone number" type="tel" required value={details.phone} onChange={set('phone')} placeholder="+1 555 000 0000" />
              </div>
              <Field label="Address" required value={details.line1} onChange={set('line1')} placeholder="123 Main Street" />
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="City" required value={details.city} onChange={set('city')} placeholder="New York" />
                <Field label="Postal code" required value={details.postalCode} onChange={set('postalCode')} placeholder="10001" />
                <Field label="Country" required value={details.country} onChange={set('country')} placeholder="US" />
              </div>

              {error && <p className="p-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-full bg-lime text-ink font-semibold hover:bg-lime-600 transition disabled:opacity-60"
              >
                {loading ? 'Saving…' : 'Continue to payment →'}
              </button>
            </form>
          ) : (
            <div>
              {/* Shipping summary */}
              <div className="mb-6 p-4 rounded-2xl border border-ink-600 bg-ink-800 text-sm space-y-1">
                <p className="font-semibold">{details.fullName}</p>
                <p className="text-muted">{details.email} · {details.phone}</p>
                <p className="text-muted">{details.line1}, {details.city}, {details.postalCode}, {details.country}</p>
                <button onClick={() => setStep(1)} className="text-xs text-lime hover:underline mt-1">Edit details</button>
              </div>

              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                <PaymentForm total={total} />
              </Elements>
            </div>
          )}
        </div>

        {/* Order summary */}
        <aside className="lg:col-span-2">
          <div className="sticky top-28 p-6 rounded-2xl border border-ink-600 bg-ink-800">
            <h2 className="text-sm uppercase tracking-[0.2em] text-muted mb-4">Order summary</h2>
            <ul className="space-y-3 mb-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl bg-ink-700 overflow-hidden shrink-0">
                    {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted">×{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-lime shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-ink-600 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lime">${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
