import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
    getAllUsers,
    getUserById,
    getAuthUserInfo,
} from 'src/services/user.service';

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

export const info = asyncHandler(async (req: Request, res: Response) => {
    const user = await getUserInfo(req.user._id);
    res.send(user);
});

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
