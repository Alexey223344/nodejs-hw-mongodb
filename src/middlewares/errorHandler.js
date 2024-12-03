import { HttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  error instanceof HttpError
    ? res.status(error.status).json({
        status: error.status,
        message: error.name,
        data: error,
      })
    : res.status(500).json({
        status: 500,
        message: 'Something went wrong',
        data: error.message,
      });
};