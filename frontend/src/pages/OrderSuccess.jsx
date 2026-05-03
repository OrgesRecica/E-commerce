import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import Magnetic from '../components/Magnetic.jsx';

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
      <div className="page-top pb-32 text-center">
        <div className="w-10 h-10 border border-bone border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <section className="page-top pb-32">
      <div className="container mx-auto px-5 max-w-[88rem]">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-muted mb-12">
          <Link to="/" className="link-underline">Home</Link>
          <span>/</span>
          <span className="text-bone">{status === 'error' ? 'Issue' : 'Confirmation'}</span>
        </div>

        {status === 'error' ? (
          <>
            <p className="section-mark mb-6 text-coral" style={{ color: '#c94f2c' }}>— Payment issue</p>
            <h1 className="kinetic text-display-xl text-bone mb-10">
              <span className="line-mask"><span>Something <em>went wrong</em>.</span></span>
            </h1>
            <p className="text-bone-300 leading-relaxed max-w-xl mb-12">Your payment was not completed. No charge was made to your card.</p>
            <Magnetic><Link to="/cart" className="btn-primary">Back to cart →</Link></Magnetic>
          </>
        ) : (
          <>
            <p className="section-mark mb-6">{status === 'processing' ? 'Processing' : 'Confirmed'}</p>
            <h1 className="kinetic text-display-2xl text-bone mb-10">
              <span className="line-mask"><span>Thank you. <em className="text-lime">Order received</em>.</span></span>
            </h1>
            <p className="text-bone-300 leading-relaxed max-w-2xl mb-16 text-lg">
              {status === 'processing'
                ? 'Your payment is processing. We will email you once confirmed and the order is dispatched from our Drenas facility.'
                : 'Your order has been placed and payment received. You will receive a confirmation email with shipping details shortly.'}
            </p>

            <div className="flex flex-wrap gap-3 mb-16">
              <Magnetic><Link to="/products" className="btn-primary">Continue shopping →</Link></Magnetic>
              <Link to="/" className="btn-ghost">Back home</Link>
            </div>

            <div className="pt-10 border-t border-black/10 max-w-md">
              <p className="text-xs uppercase tracking-[0.28em] text-muted mb-2">Reference</p>
              <p className="text-bone font-mono text-sm tracking-normal">{paymentIntentId?.slice(-12)}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
