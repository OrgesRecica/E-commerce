import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { connectDB } from './src/config/db.js';
import { notFound, errorHandler } from './src/middleware/error.js';
import { csrfProtection } from './src/middleware/csrf.js';
import { enforceHttps } from './src/middleware/https.js';
import { apiRateLimiter } from './src/middleware/rateLimit.js';
import { sanitizeMongoInput } from './src/middleware/sanitize.js';

import authRoutes from './src/routes/auth.routes.js';
import productRoutes from './src/routes/product.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import userRoutes from './src/routes/user.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import contactRoutes from './src/routes/contact.routes.js';

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

const cspDirectives = {
  defaultSrc: ["'none'"],
  baseUri: ["'none'"],
  formAction: ["'none'"],
  frameAncestors: ["'none'"],
  imgSrc: ["'self'", 'data:', 'https:'],
  objectSrc: ["'none'"],
  scriptSrc: ["'none'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
};
if (process.env.NODE_ENV === 'production') cspDirectives.upgradeInsecureRequests = [];

app.use(enforceHttps);
app.use(helmet({
  contentSecurityPolicy: { directives: cspDirectives },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: process.env.NODE_ENV === 'production'
    ? { maxAge: 15552000, includeSubDomains: true, preload: true }
    : false,
  referrerPolicy: { policy: 'no-referrer' },
}));

const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS || '').split(','),
  'http://localhost:5173',
  'http://localhost:5174',
].map((origin) => origin && origin.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
}));
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
app.use(morgan('dev'));

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeMongoInput);
app.use('/api', apiRateLimiter);
app.use(csrfProtection);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on :${PORT}`));
});
