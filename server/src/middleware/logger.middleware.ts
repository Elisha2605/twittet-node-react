import { Request, Response, NextFunction, response } from 'express';
import { getLogger } from 'src/config/logger.config';

const logger = getLogger();

export function loggerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const start = Date.now();
    res.on('finish', () => {
        const responseTime = Date.now() - start;
        const method = req.method || 'UNKNOWN_METHOD';
        const path = req.path || 'UNKNOWN_PATH';
        const ip = req.ip;
        const statusCode = res.statusCode;
        const logMessage = {
            message: `Request ${method} ${path} ${statusCode} ${res.statusMessage} - ${responseTime}ms`,
            timestamp: new Date().toLocaleTimeString(),
            ip,
            path,
            statusCode,
            responseTime,
        };
        if (statusCode >= 500) {
            logger.error(logMessage);
        } else {
            logger.info(logMessage);
        }
    });
    next();
}
