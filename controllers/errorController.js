const AppError = require('../utils/appError')

const handleCastErrorDB = () => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

const handleDuplicateFieldsDB = () => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

const handleJWTError = err => new AppError('Invalid token. Please login again!', 401);
const handleJWTExpiredError = err => new AppError('Your token has expired! Please log in again.', 401)

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    console.error('ERROR 💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode ||= 500;
  err.status ||= 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err));

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
}
