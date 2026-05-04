import { logSecurityEvent } from '../utils/securityLogger.js';

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isDangerousKey(key) {
  return FORBIDDEN_KEYS.has(key) || key.startsWith('$') || key.includes('.');
}

function sanitizeValue(value, state) {
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item, state));
  if (!value || typeof value !== 'object') return value;

  const clean = {};
  for (const [key, item] of Object.entries(value)) {
    if (isDangerousKey(key)) {
      state.removed = true;
      continue;
    }
    clean[key] = sanitizeValue(item, state);
  }
  return clean;
}

export function sanitizeMongoInput(req, _res, next) {
  if (req.originalUrl === '/api/payments/webhook') return next();
  const state = { removed: false };
  if (req.body) req.body = sanitizeValue(req.body, state);
  if (req.params) req.params = sanitizeValue(req.params, state);
  if (req.query) req.query = sanitizeValue(req.query, state);
  if (state.removed) logSecurityEvent('nosql_payload_sanitized', req);
  next();
}
