import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CookieOptions } from 'express';

dotenv.config();

export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: true,
    signed: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'none',
};

export const getToken = (userId: any) => {
    const token = jwt.sign(userId, process.env.JWT_SECRET, {
        expiresIn: eval(process.env.SESSION_EXPIRTY),
    });
    return token;
};

export const getRefreshToken = (userId: any) => {
    const refreshToken = jwt.sign(userId, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
    });
    return refreshToken;
};

export const verifyToken = (refreshToken: string): string => {
    // console.log('Log from (authencation.ts) ' + refreshToken);
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    return (payload as JwtPayload)._id;
};

export const verifyUser = () => {
    return (req: Request, res: Response, next: NextFunction): void => {
        passport.authenticate(
            'jwt',
            { session: false, failureMessage: true },
            (err: Error, user: any, info: any) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    const error = info.message || 'Unauthorized';
                    return res.status(401).json({ info: error });
                }
                req.user = user;
                next();
            }
        )(req, res, next);
    };
};
