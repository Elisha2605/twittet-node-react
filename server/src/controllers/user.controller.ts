import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
    getAllUsers,
    getUserById,
    getAuthUserInfo,
    searchUsers,
    editUserProfile,
    editUserName,
    editEmail,
    editProtected,
    searchUserByEmail,
    searchUserByUserName,
} from '../../src/services/user.service';
import {
    validate_name,
    validate_website,
} from '../../src/utils/validation.util';

export const users = asyncHandler(
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const { success, message, status, payload } = await getAllUsers();
            if (success) {
                res.status(200).json({ users: payload });
            } else {
                res.status(500).json({ success: message, status: status });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const me = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        if (!userId) {
            res.status(400).json({ InvalidInputError: 'Invalid user ID' });
        }
        try {
            const { success, message, status, payload } = await getAuthUserInfo(
                userId
            );
            if (success) {
                res.status(200).json({ user: payload });
            } else {
                res.status(500).json({ success: message, status: status });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const info = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        if (!userId) {
            res.status(400).json({ InvalidInputError: 'Invalid user ID' });
        }
        try {
            const { success, message, status, payload } = await getUserById(
                userId
            );
            if (success) {
                res.status(200).json({ user: payload });
            } else {
                res.status(500).json({ success: message, status: status });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const searchUsersController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const searchTerm = req.query.q?.toString().trim();

        try {
            const { success, message, status, payload } = await searchUsers(
                searchTerm
            );
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    users: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const searchUserByEmailController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const searchTerm = req.query.q?.toString().trim();

        try {
            const { success, message, status, payload } =
                await searchUserByEmail(searchTerm);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    emails: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const searchUserByUserNameController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const searchTerm = req.query.q?.toString().trim();

        try {
            const { success, message, status, payload } =
                await searchUserByUserName(searchTerm);
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    usernames: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const editUserProfileController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id; // needs validation
        const coverImage = req.files?.['cover']?.[0]?.filename ?? null;
        const avatar = req.files?.['avatar']?.[0]?.filename ?? null;
        const name = validate_name(req.body.name);
        const bio = req.body.bio; // needs validation
        const location = req.body.location; // needs validation
        const website = validate_website(req.body.website);

        if (!userId || !name) {
            res.status(400).json({ inputError: 'Input error' });
            return;
        }

        if (name.trim().length > 30) {
            res.status(400).json({
                inputError: 'name can not be more than 30 charactors',
            });
            return;
        }

        if (bio.trim().length > 500) {
            res.status(400).json({
                inputError: 'Bio can not be more than 500 charactors',
            });
            return;
        }

        if (location.trim().length > 90) {
            res.status(400).json({
                inputError: 'Location can not be more than 90 charactors',
            });
            return;
        }

        if (website.trim().length > 70) {
            res.status(400).json({
                inputError: 'Website can not be more than 70 charactors',
            });
            return;
        }

        try {
            const { success, message, status, payload } = await editUserProfile(
                userId,
                coverImage,
                avatar,
                name,
                bio,
                location,
                website as string
            );
            if (success) {
                res.json({
                    success: success,
                    status: status,
                    message: message,
                    user: payload,
                });
            } else {
                res.status(status).json({ success, message });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const editUsernameController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        const username = req.body.username;
        if (!username) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
        }
        try {
            const { success, message, status, payload } = await editUserName(
                userId,
                username
            );
            if (success) {
                res.status(200).json({
                    success: success,
                    message: message,
                    status: status,
                    user: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    message: message,
                    status: status,
                });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const editEmailController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        const email = req.body.email;
        if (!userId || !email) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
        }
        try {
            const { success, message, status, payload } = await editEmail(
                userId,
                email
            );
            if (success) {
                res.status(200).json({
                    success: success,
                    message: message,
                    status: status,
                    user: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    message: message,
                    status: status,
                });
            }
        } catch (error) {
            next(error);
        }
    }
);

export const editProtectedController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user._id;
        const isProtected = req.body.isProtected;
        if (!userId || !isProtected) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
        }

        if (isProtected.length === 0) {
            res.status(400).json({ InvalidInputError: 'Invalid Input' });
        }
        try {
            const { success, message, status, payload } = await editProtected(
                userId,
                isProtected
            );
            if (success) {
                res.status(200).json({
                    success: success,
                    message: message,
                    status: status,
                    user: payload,
                });
            } else {
                res.status(status).json({
                    success: success,
                    message: message,
                    status: status,
                });
            }
        } catch (error) {
            next(error);
        }
    }
);

// temp -> to be remove
export const image = asyncHandler(async (req: Request, res: Response) => {
    if (req.file) {
        console.log(req.file);
    }
    console.log(req.body);
    res.send({
        body: req.body.name,
        file: req.file.filename,
    });
});
