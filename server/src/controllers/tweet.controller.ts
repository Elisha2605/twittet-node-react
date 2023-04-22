import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
    createTweet,
    deleteTweet,
    getAllTweets,
} from 'src/services/tweet.service';

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

        if (text === undefined && image === null) {
            res.status(400).json({ InvalidInput: 'Invalid Input' });
            return;
        }
        if (text !== undefined && text.length >= 300) {
            res.status(400).json({
                InvalidInput: 'Tweet input must be less that 280',
            });
            return;
        }

        try {
            const response = await createTweet(userId, text, image);
            const { payload } = response;
            if (response.success) {
                res.status(response.status).send({
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

export const deleteTweetController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;
        try {
            const response = await deleteTweet(tweetId, req.user._id);
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