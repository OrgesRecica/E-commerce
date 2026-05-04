import { hashIdentifier } from './crypto.js';

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'client_secret',
  'payment_method',
]);

function redact(value) {
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      SENSITIVE_KEYS.has(key) ? '[redacted]' : item,
    ])
  );
}

export function logSecurityEvent(event, req, details = {}) {
  const entry = {
    type: 'security',
    event,
    at: new Date().toISOString(),
    method: req?.method,
    path: req?.originalUrl,
    ip: req?.ip,
    userAgent: req?.get?.('user-agent'),
    userId: req?.user?.id,
    emailHash: details.email ? hashIdentifier(details.email) : details.emailHash,
    ...redact(details),
  };

  delete entry.email;
  console.info(JSON.stringify(entry));
}
