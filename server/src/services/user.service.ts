import bcrypt from 'bcryptjs';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { Session } from 'express-session';
import User, { IUser } from 'src/model/user.model';

interface CustomSession extends Session {
    refreshToken?: string;
}

export const createUser = async (
    email: string,
    password: string
): Promise<IUser> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    return user;
};

export const findUserByEmail = async (email: string): Promise<IUser> => {
    const user = await User.findOne({ email });
    return user;
};

export const validatePassword = async (
    user: IUser,
    password: string
): Promise<boolean> => {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
}

export const loginUser = async (
    req: Request & { session: CustomSession },
    user: IUser
): Promise<string> => {
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET as string
    );
    req.session.refreshToken = refreshToken;
    return token;
};
