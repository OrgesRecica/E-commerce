export function notFound(req, res, _next) {
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const expose = status < 500 || process.env.NODE_ENV !== 'production';
  const message = expose ? err.message || 'Internal server error' : 'Internal server error';

  if (status >= 500) {
    console.error(JSON.stringify({
      type: 'error',
      at: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status,
      message: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    }));
  }

  res.status(status).json({ message });
}
