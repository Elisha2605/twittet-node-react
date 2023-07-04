import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import {
    getConversation,
    sendMessage,
} from '../../src/services/message.service';

export const getConversationController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const authUser = req.user._id;
        const otherUser = req.params.id;

        if (!authUser || !otherUser) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }
        try {
            const { success, message, status, payload } = await getConversation(
                authUser,
                otherUser
            );

            if (success) {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    conversation: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    conversation: payload,
                });
            }
            return;
        } catch (error) {
            next(error);
        }
    }
);

export const sendMessageController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const sender = req.user._id;
        const receiver = req.params.id;
        const text = req.body.text;

        if (!sender || !receiver) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }

        if (text !== undefined && text.length > 700) {
            res.status(400).json({
                InvalidInput:
                    'message text must not be greater than 200 characters',
            });
            return;
        }
        try {
            const { success, message, status, payload } = await sendMessage(
                sender,
                receiver,
                text
            );

            if (success) {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    payload: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    payload: payload,
                });
            }
            return;
        } catch (error) {
            next(error);
        }
    }
);
