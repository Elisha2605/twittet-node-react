import { NextFunction, Request, Response } from 'express';
import User, { IUser } from 'src/model/user.model';
import passport from 'passport';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CookieOptions } from 'express';

dotenv.config();

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { userId: string };
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        req.user = user as IUser;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
};

export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: true,
    signed: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, //eval(process.env.REFRESH_TOKEN_EXPIRY),
    sameSite: 'none',
};

export const getToken = (user: any) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: eval(process.env.SESSION_EXPIRTY),
    });
};

export const getRefreshToken = (user: any) => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
    });
    return refreshToken;
};

export const verifyToken = (refreshToken: string): string => {
    console.log('Log from (authencation.ts) ' + refreshToken);
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log('Log from (authencation.ts) ' + payload);
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
