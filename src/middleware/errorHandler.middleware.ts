import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.status || 500;
  let errorMessage = err.errorMessage || "Internal server error";

  if (err.code === 11000) {
    statusCode = 400;
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    errorMessage = `${value} already exists. Please use a different value.`;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((el: any) => el.message);
    errorMessage = errors.join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    errorMessage = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorMessage = "Invalid token. Please login again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    errorMessage = "Token expired. Please login again.";
  }

  console.log(err);

  res.status(statusCode).json({
    status: "fail",
    error: errorMessage,
    name: err.name,
  });
};
