import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { likeTweet } from 'src/services/like.service';

export const likeTweetController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;
        const userId = req.user._id;

        try {
            const { success, message, payload, status } = await likeTweet(
                tweetId,
                userId
            );

            if (success) {
                res.status(200).json({
                    success: success,
                    status: status,
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
