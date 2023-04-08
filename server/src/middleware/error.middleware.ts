import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Internal server error',
    });
}
