import { UserContext } from 'src/config/custom.config';
import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { signup, login } from 'src/services/user.service';
import { COOKIE_OPTIONS } from 'src/authentication';
import passport from 'passport';
import { NextFunction } from 'express-serve-static-core';

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

export const logIn = asyncHandler(async (req: Request, res: Response) => {
    const result = await login((req.user as any)._id);
    if (result.succeded) {
        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
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
});

export default router;
