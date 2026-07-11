export const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Replace req properties with validated/sanitized data
    req.body = parsed.body;
    req.query = parsed.query;
    req.params = parsed.params;
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      console.error(`[${new Date().toISOString()}] Zod Validation Error:`, error.issues);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues || [],
      });
    }
    next(error);
  }
};
