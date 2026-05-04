import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../config/security.js';
import { issueCsrfToken } from '../middleware/csrf.js';
import { sendVerificationEmail } from '../services/auth-email.service.js';
import {
  createAuthSession,
  decodeAccessForRevocation,
  revokeAccessToken,
  revokeRefreshToken,
  revokeSession,
  rotateRefreshSession,
} from '../services/token.service.js';
import { clearAuthCookies, setAuthCookies } from '../utils/cookies.js';
import { sha256 } from '../utils/crypto.js';
import { logSecurityEvent } from '../utils/securityLogger.js';

const DUMMY_PASSWORD_HASH = '$2a$12$C6UzMDM.H6dfI/f/IKcEe.5v6u7.1K8nLax3UM3W8wXxC5Cvqqy2.';

function authUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: Boolean(user.emailVerified),
  };
}

async function sendVerificationIfConfigured(user, req) {
  const token = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });
  try {
    const sent = await sendVerificationEmail(user, token);
    logSecurityEvent(sent ? 'email_verification_sent' : 'email_verification_not_configured', req, {
      userId: String(user._id),
    });
  } catch (err) {
    logSecurityEvent('email_verification_failed', req, { userId: String(user._id), reason: err.message });
  }
}

export function csrf(req, res) {
  const csrfToken = issueCsrfToken(req, res);
  res.json({ csrfToken });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const exists = await User.exists({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = new User({ name, email });
    await user.setPassword(password);
    await user.save();

    await sendVerificationIfConfigured(user, req);

    const session = await createAuthSession(user, req);
    setAuthCookies(res, session);
    issueCsrfToken(req, res);
    logSecurityEvent('register_success', req, { userId: String(user._id) });

    res.status(201).json({ user: authUser(user) });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Email already registered' });
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select(
      '+passwordHash +loginFailedAttempts +loginLockUntil'
    );

    if (user?.isLoginLocked()) {
      const retryAfter = Math.ceil((user.loginLockUntil.getTime() - Date.now()) / 1000);
      logSecurityEvent('login_locked', req, { userId: String(user._id), retryAfter });
      return res
        .status(423)
        .set('Retry-After', String(retryAfter))
        .json({ message: 'Account temporarily locked. Please try again later.', retryAfter });
    }

    const valid = user
      ? await user.verifyPassword(password)
      : await bcrypt.compare(password, DUMMY_PASSWORD_HASH);

    if (!valid) {
      if (user) await user.recordFailedLogin();
      logSecurityEvent('login_failed', req, { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true' && !user.emailVerified) {
      logSecurityEvent('login_unverified_email', req, { userId: String(user._id) });
      return res.status(403).json({ message: 'Please verify your email before signing in.' });
    }

    await user.resetLoginFailures();
    const session = await createAuthSession(user, req);
    setAuthCookies(res, session);
    issueCsrfToken(req, res);
    logSecurityEvent('login_success', req, { userId: String(user._id) });

    res.json({ user: authUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });

    const session = await rotateRefreshSession(refreshToken, req);
    setAuthCookies(res, session);
    issueCsrfToken(req, res);
    logSecurityEvent('refresh_success', req, { userId: String(session.user._id) });
    res.json({ user: authUser(session.user) });
  } catch (err) {
    clearAuthCookies(res);
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const accessPayload = decodeAccessForRevocation(req.cookies?.[ACCESS_TOKEN_COOKIE]);
    if (accessPayload) {
      await revokeAccessToken(accessPayload, 'logout');
      await revokeSession(accessPayload.sid, 'logout');
    }
    await revokeRefreshToken(req.cookies?.[REFRESH_TOKEN_COOKIE], 'logout');
    clearAuthCookies(res);
    logSecurityEvent('logout', req, { userId: accessPayload?.sub });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: authUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const tokenHash = sha256(req.params.token);
    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationTokenHash +emailVerificationExpires');

    if (!user) return res.status(400).json({ message: 'Invalid or expired verification token' });

    user.emailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    logSecurityEvent('email_verified', req, { userId: String(user._id) });
    res.json({ message: 'Email verified. You can close this page.' });
  } catch (err) {
    next(err);
  }
}

export async function resendVerification(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select(
      '+emailVerificationTokenHash +emailVerificationExpires'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.emailVerified) return res.json({ message: 'Email already verified' });

    await sendVerificationIfConfigured(user, req);
    res.json({ message: 'Verification email sent' });
  } catch (err) {
    next(err);
  }
}
