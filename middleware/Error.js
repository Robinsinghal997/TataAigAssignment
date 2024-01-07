// const ErrorHandler = require("../Utils/errorhandler");

const ErrorHandler = require("../Utils/errorhandler");

module.exports = (err, req, res, next) => {
  (err.statusCode = err.statusCode || 500),
    (err.mess = err.mess || "Internal Server Error");

  // Wrong Mongodb Errors

  if (err.name === "CastError") {
    const message = `resource not found . Invalid : ${err.path}`;
    err = new ErrorHandler(404, message);
  }

  // mongooese duplicate key error

  if (err.code === 11000) {
    const message = `duplidate ${Object.keys(err.keyValue)} Entered `;
    err = new ErrorHandler(404, message);
  }

  // wrong jwt Token

  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is Invalid, try again `;
    err = new ErrorHandler(404, message);
  }

  // jwt expire error 
  if (err.name === "TokenExpiredError") {
    const message = `Json web token Expired, try again `;
    err = new ErrorHandler(404, message);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};