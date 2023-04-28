import { NextFunction, Request, Response } from 'express';

import asyncHandler from 'express-async-handler';
import {
    getAuthUserFollows,
    sendFollowRequest,
} from 'src/services/follow.service';

export const getAuthUserFollowsController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;

        try {
            const response = await getAuthUserFollows(userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
);

export const followRequestController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const incommingReq = req.user._id;
        const receiver = req.params.id;

        try {
            const { success, message, payload } = await sendFollowRequest(
                incommingReq,
                receiver
            );

            if (success) {
                res.status(200).json({
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
