import ApiErrorResponse from '../utils/apiErrorResponse.js';

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
//Not found error will be triggered,
//when accessing some route which is not our predefined route,
//basically express will check this error first if route is not defined route.
//If got other case then it will go for errorHandler

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
