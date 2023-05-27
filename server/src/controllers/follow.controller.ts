import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
    approveFollowRequest,
    declineFollowRequest,
    getUserFollows,
    sendFollowRequest,
} from '../../src/services/follow.service';

export const getUserFollowsController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;

        try {
            const response = await getUserFollows(userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
);

export const getAuthUserFollowsController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;

        try {
            const response = await getUserFollows(userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
);

export const followRequestController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const sender = req.user._id;
        const receiver = req.params.id;

        try {
            const { success, message, payload } = await sendFollowRequest(
                sender,
                receiver
            );

            if (success) {
                res.status(200).json({
                    success: success,
                    message: message,
                    response: payload,
                });
            } else {
                res.status(500).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const approveFollowRequestController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const receiver = req.body.receiverId;
        const sender = req.body.senderId;

        try {
            const { success, message, payload } = await approveFollowRequest(
                receiver,
                sender
            );

            if (success) {
                res.status(200).json({
                    success: success,
                    message: message,
                    response: payload,
                });
            } else {
                res.status(500).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const declineFollowRequestController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const receiver = req.body.receiverId;
        const sender = req.body.senderId;

        try {
            const { success, message, payload } = await declineFollowRequest(
                receiver,
                sender
            );

            if (success) {
                res.status(200).json({
                    success: success,
                    message: message,
                    response: payload,
                });
            } else {
                res.status(500).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);
