import crypto from 'crypto';

export function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

export function timingSafeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function hmac(value, secret) {
  return crypto.createHmac('sha256', secret).update(String(value)).digest('hex');
}

export function hashIdentifier(value) {
  if (!value) return undefined;
  return sha256(String(value).trim().toLowerCase()).slice(0, 16);
}
