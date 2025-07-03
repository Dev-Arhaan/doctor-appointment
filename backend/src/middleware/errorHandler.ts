import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response: ApiResponse<never> = {
    success: false,
    error: message
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse<never> = {
    success: false,
    error: `Route ${req.originalUrl} not found`
  };
  res.status(404).json(response);
};