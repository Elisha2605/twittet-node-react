import passport from 'passport';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CookieOptions } from 'express';

dotenv.config();

export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    // Since localhost is not having https protocol,
    // secure cookies do not work correctly (in postman)
    secure: true, //process.env.NODE_ENV !== 'development',
    signed: true,
    maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY),
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
    return passport.authenticate('jwt', {
        session: false,
        //failureNavigate: '/login',
        failureMessage: true,
    });
};

// TODO: verifyRole function.
