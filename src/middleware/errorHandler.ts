import type { Request, Response } from 'express';
import logger from './logger';

interface ErrorResponse {
  status: number;
  message: string;
}

export const errorHandler = (
  err: ErrorResponse,
  _req: Request,
  res: Response
): void => {
  const error: ErrorResponse = {
    status: err.status || 500,
    message: err.message || 'Internal Server Error'
  };

  logger.error(err);

  res.status(error.status).json({ error });
};
