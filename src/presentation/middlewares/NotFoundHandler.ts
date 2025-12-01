import { Request, Response } from 'express';

export class NotFoundHandler {
  static handle(req: Request, res: Response): void {
    res.status(404).json({
      error: 'Route not found',
      message: `Cannot ${req.method} ${req.path}`,
    });
  }
}

