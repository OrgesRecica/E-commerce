const isProduction = process.env.NODE_ENV === 'production';

const DURATION_UNITS = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
};

export const ACCESS_TOKEN_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || 'scampa_access';
export const REFRESH_TOKEN_COOKIE = process.env.REFRESH_TOKEN_COOKIE_NAME || 'scampa_refresh';
export const CSRF_COOKIE = process.env.CSRF_COOKIE_NAME || 'scampa_csrf';
export const CSRF_HEADER = 'x-csrf-token';

export const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
export const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const JWT_ISSUER = process.env.JWT_ISSUER || 'scampa-api';
export const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'scampa-web';

export const LOGIN_MAX_FAILED_ATTEMPTS = Number(process.env.LOGIN_MAX_FAILED_ATTEMPTS || 5);
export const LOGIN_LOCK_MINUTES = Number(process.env.LOGIN_LOCK_MINUTES || 15);
export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12);

export function parseDurationToSeconds(value, fallbackSeconds) {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.max(1, Math.floor(value));
  const raw = String(value || '').trim().toLowerCase();
  const match = raw.match(/^(\d+)\s*([smhd])?$/);
  if (!match) return fallbackSeconds;
  const amount = Number(match[1]);
  const unit = match[2] || 's';
  return Math.max(1, amount * DURATION_UNITS[unit]);
}

export const ACCESS_TOKEN_TTL_SECONDS = parseDurationToSeconds(ACCESS_TOKEN_EXPIRES_IN, 15 * 60);
export const REFRESH_TOKEN_TTL_SECONDS = parseDurationToSeconds(REFRESH_TOKEN_EXPIRES_IN, 7 * 24 * 60 * 60);

function sameSite() {
  const configured = String(process.env.COOKIE_SAMESITE || 'strict').toLowerCase();
  return ['strict', 'lax', 'none'].includes(configured) ? configured : 'strict';
}

export function cookieSecurityOptions({ httpOnly = true, path = '/api', maxAgeSeconds } = {}) {
  return {
    httpOnly,
    secure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : isProduction,
    sameSite: sameSite(),
    path,
    maxAge: maxAgeSeconds ? maxAgeSeconds * 1000 : undefined,
  };
}

export function requireStrongSecret(name, fallback) {
  const value = process.env[name] || fallback;
  if (isProduction && (!value || value.length < 32)) {
    throw new Error(`${name} must be set to at least 32 random characters in production`);
  }
  return value;
}
