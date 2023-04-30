import { NextFunction, Request, Response } from 'express';

import asyncHandler from 'express-async-handler';
import { getUserFollows, sendFollowRequest } from 'src/services/follow.service';

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

export const followRequestController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const sender = req.body.senderId;
        const receiver = req.body.receiverId;

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
