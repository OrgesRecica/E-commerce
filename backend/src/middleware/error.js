export function notFound(req, res, _next) {
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  if (process.env.NODE_ENV !== 'production') console.error(err);
  res.status(status).json({ message });
}
