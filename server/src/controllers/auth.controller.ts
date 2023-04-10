import { UserContext } from 'src/types/custom';
import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { signup, login, logout } from 'src/services/auth.service';
import {
    COOKIE_OPTIONS,
    getRefreshToken,
    getToken,
    verifyToken,
} from 'src/utils/jwt.util';
import User from 'src/model/user.model';

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

export const context = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
        const { signedCookies = {} } = req;
        const { refreshToken } = signedCookies;
        const userId = verifyToken(refreshToken);

        const user = await User.findOne({ _id: userId });

        const tokenIndex = user.refreshToken.findIndex(
            (index) => index.refreshToken === refreshToken
        );

        if (tokenIndex === -1) {
            res.statusCode = 401;
            res.json(`coundn't find refresh token`);
        }

        const newToken = getToken({ _id: userId });

        const newRefreshToken = getRefreshToken({
            _id: userId,
        });
        user.refreshToken[tokenIndex].refreshToken = newRefreshToken;

        const saveduser = await user.save();
        res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
        res.json({
            isLoggedIn: true,
            user: req.user,
            success: true,
            token: newToken,
        });
        return saveduser;
    }
);

export default router;
