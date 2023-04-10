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

const router = express.Router();

declare module 'express-session' {
    interface SessionData extends UserContext {}
}

export const singUp = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await signup(
                req.body.email,
                req.body.password,
                req.body.passwordConfirmation
            );

            const { payload } = response;

            if (response.success) {
                res.status(200);
                res.send({ success: true, token: payload.token });
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

export const logIn = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await login((req.user as any)._id);

            const { payload } = response;

            if (response.success) {
                res.status(response.status);
                res.cookie(
                    'refreshToken',
                    payload.refreshToken,
                    COOKIE_OPTIONS
                );
                res.send({
                    isLoggedIn: true,
                    user: req.user,
                    success: true,
                    token: response.payload.token,
                    refreshToken: response.payload.refreshToken,
                });
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

export const logOUt = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { signedCookies = {} } = req;
        const { refreshToken } = signedCookies;
        const result = await logout(req.user._id, refreshToken);
        try {
            if (result.success) {
                res.clearCookie('refreshToken', COOKIE_OPTIONS);
                res.send({
                    isLoggedIn: false,
                    user: req.user,
                    success: true,
                    refreshToken: result.refreshToken,
                });
            } else {
                res.statusCode = 500;
                res.send(new Error(result.message));
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
