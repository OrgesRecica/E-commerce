import { ACCESS_TOKEN_COOKIE } from '../config/security.js';
import { isAccessTokenRevoked } from '../services/token.service.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { logSecurityEvent } from '../utils/securityLogger.js';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[ACCESS_TOKEN_COOKIE];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const payload = verifyAccessToken(token);
    if (await isAccessTokenRevoked(payload.jti)) {
      logSecurityEvent('revoked_access_token_used', req, { userId: payload.sub });
      return res.status(401).json({ message: 'Session expired' });
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
      emailVerified: Boolean(payload.emailVerified),
      sessionId: payload.sid,
      tokenId: payload.jti,
      issuedAt: payload.iat,
      expiresAt: payload.exp,
    };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}

export function requireVerifiedEmail(req, res, next) {
  if (process.env.REQUIRE_EMAIL_VERIFICATION !== 'true') return next();
  if (req.user?.emailVerified) return next();
  return res.status(403).json({ message: 'Email verification required' });
}
