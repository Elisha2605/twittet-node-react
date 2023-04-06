import { UserContext } from 'src/config/custom.config';
import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { signup, login } from 'src/services/auth.service';
import { COOKIE_OPTIONS } from 'src/authentication';
import passport from 'passport';
import { NextFunction } from 'express-serve-static-core';
import { IUser } from 'src/model/user.model';
import { IVerifyOptions } from 'passport-local';

const router = express.Router();

declare module 'express-session' {
    interface SessionData extends UserContext {}
}

export const singUp = asyncHandler(async (req: Request, res: Response) => {
    const result = await signup(req.body.email, req.body.password);
    if (result.succeded) {
        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
        res.send({ success: true, token: result.token });
    } else {
        res.send(result);
    }
});

export const logIn = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.authenticate(
        'local',
        async (err: Error, user: IUser, info: IVerifyOptions) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: info.message,
                });
            }
            try {
                const result = await login(user._id);
                if (result.succeded) {
                    res.cookie(
                        'refreshToken',
                        result.refreshToken,
                        COOKIE_OPTIONS
                    );
                    res.send({
                        isLoggedIn: true,
                        user: req.user,
                        success: true,
                        token: result.token,
                        refreshToken: result.refreshToken,
                    });
                } else {
                    res.statusCode = 500;
                    res.send(new Error(result.message));
                }
            } catch (err) {
                next(err);
            }
        }
    )(req, res, next);
};

export default router;
