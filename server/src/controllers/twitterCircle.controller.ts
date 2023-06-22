import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import {
    addUserToTwitterCircle,
    getUserTwitterCircleMembers,
} from '../../src/services/twitterCircle.service';

export const getUserTwitterCircleMembersController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        if (!userId) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }
        try {
            const { success, message, status, payload } =
                await getUserTwitterCircleMembers(userId);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    user: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const addUserToTwitterCircleController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        const addId = req.params.id;
        if (!userId || !addId) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }
        try {
            const { success, message, status, payload } =
                await addUserToTwitterCircle(userId, addId);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    user: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);
