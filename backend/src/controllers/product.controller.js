import Product from '../models/Product.js';
import { uploadBuffer, destroyAsset } from '../services/upload.service.js';

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function uniqueSlug(base) {
  let slug = base || 'product';
  if (!(await Product.exists({ slug }))) return slug;
  for (let i = 0; i < 5; i++) {
    const candidate = `${base}-${Math.random().toString(36).slice(2, 7)}`;
    if (!(await Product.exists({ slug: candidate }))) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

const SORT_MAP = {
  new: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  popular: { rating: -1, numReviews: -1 },
};

export async function listProducts(req, res, next) {
  try {
    const { q, category, featured, sort = 'new', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = String(category).toLowerCase();
    if (featured === 'true') filter.featured = true;
    if (q) filter.$text = { $search: q };
    const sortOrder = SORT_MAP[sort] || SORT_MAP.new;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(Number(limit)).sort(sortOrder),
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
    const title = String(req.body.title ?? req.body.name ?? '').trim();
    const description = String(req.body.description ?? '').trim();
    const category = String(req.body.category ?? '').trim().toLowerCase();
    const price = Number(req.body.price);

    if (!title) return res.status(400).json({ message: 'Name is required' });
    if (!description) return res.status(400).json({ message: 'Description is required' });
    if (!category) return res.status(400).json({ message: 'Category is required' });
    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }
    if (!files.length) return res.status(400).json({ message: 'At least one image is required' });

    const uploads = await Promise.all(
      files.map((f) => uploadBuffer(f.buffer, 'products', f.originalname))
    );

    const slug = await uniqueSlug(slugify(title));
    const stock = Number(req.body.stock);
    const product = await Product.create({
      title,
      slug,
      description,
      category,
      price,
      stock: Number.isFinite(stock) ? stock : 1,
      featured: req.body.featured === 'true' || req.body.featured === true,
      images: uploads,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const update = { ...req.body };
    if (update.name && !update.title) {
      update.title = update.name;
      delete update.name;
    }
    if (update.category) update.category = String(update.category).toLowerCase();
    if (update.price != null) update.price = Number(update.price);
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
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

    const cleanup = await Promise.allSettled(
      (product.images || []).map((img) => destroyAsset(img.publicId))
    );
    const cleanupFailed = cleanup.some((result) => result.status === 'rejected');

    res.json({ ok: true, cleanupFailed });
  } catch (err) {
    next(err);
  }
}
