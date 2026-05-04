import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export async function createPaymentIntent({ amount, currency = process.env.STRIPE_CURRENCY || 'eur', metadata = {}, idempotencyKey }) {
  const minorAmount = Math.round(Number(amount) * 100);
  if (!Number.isFinite(minorAmount) || minorAmount <= 0) {
    throw Object.assign(new Error('Invalid payment amount'), { status: 400 });
  }

  return stripe.paymentIntents.create({
    amount: minorAmount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  }, {
    idempotencyKey,
  });
}

export function retrievePaymentIntent(paymentIntentId) {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

export function constructWebhookEvent(rawBody, signature) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe webhook secret is not configured');
  }
  return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
}

export default stripe;
