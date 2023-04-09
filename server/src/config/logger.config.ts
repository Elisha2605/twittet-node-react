import { createLogger, transports, format } from 'winston';

export function getLogger() {
    const logger = createLogger({
        level: 'info',
        transports: [
            new transports.Console({
                format: format.combine(
                    format.timestamp({
                        format: 'HH:mm:ss',
                    }),
                    format.colorize({ all: true }),
                    format.printf((info) => {
                        const { timestamp, level, message, ip, path } = info;
                        return `[${timestamp}] [${level}] [${ip}] [${path}] ${message}`;
                    })
                ),
            }),
        ],
    });
    return logger;
}
