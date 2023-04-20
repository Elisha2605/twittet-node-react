import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { createTweet, getAllTweets } from 'src/services/tweet.service';

export const getAllTweetsController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { success, message, payload } = await getAllTweets();
            if (success) {
                res.status(200).json({ tweets: payload });
            } else {
                res.status(500).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const createTweetController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        const text = req.body.text;
        const image = req.file ? req.file.filename : null;
        try {
            const response = await createTweet(userId, text, image);
            const { payload } = response;
            if (response.success) {
                res.send({
                    success: response.success,
                    message: response.message,
                    status: response.status,
                    tweet: payload,
                });
            }
        } catch (error) {
            res.status(error.status).json({
                sucess: error.success,
                message: error.message,
                status: error.status,
            });
            next(error);
        }
    }
);
