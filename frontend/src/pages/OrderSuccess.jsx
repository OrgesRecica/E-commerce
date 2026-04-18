import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const paymentIntentId = params.get('payment_intent');

  useEffect(() => {
    if (!paymentIntentId) { setStatus('error'); return; }

    stripePromise.then((stripe) => {
      stripe.retrievePaymentIntent(params.get('payment_intent_client_secret')).then(({ paymentIntent }) => {
        if (paymentIntent?.status === 'succeeded') setStatus('succeeded');
        else if (paymentIntent?.status === 'processing') setStatus('processing');
        else setStatus('error');
      });
    });
  }, [paymentIntentId]);

  if (status === 'loading') {
    return (
      <div className="pt-40 pb-24 text-center">
        <div className="w-10 h-10 border-2 border-lime border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="pt-40 pb-24 container mx-auto px-4 max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-coral mb-4">Payment issue</p>
        <h1 className="text-display-md mb-6">Something went wrong.</h1>
        <p className="text-muted mb-8">Your payment was not completed. No charge was made.</p>
        <Link to="/cart" className="inline-flex h-14 px-8 rounded-full bg-lime text-ink font-semibold items-center gap-2 hover:bg-lime-600 transition">
          Back to bag →
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24 container mx-auto px-4 max-w-xl text-center">
      <div className="w-16 h-16 rounded-full bg-lime/10 border border-lime/30 grid place-items-center mx-auto mb-8">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-lime">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <p className="text-xs uppercase tracking-[0.3em] text-lime mb-4">
        {status === 'processing' ? 'Payment processing' : 'Order confirmed'}
      </p>
      <h1 className="text-display-md mb-4">
        {status === 'processing' ? 'On its way.' : 'Thank you.'}
      </h1>
      <p className="text-muted mb-10 max-w-sm mx-auto">
        {status === 'processing'
          ? 'Your payment is being processed. We\'ll email you once confirmed.'
          : 'Your order has been placed and payment received. You\'ll get a confirmation email shortly.'}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/products" className="inline-flex h-14 px-8 rounded-full bg-lime text-ink font-semibold items-center gap-2 hover:bg-lime-600 transition">
          Continue shopping →
        </Link>
        <Link to="/" className="inline-flex h-14 px-8 rounded-full border border-ink-600 items-center gap-2 hover:border-bone transition text-sm">
          Back home
        </Link>
      </div>

      <p className="mt-10 text-xs text-muted">
        Reference: <span className="text-bone font-mono">{paymentIntentId?.slice(-12)}</span>
      </p>
    </div>
  );
}
