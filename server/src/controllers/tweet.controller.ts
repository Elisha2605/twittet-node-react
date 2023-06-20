import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
    reply,
    createTweet,
    deleteTweet,
    editTweet,
    getAllTweets,
    getFollowTweets,
    getTweetById,
    getUserTweetReplies,
    getUserTweets,
    reTweet,
    updateTweetAudience,
    getTweetReplies,
} from '../../src/services/tweet.service';

export const getAllTweetsController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        try {
            const { success, message, payload, status } = await getAllTweets(
                userId
            );
            if (success) {
                res.status(200).json({
                    message: message,
                    status: status,
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

export const getTweetRepliesController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;
        const userId = req.user._id;
        try {
            const { success, message, payload, status } = await getTweetReplies(
                tweetId,
                userId
            );
            if (success) {
                res.status(200).json({
                    message: message,
                    status: status,
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

export const getUserTweetRepliesController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        try {
            const { success, message, payload, status } =
                await getUserTweetReplies(userId);
            if (success) {
                res.status(200).json({
                    message: message,
                    status: status,
                    replies: payload,
                });
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
        const visitorId = req.user._id;
        if (!userId || !visitorId) {
            res.status(400).json({ InvalidInputError: 'Invalid input' });
        }
        try {
            const { success, message, payload } = await getUserTweets(
                userId,
                visitorId
            );
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
        const userId = req.user._id;
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
        const image = req.files?.['tweetImage']?.[0]?.filename ?? null;
        const audience = req.body.audience;
        const reply = req.body.reply;

        if (text === undefined && image === null) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
            return;
        }
        if (text !== undefined && text.length > 280) {
            res.status(400).json({
                InvalidInput:
                    'Tweet text must not be greater than 280 characters',
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

export const replyController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;
        const userId = req.user._id;
        const text = req.body.text;
        const image = req.files?.['tweetImage']?.[0]?.filename ?? null;

        if (text === undefined && image === null) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
            return;
        }
        if (text !== undefined && text.length > 280) {
            res.status(400).json({
                InvalidInput:
                    'Reply text must not be greater than 280 characters',
            });
            return;
        }

        try {
            const response = await reply(tweetId, userId, text, image);
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

export const reTweetController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;
        const userId = req.user._id;
        const text = req.body.text;
        const image = req.files?.['tweetImage']?.[0]?.filename ?? null;
        const audience = req.body.audience;
        const reply = req.body.reply;

        if (tweetId === undefined) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
            return;
        }
        if (text !== undefined && text.length > 280) {
            res.status(400).json({
                InvalidInput:
                    'Tweet text must not be greater than 280 characters',
            });
            return;
        }

        try {
            const { success, message, payload, status } = await reTweet(
                tweetId,
                userId,
                text,
                image,
                audience,
                reply
            );
            if (success) {
                res.status(200).json({
                    success: success,
                    message: message,
                    status: status,
                    tweet: payload,
                });
            } else {
                res.status(500).json({ success, message });
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
        const image = req.files?.['tweetImage']?.[0]?.filename ?? null;
        const audience = req.body.audience;
        const reply = req.body.reply;

        if (text !== undefined && text.length > 280) {
            res.status(400).json({
                InvalidInput:
                    'Tweet text must not be greater than 280 characters',
            });
            return;
        }

        try {
            const response = await editTweet(
                tweetId,
                userId,
                text ? text : null,
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
                res.status(200).send({
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

export const getTweetByIdController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;

        if (!tweetId) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
            return;
        }

        try {
            const { success, payload } = await getTweetById(tweetId);
            if (success) {
                res.status(200).send({
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
