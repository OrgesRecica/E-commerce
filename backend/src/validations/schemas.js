import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
const token = z.string().regex(/^[a-f\d]{64}$/i, 'Invalid token');

const cleanString = (max, min = 1) => z.string().trim().min(min).max(max);
const optionalString = (max) => z.string().trim().max(max).optional().default('');
const email = z.string().trim().toLowerCase().email().max(254);

const password = z.string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[0-9]/, 'Password must include a number');

const booleanFromForm = z.preprocess((value) => {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false || value === '') return false;
  return value;
}, z.boolean());

const shippingAddress = z.object({
  fullName: cleanString(100),
  email,
  phone: cleanString(40),
  line1: cleanString(160),
  city: cleanString(80),
  postalCode: cleanString(32),
  country: cleanString(80),
}).strict();

const address = z.object({
  line1: cleanString(160).optional(),
  city: cleanString(80).optional(),
  postalCode: cleanString(32).optional(),
  country: cleanString(80).optional(),
}).strict();

export const registerSchema = z.object({
  body: z.object({
    name: cleanString(100),
    email,
    password,
  }).strict(),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1).max(128),
  }).strict(),
});

export const verifyEmailSchema = z.object({
  params: z.object({ token }).strict(),
});

export const updateMeSchema = z.object({
  body: z.object({
    name: cleanString(100).optional(),
    address: address.optional(),
  }).strict().refine((value) => Object.keys(value).length > 0, 'No update fields supplied'),
});

export const listProductsSchema = z.object({
  query: z.object({
    q: z.string().trim().max(120).optional(),
    category: z.string().trim().toLowerCase().max(80).optional(),
    featured: z.enum(['true', 'false']).optional(),
    sort: z.enum(['new', 'price-asc', 'price-desc', 'popular']).optional().default('new'),
    page: z.coerce.number().int().min(1).max(10000).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }).strict(),
});

export const productSlugSchema = z.object({
  params: z.object({
    slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{1,100}$/),
  }).strict(),
});

export const productIdSchema = z.object({
  params: z.object({ id: objectId }).strict(),
});

export const createProductSchema = z.object({
  body: z.object({
    name: cleanString(140).optional(),
    title: cleanString(140).optional(),
    description: cleanString(5000),
    category: cleanString(80),
    price: z.coerce.number().min(0).max(1_000_000),
    stock: z.coerce.number().int().min(0).max(1_000_000).optional().default(1),
    featured: booleanFromForm.optional().default(false),
  }).strict().refine((value) => value.title || value.name, 'Product name is required'),
});

export const updateProductSchema = z.object({
  params: z.object({ id: objectId }).strict(),
  body: z.object({
    name: cleanString(140).optional(),
    title: cleanString(140).optional(),
    description: cleanString(5000).optional(),
    category: cleanString(80).optional(),
    price: z.coerce.number().min(0).max(1_000_000).optional(),
    stock: z.coerce.number().int().min(0).max(1_000_000).optional(),
    featured: booleanFromForm.optional(),
  }).strict().refine((value) => Object.keys(value).length > 0, 'No update fields supplied'),
});

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      product: objectId,
      quantity: z.coerce.number().int().min(1).max(100),
    }).strict()).min(1).max(50),
    shippingAddress,
  }).strict(),
});

export const orderIdSchema = z.object({
  params: z.object({ id: objectId }).strict(),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({ id: objectId }).strict(),
  body: z.object({
    status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
  }).strict(),
});

export const createPaymentIntentSchema = z.object({
  body: z.object({ orderId: objectId }).strict(),
});

export const contactSchema = z.object({
  body: z.object({
    name: cleanString(100),
    email,
    company: optionalString(120),
    phone: optionalString(40),
    subject: z.enum(['general', 'wholesale', 'custom', 'partnership', 'press']).optional().default('general'),
    message: cleanString(5000),
  }).strict(),
});
