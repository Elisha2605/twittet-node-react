import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import {
    deleteMessage,
    getConversation,
    replyToMessage,
    sendMessage,
    updateMessageStatus,
} from '../../src/services/message.service';

export const getConversationController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const authUser = req.user._id;
        const receiver = req.params.id;

        if (!authUser || !receiver) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }
        try {
            const { success, message, status, payload } = await getConversation(
                authUser,
                receiver
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
        const image = req.files?.['messageImage']?.[0]?.filename ?? null;
        const replyMessage = req.body.replyMessage;

        if (!sender || !receiver) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }

        if (!text && image === null) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
            return;
        }

        if (text !== undefined && text.length > 10000) {
            res.status(400).json({
                InvalidInput:
                    'message text must not be greater than 10.000 characters',
            });
            return;
        }
        try {
            const { success, message, status, payload } = await sendMessage(
                sender,
                receiver,
                text,
                image,
                replyMessage
            );

            if (success) {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    msg: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    msg: payload,
                });
            }
            return;
        } catch (error) {
            next(error);
        }
    }
);

export const replyToMessageController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body);
        const messageId = req.params.id;
        const sender = req.user._id;
        const text = req.body.text;
        const image = req.files?.['messageImage']?.[0]?.filename ?? null;

        if (!sender || !messageId) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }

        if (text === undefined && image === null) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
            return;
        }

        if (text !== undefined && text.length > 10000) {
            res.status(400).json({
                InvalidInput:
                    'message text must not be greater than 10.000 characters',
            });
            return;
        }
        try {
            const { success, message, status, payload } = await replyToMessage(
                messageId,
                sender,
                text,
                image
            );

            if (success) {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    msg: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    msg: payload,
                });
            }
            return;
        } catch (error) {
            next(error);
        }
    }
);

export const updateMessageStatusController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const sender = req.params.id;
        const receiver = req.user._id;

        if (!receiver) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }

        try {
            const { success, message, status, payload } =
                await updateMessageStatus(sender, receiver);

            if (success) {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    msg: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    msg: payload,
                });
            }
            return;
        } catch (error) {
            next(error);
        }
    }
);

export const deleteMessageController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const sender = req.user._id;
        const messageId = req.params.id;
        const isDeleteForBoth = req.body.deleteForBoth;

        if (!messageId) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }

        try {
            const { success, message, status, payload } = await deleteMessage(
                sender,
                messageId,
                isDeleteForBoth
            );

            if (success) {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    msg: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    msg: payload,
                });
            }
            return;
        } catch (error) {
            next(error);
        }
    }
);
