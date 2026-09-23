const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      message: 'Duplicate entry'
    });
  }

  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
