import Product from '../models/Product.js';
import { uploadBuffer } from '../services/upload.service.js';

export async function listProducts(req, res, next) {
  try {
    const { q, category, featured, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (q) filter.$text = { $search: q };
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const files = req.files || [];
    const uploads = await Promise.all(files.map((f) => uploadBuffer(f.buffer, 'products')));
    const product = await Product.create({ ...req.body, images: uploads });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
