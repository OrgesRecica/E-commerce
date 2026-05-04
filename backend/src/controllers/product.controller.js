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
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).sort(sortOrder),
      Product.countDocuments(filter),
    ]);
    res.json({ items, total, page, limit });
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
    const title = String(req.body.title ?? req.body.name).trim();
    const description = req.body.description;
    const category = req.body.category.toLowerCase();
    const price = req.body.price;
    if (!files.length) return res.status(400).json({ message: 'At least one image is required' });

    const uploads = await Promise.all(
      files.map((f) => uploadBuffer(f.buffer, 'products', f.originalname))
    );

    const slug = await uniqueSlug(slugify(title));
    const product = await Product.create({
      title,
      slug,
      description,
      category,
      price,
      stock: req.body.stock,
      featured: req.body.featured,
      images: uploads,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { name, ...rest } = req.body;
    const update = { ...rest };
    if (name && !update.title) update.title = name;
    if (update.category) update.category = update.category.toLowerCase();

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
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
