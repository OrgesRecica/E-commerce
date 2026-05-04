import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress } = req.body;
    const requested = new Map();
    for (const item of items) {
      const id = String(item.product);
      requested.set(id, (requested.get(id) || 0) + item.quantity);
    }
    const productIds = [...requested.keys()];
    const products = await Product.find({ _id: { $in: productIds } });
    const priceMap = new Map(products.map((p) => [String(p._id), p]));

    let total = 0;
    const enriched = productIds.map((id) => {
      const p = priceMap.get(id);
      if (!p) throw Object.assign(new Error('Invalid product'), { status: 400 });
      const quantity = requested.get(id);
      if (p.stock < quantity) {
        throw Object.assign(new Error(`Not enough stock for ${p.title}`), { status: 409 });
      }
      total += p.price * quantity;
      return { product: p._id, title: p.title, price: p.price, quantity };
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

export async function listAllOrders(req, res, next) {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const [totalOrders, totalProducts, totalUsers, revenueData, ordersByStatus, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([{ $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email'),
    ]);
    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: revenueData[0]?.total || 0,
      ordersByStatus: ordersByStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      recentOrders,
    });
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
