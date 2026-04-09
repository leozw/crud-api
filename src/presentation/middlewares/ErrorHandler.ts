import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { ValidationError } from '../../domain/errors/ValidationError';

export class ErrorHandler {
  static handle(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    console.error('Error:', err);

    if (err instanceof NotFoundError) {
      res.status(404).json({
        error: 'Not found',
        message: err.message,
      });
      return;
    }

    if (err instanceof ValidationError) {
      res.status(400).json({
        error: 'Validation failed',
        details: err.errors.map((e) => e.message),
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: err.message || 'An unexpected error occurred',
    });
  }
}



