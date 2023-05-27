import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../../src/models/user.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { userId: string };
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        req.authUser = user as IUser;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
};
