import { UserContext } from 'src/types/user.type';
import express, { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
    signup,
    login,
    logout,
    getUserContext,
} from 'src/services/auth.service';
import { COOKIE_OPTIONS, verifyToken } from 'src/utils/jwt.util';
import passport from 'passport';
import { IVerifyOptions } from 'passport-local';

const router = express.Router();

declare module 'express-session' {
    interface SessionData extends UserContext {}
}

export const singUp = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await signup(
                req.body.email,
                req.body.name,
                // req.body.username,
                req.file ? req.file.filename : null,
                req.body.coverImage,
                req.body.bio,
                req.body.password,
                req.body.passwordConfirmation
            );

            const { payload } = response;
            if (response.success) {
                res.status(response.status);
                res.send({
                    success: response.success,
                    message: response.message,
                    status: response.status,
                    user: payload.user,
                }); // return approprite user properties.
            } else {
                res.status(response.status);
                res.send(response);
            }
        } catch (error) {
            res.status(error.status).json({
                sucess: error.success,
                message: error.message,
                status: error.status,
            });
            next(error);
        }
    }
);

export const logIn = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.authenticate(
        'local',
        { session: false },
        async (err: Error, user: any, info: IVerifyOptions) => {
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
                const response = await login(user._id);

                const { payload } = response;

                if (response.success) {
                    res.cookie(
                        'refreshToken',
                        payload.refreshToken,
                        COOKIE_OPTIONS
                    );
                    res.send({
                        isLoggedIn: true,
                        user: req.user,
                        success: true,
                        token: payload.token,
                    });
                } else {
                    res.status(response.status);
                    res.send(response.message);
                }
            } catch (err) {
                next(err);
            }
        }
    )(req, res, next);
};

export const logOUt = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { signedCookies = {} } = req;
        const { refreshToken } = signedCookies;
        const response = await logout(req.user._id, refreshToken);
        try {
            if (response.success) {
                res.clearCookie('refreshToken', COOKIE_OPTIONS);
                res.send({
                    success: true,
                    isLoggedIn: false,
                    message: response.message,
                });
            } else {
                res.json(response.message);
                res.send(response);
            }
        } catch (error) {
            next(error);
        }
    }
);

export const context = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { signedCookies = {} } = req;
        const { refreshToken } = signedCookies;
        const userId = verifyToken(refreshToken);

        try {
            const response = await getUserContext(userId, refreshToken);

            const { payload } = response;

            if (response.success) {
                res.status(response.status);
                res.cookie(
                    'refreshToken',
                    payload.newRefreshToken,
                    COOKIE_OPTIONS
                );
                res.json({
                    isLoggedIn: true,
                    user: req.user,
                    success: true,
                    token: payload.newToken,
                });
            }
        } catch (error) {
            next(error);
        }
    }
);

export default router;
