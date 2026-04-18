import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'dns';
import Product from '../models/Product.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const products = [
  {
    title: 'Walnut Side Table',
    slug: 'walnut-side-table',
    description: 'Solid American walnut side table with tapered legs and a hand-oiled finish. A timeless addition to any living space.',
    category: 'furniture',
    price: 289,
    stock: 12,
    featured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', publicId: 'seed:walnut-side-table' }],
  },
  {
    title: 'Brass Pendant Lamp',
    slug: 'brass-pendant-lamp',
    description: 'Hand-spun brushed brass pendant with a frosted glass diffuser. Dimmable, fits E27 bulb up to 60W.',
    category: 'lighting',
    price: 195,
    stock: 8,
    featured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80', publicId: 'seed:brass-pendant-lamp' }],
  },
  {
    title: 'Stoneware Bowl Set',
    slug: 'stoneware-bowl-set',
    description: 'Set of three hand-thrown stoneware bowls in a matte speckled glaze. Dishwasher safe. Sizes S / M / L.',
    category: 'ceramics',
    price: 85,
    stock: 20,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80', publicId: 'seed:stoneware-bowl-set' }],
  },
  {
    title: 'Linen Throw Blanket',
    slug: 'linen-throw-blanket',
    description: 'Stonewashed French linen throw with a natural fringe edge. Breathable, softens with every wash. 130×170 cm.',
    category: 'textiles',
    price: 145,
    stock: 15,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=800&q=80', publicId: 'seed:linen-throw-blanket' }],
  },
  {
    title: 'Dieter Rams: Less But Better',
    slug: 'dieter-rams-less-but-better',
    description: 'The definitive monograph on industrial designer Dieter Rams, covering his 10 principles of good design. Hardcover, 320 pages.',
    category: 'books',
    price: 65,
    stock: 30,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', publicId: 'seed:dieter-rams-book' }],
  },
  {
    title: 'Vegetable-Tanned Cardholder',
    slug: 'vegetable-tanned-cardholder',
    description: 'Slim full-grain vegetable-tanned leather cardholder. Holds up to 6 cards. Ages beautifully over time.',
    category: 'accessories',
    price: 55,
    stock: 25,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', publicId: 'seed:leather-cardholder' }],
  },
  {
    title: 'Marble Catchall Tray',
    slug: 'marble-catchall-tray',
    description: 'White Carrara marble tray with a polished rim. Perfect as a desk organiser or entryway accent. 20×13 cm.',
    category: 'accessories',
    price: 120,
    stock: 10,
    featured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', publicId: 'seed:marble-tray' }],
  },
  {
    title: 'Hand-Knotted Wool Rug',
    slug: 'hand-knotted-wool-rug',
    description: 'Hand-knotted New Zealand wool rug in a natural undyed palette. Dense pile, non-slip backing. 160×230 cm.',
    category: 'textiles',
    price: 385,
    stock: 5,
    featured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80', publicId: 'seed:wool-rug' }],
  },
  {
    title: 'Arc Floor Lamp',
    slug: 'arc-floor-lamp',
    description: 'Powder-coated steel arc floor lamp with a natural linen shade. 190 cm tall. Includes inline dimmer switch.',
    category: 'lighting',
    price: 320,
    stock: 7,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', publicId: 'seed:arc-floor-lamp' }],
  },
  {
    title: 'Speckled Espresso Mugs',
    slug: 'speckled-espresso-mugs',
    description: 'Set of two wheel-thrown espresso mugs in a warm speckled glaze. Each holds 90 ml. Microwave and dishwasher safe.',
    category: 'ceramics',
    price: 72,
    stock: 18,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80', publicId: 'seed:espresso-mugs' }],
  },
];

await mongoose.connect(MONGODB_URI);

let created = 0;
for (const p of products) {
  const exists = await Product.exists({ slug: p.slug });
  if (!exists) {
    await Product.create(p);
    console.log(`  ✓ ${p.title}`);
    created++;
  } else {
    console.log(`  — skipped (exists): ${p.title}`);
  }
}

console.log(`\nDone. ${created} products created.`);
await mongoose.disconnect();
process.exit(0);
