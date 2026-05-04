import Order from '../models/Order.js';
import ProcessedWebhookEvent from '../models/ProcessedWebhookEvent.js';
import {
  constructWebhookEvent,
  createPaymentIntent,
  retrievePaymentIntent,
} from '../services/stripe.service.js';
import { logSecurityEvent } from '../utils/securityLogger.js';

function expectedMinorAmount(order) {
  return Math.round(Number(order.total) * 100);
}

async function markPaymentSucceeded(intent, req) {
  const orderId = intent.metadata?.orderId;
  if (!orderId) {
    logSecurityEvent('stripe_missing_order_metadata', req, { paymentIntentId: intent.id });
    return;
  }

  const order = await Order.findById(orderId);
  if (!order) {
    logSecurityEvent('stripe_order_missing', req, { paymentIntentId: intent.id });
    return;
  }

  if (order.paymentIntentId !== intent.id) {
    logSecurityEvent('stripe_intent_order_mismatch', req, {
      orderId,
      paymentIntentId: intent.id,
    });
    return;
  }

  if (intent.amount_received !== expectedMinorAmount(order)) {
    logSecurityEvent('stripe_amount_mismatch', req, {
      orderId,
      paymentIntentId: intent.id,
    });
    return;
  }

  await Order.updateOne(
    { _id: order._id, paymentIntentId: intent.id, status: { $ne: 'paid' } },
    { $set: { status: 'paid' } }
  );
}

async function markPaymentFailed(intent, req) {
  const orderId = intent.metadata?.orderId;
  if (!orderId) return;
  await Order.updateOne(
    { _id: orderId, paymentIntentId: intent.id, status: { $ne: 'paid' } },
    { $set: { status: 'cancelled' } }
  );
  logSecurityEvent('stripe_payment_failed', req, { orderId, paymentIntentId: intent.id });
}

export async function createIntent(req, res, next) {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.userId) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (order.status === 'paid') {
      return res.status(409).json({ message: 'Order is already paid' });
    }

    if (order.paymentIntentId) {
      const existing = await retrievePaymentIntent(order.paymentIntentId);
      if (existing.status === 'succeeded') {
        order.status = 'paid';
        await order.save({ validateBeforeSave: false });
        return res.status(409).json({ message: 'Order is already paid' });
      }
      return res.json({ clientSecret: existing.client_secret });
    }

    const intent = await createPaymentIntent({
      amount: order.total,
      metadata: { orderId: String(order._id), userId: req.user.id },
      idempotencyKey: `order:${order._id}:payment-intent:v1`,
    });
    order.paymentIntentId = intent.id;
    await order.save({ validateBeforeSave: false });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    next(err);
  }
}

export async function webhook(req, res) {
  try {
    const sig = req.headers['stripe-signature'];
    if (!sig) return res.status(400).send('Webhook Error: missing Stripe signature');

    const event = constructWebhookEvent(req.body, sig);

    try {
      await ProcessedWebhookEvent.create({ eventId: event.id, type: event.type });
    } catch (err) {
      if (err.code === 11000) return res.json({ received: true, duplicate: true });
      throw err;
    }

    if (event.type === 'payment_intent.succeeded') {
      await markPaymentSucceeded(event.data.object, req);
    }

    if (
      event.type === 'payment_intent.payment_failed' ||
      event.type === 'payment_intent.canceled'
    ) {
      await markPaymentFailed(event.data.object, req);
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
