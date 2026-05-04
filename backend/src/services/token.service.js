import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken.js';
import RevokedToken from '../models/RevokedToken.js';
import User from '../models/User.js';
import { sha256 } from '../utils/crypto.js';
import {
  decodeToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { logSecurityEvent } from '../utils/securityLogger.js';

function clientIp(req) {
  return req.ip || req.socket?.remoteAddress || '';
}

function userAgent(req) {
  return String(req.get?.('user-agent') || '').slice(0, 512);
}

function authError(message, status = 401, code = 'AUTH_FAILED') {
  return Object.assign(new Error(message), { status, code });
}

async function persistRefreshToken({ user, sessionId, refresh, req }) {
  await RefreshToken.create({
    userId: user._id,
    sessionId,
    jti: refresh.jti,
    tokenHash: sha256(refresh.token),
    expiresAt: refresh.expiresAt,
    createdByIp: clientIp(req),
    createdByUserAgent: userAgent(req),
  });
}

export async function createAuthSession(user, req) {
  const sessionId = crypto.randomUUID();
  const access = signAccessToken(user, sessionId);
  const refresh = signRefreshToken(user, sessionId);
  await persistRefreshToken({ user, sessionId, refresh, req });
  return {
    accessToken: access.token,
    refreshToken: refresh.token,
    accessExpiresAt: access.expiresAt,
  };
}

export async function revokeSession(sessionId, reason = 'revoked') {
  if (!sessionId) return;
  await RefreshToken.updateMany(
    { sessionId, revokedAt: null },
    { $set: { revokedAt: new Date(), revokedReason: reason } }
  );
}

export async function revokeAllUserSessions(userId, reason = 'revoked') {
  if (!userId) return;
  await RefreshToken.updateMany(
    { userId, revokedAt: null },
    { $set: { revokedAt: new Date(), revokedReason: reason } }
  );
}

export async function rotateRefreshSession(refreshToken, req) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw authError('Invalid or expired refresh token');
  }

  const stored = await RefreshToken.findOne({ jti: payload.jti }).select('+tokenHash');
  if (!stored || stored.tokenHash !== sha256(refreshToken)) {
    await revokeSession(payload.sid, 'refresh_replay_detected');
    logSecurityEvent('refresh_replay_detected', req, { userId: payload.sub });
    throw authError('Session revoked. Please sign in again.');
  }

  if (stored.revokedAt) {
    await revokeSession(stored.sessionId, 'refresh_reuse_detected');
    logSecurityEvent('refresh_reuse_detected', req, { userId: String(stored.userId) });
    throw authError('Session revoked. Please sign in again.');
  }

  if (stored.expiresAt <= new Date()) {
    stored.revokedAt = new Date();
    stored.revokedReason = 'expired';
    await stored.save({ validateBeforeSave: false });
    throw authError('Refresh token expired');
  }

  const user = await User.findById(stored.userId).select('+loginFailedAttempts +loginLockUntil');
  if (!user) {
    await revokeSession(stored.sessionId, 'user_missing');
    throw authError('Session revoked. Please sign in again.');
  }

  if (user.changedPasswordAfter(payload.iat)) {
    await revokeSession(stored.sessionId, 'password_changed');
    throw authError('Session revoked. Please sign in again.');
  }

  const access = signAccessToken(user, stored.sessionId);
  const refresh = signRefreshToken(user, stored.sessionId);
  await persistRefreshToken({ user, sessionId: stored.sessionId, refresh, req });

  stored.revokedAt = new Date();
  stored.revokedReason = 'rotated';
  stored.replacedByTokenId = refresh.jti;
  stored.lastUsedAt = new Date();
  await stored.save({ validateBeforeSave: false });

  return {
    user,
    accessToken: access.token,
    refreshToken: refresh.token,
    accessExpiresAt: access.expiresAt,
  };
}

export async function revokeRefreshToken(refreshToken, reason = 'logout') {
  if (!refreshToken) return;
  const hash = sha256(refreshToken);
  await RefreshToken.findOneAndUpdate(
    { tokenHash: hash, revokedAt: null },
    { $set: { revokedAt: new Date(), revokedReason: reason } }
  );
}

export async function revokeAccessToken(accessPayload, reason = 'logout') {
  if (!accessPayload?.jti || !accessPayload.exp) return;
  const expiresAt = new Date(accessPayload.exp * 1000);
  if (expiresAt <= new Date()) return;
  await RevokedToken.updateOne(
    { jti: accessPayload.jti },
    {
      $setOnInsert: {
        jti: accessPayload.jti,
        userId: accessPayload.sub,
        sessionId: accessPayload.sid,
        expiresAt,
        reason,
      },
    },
    { upsert: true }
  );
}

export async function isAccessTokenRevoked(jti) {
  if (!jti) return true;
  return Boolean(await RevokedToken.exists({ jti }));
}

export function decodeAccessForRevocation(accessToken) {
  const payload = decodeToken(accessToken);
  return payload?.typ === 'access' ? payload : null;
}
