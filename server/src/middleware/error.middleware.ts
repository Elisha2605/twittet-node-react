import { Request, Response, NextFunction } from 'express';
import { mailError } from './email.middleware';

export default function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }
    if (process.env.NODE_ENV !== 'development') {
        mailError(err, req);
    }

    if (err.message) {
        res.status(500).json({
            error: err.message,
        });
    }
    res.status(500).json({
        error: 'Internal server error',
    });
}
