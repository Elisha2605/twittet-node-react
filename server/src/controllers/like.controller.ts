import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getUserLikedTweet, likeTweet } from '../../src/services/like.service';

export const getUserLikedTweetsController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        if (!userId) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }
        try {
            const { success, message, payload, status } =
                await getUserLikedTweet(userId);

            if (success) {
                res.status(200).json({
                    success: success,
                    status: status,
                    message: message,
                    tweets: payload,
                });
            } else {
                res.status(500).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const likeController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;
        const userId = req.user._id;
        if (!userId || !tweetId) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }
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
                    likedTweet: payload,
                });
            } else {
                res.status(500).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);
