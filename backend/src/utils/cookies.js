import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_TTL_SECONDS,
  CSRF_COOKIE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_TTL_SECONDS,
  cookieSecurityOptions,
} from '../config/security.js';

export function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie(
    ACCESS_TOKEN_COOKIE,
    accessToken,
    cookieSecurityOptions({ path: '/api', maxAgeSeconds: ACCESS_TOKEN_TTL_SECONDS })
  );
  res.cookie(
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    cookieSecurityOptions({ path: '/api/auth', maxAgeSeconds: REFRESH_TOKEN_TTL_SECONDS })
  );
}

export function clearAuthCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE, cookieSecurityOptions({ path: '/api' }));
  res.clearCookie(REFRESH_TOKEN_COOKIE, cookieSecurityOptions({ path: '/api/auth' }));
  res.clearCookie(CSRF_COOKIE, cookieSecurityOptions({ httpOnly: false, path: '/' }));
  res.clearCookie(CSRF_COOKIE, cookieSecurityOptions({ httpOnly: false, path: '/api' }));
}
