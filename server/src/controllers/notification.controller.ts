import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import {
    getMentionsNotification,
    getLikesNotification,
    updateNotificationsState,
} from '../../src/services/notification.service';

export const getLikesNotificationController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        if (!userId) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }
        try {
            const { success, message, status, payload } =
                await getLikesNotification(userId);
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

export const updateNotificationsStateController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const notificationIds = req?.body?.notificationIds;
        if (!notificationIds) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }
        try {
            const { success, message, status, payload } =
                await updateNotificationsState(notificationIds);
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