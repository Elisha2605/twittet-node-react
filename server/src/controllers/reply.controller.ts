import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
    createReply,
    getAllTweetReplies,
    getReplyById,
} from '../../src/services/reply.service';

export const getAllTweetRepliesController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;

        try {
            const { success, message, status, payload } =
                await getAllTweetReplies(tweetId);
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

export const getReplyByIdController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const replyId = req.params.id;

        try {
            const { success, message, status, payload } = await getReplyById(
                replyId
            );
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

export const createReplyController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const tweetId = req.params.id;
        const userId = req.user._id;
        const text = req.body.text;
        const image = req.files?.['replyImage']?.[0]?.filename ?? null;

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
            const response = await createReply(tweetId, userId, text, image);
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
