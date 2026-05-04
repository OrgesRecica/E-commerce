import {
  CSRF_COOKIE,
  CSRF_HEADER,
  REFRESH_TOKEN_TTL_SECONDS,
  cookieSecurityOptions,
  requireStrongSecret,
} from '../config/security.js';
import { hmac, randomToken, timingSafeEqual } from '../utils/crypto.js';
import { logSecurityEvent } from '../utils/securityLogger.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function csrfSecret() {
  return requireStrongSecret('CSRF_SECRET', process.env.JWT_SECRET || 'dev_csrf_secret_change_me');
}

function sign(nonce) {
  return hmac(nonce, csrfSecret());
}

function isValidToken(token) {
  const [nonce, signature] = String(token || '').split('.');
  if (!nonce || !signature) return false;
  return timingSafeEqual(signature, sign(nonce));
}

export function createCsrfToken() {
  const nonce = randomToken(24);
  return `${nonce}.${sign(nonce)}`;
}

export function issueCsrfToken(_req, res) {
  const token = createCsrfToken();
  res.clearCookie(CSRF_COOKIE, cookieSecurityOptions({ httpOnly: false, path: '/api' }));
  res.cookie(
    CSRF_COOKIE,
    token,
    cookieSecurityOptions({
      httpOnly: false,
      path: '/',
      maxAgeSeconds: REFRESH_TOKEN_TTL_SECONDS,
    })
  );
  return token;
}

export function csrfProtection(req, res, next) {
  if (SAFE_METHODS.has(req.method) || req.originalUrl === '/api/payments/webhook') {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.get(CSRF_HEADER);

  if (!cookieToken || !headerToken || cookieToken !== headerToken || !isValidToken(cookieToken)) {
    logSecurityEvent('csrf_rejected', req);
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  return next();
}
