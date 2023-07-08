import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import {
    getMentionsNotification,
    getAllNotification,
    updateNotificationsState,
    getMessageNotification,
    removeMessageNotificaiton,
} from '../../src/services/notification.service';

export const getAllNotificationController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        if (!userId) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }
        try {
            const { success, message, status, payload } =
                await getAllNotification(userId);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    notifications: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const getMentionsNotificationController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        if (!userId) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }
        try {
            const { success, message, status, payload } =
                await getMentionsNotification(userId);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    notifications: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const getMessageNotificationController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        try {
            const { success, message, status, payload } =
                await getMessageNotification(userId);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    msgNotification: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const removeMessageNotificaitonController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        try {
            const { success, message, status } =
                await removeMessageNotificaiton(userId);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    result: true,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const updateNotificationsStateController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        try {
            const { success, message, status, payload } =
                await updateNotificationsState(userId);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    tweet: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);
