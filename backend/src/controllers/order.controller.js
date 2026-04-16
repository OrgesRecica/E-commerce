import Order from '../models/Order.js';
import Product from '../models/Product.js';

export async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress } = req.body;
    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const priceMap = new Map(products.map((p) => [String(p._id), p]));

    let total = 0;
    const enriched = items.map((i) => {
      const p = priceMap.get(String(i.product));
      if (!p) throw Object.assign(new Error('Invalid product'), { status: 400 });
      total += p.price * i.quantity;
      return { product: p._id, title: p.title, price: p.price, quantity: i.quantity };
    });

    const order = await Order.create({
      userId: req.user.id,
      items: enriched,
      total,
      shippingAddress,
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export async function listMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.userId) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}
