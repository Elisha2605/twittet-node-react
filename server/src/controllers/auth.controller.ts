import { UserContext } from '../../src/types/user.type';
import express, { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
    signup,
    login,
    logout,
    // getUserContext,
} from '../../src/services/auth.service';
import {
    COOKIE_OPTIONS,
    getRefreshToken,
    getToken,
    verifyToken,
} from '../../src/utils/jwt.util';
import passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import User from '../../src/models/user.model';

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
                req.files?.['avatar']?.[0]?.filename ?? null,
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
                        success: true,
                        isLoggedIn: true,
                        user: payload.user,
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

        User.findOne({ _id: userId }).then(
            (user) => {
                if (user) {
                    const tokenIndex = user.refreshToken.findIndex(
                        (item) => item.refreshToken === refreshToken
                    );
                    if (tokenIndex === -1) {
                        res.statusCode = 401;
                        res.json('Couldnt find refresh token against user');
                    } else {
                        const newRefreshToken = getRefreshToken({
                            _id: userId,
                        });
                        const newToken = getToken({ _id: userId });

                        // console.log('New Refresh token: ' + newRefreshToken);
                        // console.log('New Access token: ' + newToken);
                        user.refreshToken[tokenIndex].refreshToken =
                            newRefreshToken;

                        user.save();

                        res.cookie(
                            'refreshToken',
                            newRefreshToken,
                            COOKIE_OPTIONS
                        );
                        res.json({
                            isLoggedIn: true,
                            user: req.user,
                            success: true,
                            token: newToken,
                        });
                    }
                } else {
                    res.statusCode = 401;
                    res.send('Unauthorized');
                }
            },
            (err) => next(err)
        );
    }
);

export default router;
