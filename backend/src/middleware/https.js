export function enforceHttps(req, res, next) {
  if (process.env.NODE_ENV !== 'production') return next();
  if (req.secure || req.get('x-forwarded-proto') === 'https') return next();
  return res.status(400).json({ message: 'HTTPS is required' });
}
