import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
    requestPasswordReset,
    resetPassword,
    verifyPasswordVerificationToken,
} from 'src/services/passwordReset.service';

export const requestPasswordResetController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        const email = req.body.email;

        try {
            const { success, message, status, payload } =
                await requestPasswordReset(userId, email);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    request: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const verifyPasswordVerificationTokenController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        const token = req.params.token;

        try {
            const { success, message, status, payload } =
                await verifyPasswordVerificationToken(userId, token);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    token: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const resetPasswordController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        const password = req.body.password;
        const token = req.body.token;

        try {
            const { success, message, status, payload } = await resetPassword(
                userId,
                password,
                token
            );
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    reset: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);