import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
    createTweet,
    deleteTweet,
    editTweet,
    getAllTweets,
    getFollowTweets,
    getUserTweets,
    updateTweetAudience,
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

export const getUserTweetsController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        if (!userId) {
            res.status(400).json({ InvalidInputError: 'Invalid input' });
        }
        try {
            const { success, message, payload } = await getUserTweets(userId);
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

export const getFollowTweetsController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        if (!userId) {
            res.status(400).json({ InvalidInputError: 'Invalid input' });
        }
        try {
            const { success, message, payload } = await getFollowTweets(userId);
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
        const audience = req.body.audience;
        const reply = req.body.reply;

        if (text === undefined && image === null) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
            return;
        }
        if (text !== undefined && text.length >= 300) {
            res.status(400).json({
                InvalidInput: 'Tweet input must be less that 280',
            });
            return;
        }

        try {
            const response = await createTweet(
                userId,
                text,
                image,
                audience,
                reply
            );
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

export const editTweetController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;
        const userId = req.user._id;
        const text = req.body.text;
        const image = req.file ? req.file.filename : null;
        const audience = req.body.audience;
        const reply = req.body.reply;

        console.log(image);

        try {
            const response = await editTweet(
                tweetId,
                userId,
                text,
                image,
                audience,
                reply
            );
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

export const deleteTweetController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;
        const userId = req.user._id;
        try {
            const response = await deleteTweet(tweetId, userId);
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

// Not used at the moment -> will be used to update a tweet audience.
export const updateAudienceController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;
        const audienceOption = req.body.audienceOption;

        if (!tweetId || !audienceOption) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
            return;
        }

        try {
            const response = await updateTweetAudience(
                req.user._id,
                tweetId,
                audienceOption
            );
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
