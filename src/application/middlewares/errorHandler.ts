import { ErrorRequestHandler } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status';

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const result: { message: string; code?: string } = {
    message: error.message,
  };
  if (error.code) {
    result.code = error.code;
  }

  res.status(error.status || INTERNAL_SERVER_ERROR).json(result);
};

export default errorHandler;
