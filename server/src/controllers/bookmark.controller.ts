import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import {
    getUserSavedTweets,
    saveTweetToBookmark,
} from '../../src/services/bookmark.service';

export const getUserSavedTweetController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;

        try {
            const { success, message, status, payload } =
                await getUserSavedTweets(userId);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    tweets: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const saveTweetToBookmarkController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        const tweetId = req.params.id;

        try {
            const { success, message, status, payload } =
                await saveTweetToBookmark(userId, tweetId);
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
