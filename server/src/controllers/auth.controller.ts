import { UserContext } from 'src/types/custom';
import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { signup, login, logout } from 'src/services/auth.service';
import { COOKIE_OPTIONS } from 'src/utils/jwt.util';

const router = express.Router();

declare module 'express-session' {
    interface SessionData extends UserContext {}
}

export const singUp = asyncHandler(async (req: Request, res: Response) => {
    const result = await signup(
        req.body.email,
        req.body.password,
        req.body.passwordConfirmation
    );
    if (result.success) {
        res.status(200);
        res.send({ success: true, token: result.token });
    } else {
        res.send(result);
    }
});

export const logIn = asyncHandler(async (req: Request, res: Response) => {
    const result = await login((req.user as any)._id);
    if (result.success) {
        res.status(200);
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

export const logOUt = asyncHandler(async (req: Request, res: Response) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    const result = await logout(req.user._id, refreshToken);
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
});

export default router;
