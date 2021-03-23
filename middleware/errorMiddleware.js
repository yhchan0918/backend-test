const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//asyncHandler from npm will handle all the catch by using this errorHandler function
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV == 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
