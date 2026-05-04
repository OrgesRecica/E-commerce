import axios from 'axios';

const CSRF_COOKIE_NAME = import.meta.env.VITE_CSRF_COOKIE_NAME || 'scampa_csrf';
const CSRF_HEADER = 'X-CSRF-Token';
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

let csrfPromise = null;
let refreshPromise = null;

function readCookie(name) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=');
}

async function ensureCsrfToken(force = false) {
  if (!force && readCookie(CSRF_COOKIE_NAME)) return readCookie(CSRF_COOKIE_NAME);
  if (!csrfPromise) {
    csrfPromise = api.get('/auth/csrf', { skipAuthRefresh: true }).finally(() => {
      csrfPromise = null;
    });
  }
  await csrfPromise;
  return readCookie(CSRF_COOKIE_NAME);
}

api.interceptors.request.use(async (config) => {
  config.withCredentials = true;
  const method = String(config.method || 'get').toUpperCase();

  if (UNSAFE_METHODS.has(method)) {
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) {
      config.headers = config.headers || {};
      config.headers[CSRF_HEADER] = decodeURIComponent(csrfToken);
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err.response?.status;
    const message = err.response?.data?.message;

    if (status === 403 && message === 'Invalid CSRF token' && original && !original._csrfRetry) {
      original._csrfRetry = true;
      await ensureCsrfToken(true);
      return api(original);
    }

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !original.skipAuthRefresh &&
      !String(original.url || '').includes('/auth/refresh') &&
      !String(original.url || '').includes('/auth/login')
    ) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = api.post('/auth/refresh', null, { skipAuthRefresh: true }).finally(() => {
          refreshPromise = null;
        });
      }
      try {
        await refreshPromise;
        return api(original);
      } catch (refreshErr) {
        window.dispatchEvent(new Event('auth:expired'));
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export { ensureCsrfToken };
export default api;
