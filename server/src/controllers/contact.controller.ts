import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import {
    addContact,
    getAllContacts,
    getContactById,
    removeContact,
} from '../../src/services/contact.service';

export const getAllContactsController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user._id;
        if (!user) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }

        try {
            const { success, message, status, payload } = await getAllContacts(
                user
            );

            if (success) {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    contacts: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    contacts: payload,
                });
            }
            return;
        } catch (error) {
            next(error);
        }
    }
);

export const getContactByIdController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user._id;
        const contactId = req.params.id;
        if (!user || !contactId) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }

        try {
            const { success, message, status, payload } = await getContactById(
                user,
                contactId
            );

            if (success) {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    contact: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    contact: payload,
                });
            }
            return;
        } catch (error) {
            next(error);
        }
    }
);

export const addContactController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user._id;
        const newUser = req.params.id;
        if (!user || !newUser) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }

        try {
            const { success, message, status, payload } = await addContact(
                user,
                newUser
            );

            if (success) {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    contact: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    status: status,
                    message: message,
                    contact: payload,
                });
            }
            return;
        } catch (error) {
            next(error);
        }
    }
);

export const removeContactController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user._id;
        const userToremove = req.params.id;
        if (!user || !userToremove) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }

        try {
            const { success, message, status, payload } = await removeContact(
                user,
                userToremove
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
