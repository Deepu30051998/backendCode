import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../logs';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(error: any, req: Request, res: Response, next: NextFunction): void {
    logger.error('ErrorHandler', 'Unhandled error occurred: %s', error.message || error);

    const status = error.httpCode || error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Internal Server Error',
      errors: error.errors || undefined,
    });
  }
}
