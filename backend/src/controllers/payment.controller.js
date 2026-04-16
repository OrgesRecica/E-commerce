import Order from '../models/Order.js';
import { createPaymentIntent, constructWebhookEvent } from '../services/stripe.service.js';

export async function createIntent(req, res, next) {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.userId) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const intent = await createPaymentIntent({
      amount: order.total,
      metadata: { orderId: String(order._id) },
    });
    order.paymentIntentId = intent.id;
    await order.save();
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    next(err);
  }
}

export async function webhook(req, res) {
  try {
    const sig = req.headers['stripe-signature'];
    const event = constructWebhookEvent(req.body, sig);
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      const orderId = intent.metadata?.orderId;
      if (orderId) await Order.findByIdAndUpdate(orderId, { status: 'paid' });
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
