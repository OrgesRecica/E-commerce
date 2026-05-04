import { ZodError } from 'zod';

function formatZodErrors(error) {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

export function validateSchema(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation failed', errors: formatZodErrors(parsed.error) });
    }

    req.body = parsed.data.body ?? req.body;
    req.params = parsed.data.params ?? req.params;
    req.query = parsed.data.query ?? req.query;
    return next();
  };
}

export function validationErrorHandler(err, _req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation failed', errors: formatZodErrors(err) });
  }
  return next(err);
}
