# Security Integration Guide

This app now uses cookie-bound JWT authentication, rotating refresh tokens, CSRF protection, strict validation, account lockout, hardened Stripe handling, and safer MongoDB query boundaries.

## Folder Structure

```text
backend/
  server.js
  src/
    config/security.js
    controllers/auth.controller.js
    controllers/payment.controller.js
    middleware/auth.js
    middleware/csrf.js
    middleware/https.js
    middleware/rateLimit.js
    middleware/sanitize.js
    middleware/validate.js
    models/RefreshToken.js
    models/RevokedToken.js
    models/ProcessedWebhookEvent.js
    services/token.service.js
    services/auth-email.service.js
    utils/cookies.js
    utils/crypto.js
    utils/jwt.js
    utils/securityLogger.js
    validations/schemas.js

frontend/
  src/
    api/axios.js
    store/authSlice.js
    App.jsx
    components/Navbar.jsx
    pages/Login.jsx
    pages/Register.jsx
    pages/Checkout.jsx
    pages/Admin.jsx
```

## Step-by-Step Setup

1. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Set production secrets in `backend/.env`. Use different random 32+ character values for each JWT and CSRF secret:

   ```env
   JWT_ACCESS_SECRET=...
   JWT_REFRESH_SECRET=...
   CSRF_SECRET=...
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   COOKIE_SAMESITE=strict
   COOKIE_SECURE=true
   BCRYPT_ROUNDS=12
   ```

3. Configure CORS with exact origins only:

   ```env
   CLIENT_URL=https://your-store.example
   CLIENT_URLS=https://admin.your-store.example
   ```

4. Run MongoDB with a least-privilege application user. The app user needs read/write only to this app database, not admin privileges.

5. Configure Stripe:

   ```env
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_CURRENCY=eur
   ```

   In Stripe Dashboard, send webhook events to:

   ```text
   https://your-api.example/api/payments/webhook
   ```

   Subscribe at minimum to:

   ```text
   payment_intent.succeeded
   payment_intent.payment_failed
   payment_intent.canceled
   ```

6. Configure frontend:

   ```env
   VITE_API_URL=https://your-api.example/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   VITE_CSRF_COOKIE_NAME=scampa_csrf
   ```

7. Build and run:

   ```bash
   cd backend
   npm run start

   cd ../frontend
   npm run build
   ```

## Security Decisions and Why

- Access tokens are short-lived HTTP-only cookies. JavaScript cannot read them, which reduces token theft if an XSS bug appears.
- Refresh tokens are HTTP-only cookies scoped to `/api/auth`. They are not exposed to product, order, or payment API calls.
- Refresh tokens rotate on every refresh. Reusing an old refresh token revokes the whole session, which turns replay into a detectable logout event instead of a silent account takeover.
- Access token IDs are denied after logout until their natural expiration. This closes the common "logout but access JWT still works" gap.
- CSRF uses a signed double-submit token. Cookie auth needs CSRF protection because browsers attach cookies automatically.
- Cookies use `SameSite=strict` by default and `Secure` in production. This reduces cross-site request risk and prevents cleartext cookie transport.
- Passwords use bcrypt with configurable cost. The default cost is 12, which is a practical production baseline.
- Login has IP rate limiting plus per-account lockout. The rate limiter slows broad guessing, while lockout slows focused attacks on one email.
- Login returns generic invalid credential messages. This avoids confirming which emails are registered.
- Inputs are validated with Zod before controllers run. This prevents type confusion and rejects unexpected fields.
- Mongo query keys containing `$`, `.`, `__proto__`, `constructor`, or `prototype` are stripped before routes. This blocks common NoSQL operator injection and prototype pollution payloads.
- Mongoose schemas are strict with field length and enum validation. This prevents mass assignment and oversized stored data.
- React does not store auth tokens in `localStorage` or `sessionStorage`. Auth state is memory-only and restored from `/auth/me`.
- Axios sends credentials and CSRF headers automatically for unsafe methods. Refresh calls are single-flight to avoid racing refresh-token rotation.
- Stripe PaymentIntents are created only on the backend from trusted order totals. The browser only receives a client secret.
- Stripe PaymentIntent creation uses idempotency keys per order. Retried requests do not create duplicate charges.
- Stripe webhooks verify the Stripe signature against the raw request body. Unsigned or modified events are rejected.
- Stripe webhook event IDs are stored with a unique index. Duplicate webhook deliveries are acknowledged but not processed twice.
- Webhooks verify order ID, PaymentIntent ID, and received amount before marking an order paid.
- Helmet sets CSP, HSTS in production, frame protections, no-sniff, and no-referrer headers. These reduce browser-side exploit surface.
- HTTPS is required in production. Cookies marked `Secure` are only meaningful if every request is HTTPS.
- Security logs redact credentials and hash email identifiers. Logs remain useful for investigation without becoming a secret dump.

## Operational Notes

- Store secrets in your deployment secret manager, not in Git.
- Use separate Stripe webhook secrets per environment.
- Rotate JWT and CSRF secrets with a planned logout window, because existing tokens become invalid.
- Monitor `security` log events for `refresh_reuse_detected`, `refresh_replay_detected`, `csrf_rejected`, and repeated `login_failed`.
- If `REQUIRE_EMAIL_VERIFICATION=true`, users must verify email before login.
- Do not enable wildcard CORS with credentials. Browsers reject some wildcard credential combinations, but relying on that is not a security control.
- Do not store card data. This app delegates all card handling to Stripe Elements and Stripe PaymentIntents.
