class ErrorHandler extends Error {
  constructor(statusCode, mess) {
    super(mess);
    (this.statusCode = statusCode),
      Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;