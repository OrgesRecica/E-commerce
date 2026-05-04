import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_TTL_SECONDS,
  JWT_AUDIENCE,
  JWT_ISSUER,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_TTL_SECONDS,
  requireStrongSecret,
} from '../config/security.js';

function accessSecret() {
  return requireStrongSecret('JWT_ACCESS_SECRET', process.env.JWT_SECRET || 'dev_access_secret_change_me');
}

function refreshSecret() {
  return requireStrongSecret('JWT_REFRESH_SECRET', process.env.JWT_SECRET || 'dev_refresh_secret_change_me');
}

function expiresAt(ttlSeconds) {
  return new Date(Date.now() + ttlSeconds * 1000);
}

function userIdFor(user) {
  return String(user._id || user.id);
}

export function signAccessToken(user, sessionId) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    {
      sub: userIdFor(user),
      id: userIdFor(user),
      role: user.role,
      emailVerified: Boolean(user.emailVerified),
      sid: sessionId,
      typ: 'access',
    },
    accessSecret(),
    {
      audience: JWT_AUDIENCE,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      issuer: JWT_ISSUER,
      jwtid: jti,
    }
  );

  return { token, jti, expiresAt: expiresAt(ACCESS_TOKEN_TTL_SECONDS) };
}

export function signRefreshToken(user, sessionId) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    {
      sub: userIdFor(user),
      id: userIdFor(user),
      role: user.role,
      sid: sessionId,
      typ: 'refresh',
    },
    refreshSecret(),
    {
      audience: JWT_AUDIENCE,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      issuer: JWT_ISSUER,
      jwtid: jti,
    }
  );

  return { token, jti, expiresAt: expiresAt(REFRESH_TOKEN_TTL_SECONDS) };
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, accessSecret(), {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
  });
  if (payload.typ !== 'access') throw new Error('Invalid token type');
  return payload;
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, refreshSecret(), {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
  });
  if (payload.typ !== 'refresh') throw new Error('Invalid token type');
  return payload;
}

export function decodeToken(token) {
  return jwt.decode(token);
}
