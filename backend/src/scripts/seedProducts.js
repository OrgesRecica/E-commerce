import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'dns';
import Product from '../models/Product.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const products = [
  // ── Shopping Bags ──────────────────────────────────────────────
  {
    title: 'Boutique Shopping Bag — White',
    slug: 'boutique-bag-white',
    description: 'Premium white boutique shopping bag with reinforced twisted handles. Made from 100% recycled polyethylene. Ideal for retail stores, pharmacies, and boutique shops. Available in multiple sizes. Bulk orders from 500 units.',
    category: 'shopping-bags',
    price: 5.00,
    stock: 500,
    featured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80', publicId: 'seed:boutique-bag-white' }],
  },
  {
    title: 'Boutique Shopping Bag — Matte Black',
    slug: 'boutique-bag-black',
    description: 'Elegant matte black boutique bag with twisted handles for a premium presentation. Crafted from recycled LDPE film. Custom dimensions and colour matching available for retail chains.',
    category: 'shopping-bags',
    price: 5.50,
    stock: 400,
    featured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', publicId: 'seed:boutique-bag-black' }],
  },
  {
    title: 'Printed Retail Bag — Custom 4-Colour',
    slug: 'printed-retail-bag',
    description: 'Custom printed retail shopping bag with up to 4-colour flexographic print. Multilayer technology with recycled content. Perfect for branded retail experiences. MOQ 1,000 units.',
    category: 'shopping-bags',
    price: 7.20,
    stock: 1000,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1575539393027-22c9e75b25ba?auto=format&fit=crop&w=800&q=80', publicId: 'seed:printed-retail-bag' }],
  },
  {
    title: 'Pharmacy Carrier Bag',
    slug: 'pharmacy-carrier-bag',
    description: 'Lightweight pharmacy carrier bag with handle-cutout design. Compliant with EU pharmaceutical retail standards. Sized for medication packaging. Trusted by Kastrati, Doa, Jara, and Gogaj pharmacies.',
    category: 'shopping-bags',
    price: 3.50,
    stock: 800,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', publicId: 'seed:pharmacy-carrier-bag' }],
  },
  {
    title: 'Supermarket T-Shirt Bag',
    slug: 'supermarket-tshirt-bag',
    description: 'Standard t-shirt style supermarket bag with vest handles. High-strength HDPE construction from recycled materials. Compatible with checkout dispensers. Bulk packaging options.',
    category: 'shopping-bags',
    price: 2.20,
    stock: 2500,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&w=800&q=80', publicId: 'seed:supermarket-tshirt-bag' }],
  },

  // ── Garbage Bags ───────────────────────────────────────────────
  {
    title: 'Household Garbage Bag — 35L Draw Tape',
    slug: 'garbage-bag-35l-drawtape',
    description: 'Strong 35-litre household garbage bag with draw-tape closure. Made from 100% post-consumer recycled (PCR) materials. Star-sealed base prevents leaks. Roll of 20 bags. Manufactured by Powerpack LLC for EU export.',
    category: 'garbage-bags',
    price: 3.99,
    stock: 2000,
    featured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', publicId: 'seed:garbage-bag-35l-drawtape' }],
  },
  {
    title: 'Heavy Duty Garbage Bag — 70L Bottom Seal',
    slug: 'garbage-bag-70l-bottomseal',
    description: 'Industrial-strength 70-litre garbage bag designed for commercial and hospitality use. Bottom-seal construction with extra-thick gauge. Puncture-resistant film from recycled HDPE. Roll of 10.',
    category: 'garbage-bags',
    price: 6.50,
    stock: 1500,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80', publicId: 'seed:garbage-bag-70l-bottomseal' }],
  },
  {
    title: 'Industrial Bin Liner — 120L Wavetop',
    slug: 'bin-liner-120l-wavetop',
    description: 'Heavy-duty 120-litre bin liner for industrial and municipal waste management. Wavetop edge for premium presentation. Manufactured from multilayer recycled polyethylene. Pack of 10.',
    category: 'garbage-bags',
    price: 9.80,
    stock: 800,
    featured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80', publicId: 'seed:bin-liner-120l-wavetop' }],
  },
  {
    title: 'Compostable Waste Bag — 30L EN 13432',
    slug: 'compostable-bag-30l',
    description: 'EN 13432 certified compostable waste bag for organic and food waste collection. Made from plant-based bio-film. Suitable for home and commercial composting facilities. Roll of 25.',
    category: 'garbage-bags',
    price: 8.20,
    stock: 600,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80', publicId: 'seed:compostable-bag-30l' }],
  },
  {
    title: 'Pedal Bin Liner — 20L Slim',
    slug: 'pedal-bin-liner-20l',
    description: 'Slim 20-litre pedal bin liner for office and bathroom use. Quiet-open design and odour-control polymer additive. Recycled PE construction. Box of 100 bags.',
    category: 'garbage-bags',
    price: 5.40,
    stock: 1200,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=800&q=80', publicId: 'seed:pedal-bin-liner-20l' }],
  },
  {
    title: 'Bulk Industrial Sack — 240L',
    slug: 'industrial-sack-240l',
    description: 'Extra-heavy 240-litre industrial sack for construction, demolition, and high-volume waste. Reinforced seams, tear-resistant film. UV-stabilised for outdoor storage. Pack of 5.',
    category: 'garbage-bags',
    price: 14.90,
    stock: 400,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?auto=format&fit=crop&w=800&q=80', publicId: 'seed:industrial-sack-240l' }],
  },

  // ── Packing Rolls ──────────────────────────────────────────────
  {
    title: 'Stretch Wrap Roll — 500mm Machine Grade',
    slug: 'stretch-wrap-500mm',
    description: 'Standard 500mm × 300m machine-grade stretch wrap. Pre-stretch technology delivers superior load containment with up to 50% less film usage. Multilayer recycled LLDPE.',
    category: 'packing-rolls',
    price: 3.00,
    stock: 300,
    featured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80', publicId: 'seed:stretch-wrap-500mm' }],
  },
  {
    title: 'Hand Stretch Film — 450mm',
    slug: 'hand-stretch-film-450mm',
    description: 'Manual hand-wrap stretch film, 450mm × 150m per roll. High cling performance for securing pallets and bundling shipments. Produced with recycled content and low-core technology.',
    category: 'packing-rolls',
    price: 4.50,
    stock: 250,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80', publicId: 'seed:hand-stretch-film' }],
  },
  {
    title: 'Polyethylene Packing Roll — Clear',
    slug: 'pe-packing-roll-clear',
    description: 'Clear polyethylene packing roll for food-safe and industrial packaging. Width 600mm × 500m. Cost-efficient solution with customisable thickness from 30–80 microns.',
    category: 'packing-rolls',
    price: 12.00,
    stock: 200,
    featured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=800&q=80', publicId: 'seed:pe-packing-roll-clear' }],
  },
  {
    title: 'Industrial Shrink Film',
    slug: 'industrial-shrink-film',
    description: 'High-performance shrink film for end-of-line packaging. Heat-shrinkable polyethylene roll, 1000mm width. Ideal for bundling beverage cases, building materials, and industrial pallets.',
    category: 'packing-rolls',
    price: 18.50,
    stock: 150,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=800&q=80', publicId: 'seed:industrial-shrink-film' }],
  },
  {
    title: 'Pallet Cover Sheets — 100 Pack',
    slug: 'pallet-cover-sheets',
    description: 'Heavy-duty pallet cover sheets, 1500×1500mm, 80 micron. Protects palletised goods from dust, rain, and damage during transport. Recycled LDPE construction. Pack of 100.',
    category: 'packing-rolls',
    price: 22.00,
    stock: 100,
    featured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80', publicId: 'seed:pallet-cover-sheets' }],
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
