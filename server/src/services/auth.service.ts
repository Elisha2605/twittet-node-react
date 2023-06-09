import {
    getRefreshToken,
    getToken,
    verifyToken,
} from '../../src/utils/jwt.util';
import User, { IUser } from '../../src/models/user.model';
import { CustomError } from '../../src/utils/helpers';
import { ApiResponse, ErrorResponse } from '../../src/types/apiResponse.types';

export interface UserSingUpInfo {
    email: string;
    password?: string;
    repeatPassword?: string;
}

// temp
export interface UserEmail {
    email: string;
}

export interface Status {
    success: boolean;
    message: string;
    token?: string;
    refreshToken?: string;
    user?: IUser | UserEmail;
}

export const signup = async (
    name: string,
    username: string,
    email: string,
    avatar: string | null,
    password: string,
    passwordConfirmation: string
): Promise<ApiResponse<any>> => {
    if (password !== passwordConfirmation) {
        return {
            success: false,
            message: 'Incorect Password!',
            status: 400,
        };
    }
    if (avatar === null) {
        avatar = 'default-avatar.jpg';
    }
    try {
        const isUser = await User.findOne({ email: email });
        if (isUser) {
            throw CustomError('User already exists', 400);
        }
        if (!email) {
            throw CustomError('Email is missing', 400);
        }
        const user = await User.register(
            new User({
                name: name,
                email: email,
                username: username,
                avatar: avatar,
            }),
            password
        );

        const newUser = await user.save();
        if (newUser === null || newUser === undefined) {
            throw CustomError('failed to save user on Login', 500);
        }
        return {
            success: true,
            message: 'User Context sent successfully',
            status: 200,
            payload: { user: user },
        };
    } catch (error) {
        const errorResponse: ErrorResponse = {
            success: false,
            message: error.message || 'Internal server error',
            status: error.statusCode || 500,
            error: error,
        };
        return Promise.reject(errorResponse);
    }
};

export const login = async (userId: string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = getToken({ _id: userId });
        const refreshToken = getRefreshToken({ _id: userId });

        const user = await User.findById(userId);
        user.refreshToken.push({ refreshToken: refreshToken });

        const loggedInUser = await user.save();
        if (loggedInUser === null || loggedInUser === undefined) {
            throw CustomError('failed to save user on Login', 500);
        }
        return {
            success: true,
            message: 'User Context sent successfully',
            status: 200,
            payload: {
                token: accessToken,
                refreshToken: refreshToken,
                user: user,
            },
        };
    } catch (error) {
        const errorResponse: ErrorResponse = {
            success: false,
            message: error.message || 'Internal server error',
            status: error.statusCode || 500,
            error: error,
        };
        return Promise.reject(errorResponse);
    }
};

export const logout = async (
    userId: string,
    refreshToken: string
): Promise<ApiResponse<null>> => {
    try {
        const user = await User.findById(userId);

        const tokenIndex = user.refreshToken.findIndex(
            (index) => index.refreshToken === refreshToken
        );

        if (tokenIndex !== -1) {
            user.refreshToken.id(user.refreshToken[tokenIndex]._id).deleteOne();
        }

        const logoutUser = await user.save();
        if (logoutUser === null || logoutUser === undefined) {
            throw CustomError('User not found, Failed to logout', 404);
        }
        return {
            success: true,
            message: 'User succefully logged out',
            status: 200,
        };
    } catch (error) {
        const errorResponse: ErrorResponse = {
            success: false,
            message: error.message || 'Internal server error',
            status: error.statusCode || 500,
            error: error,
        };
        return Promise.reject(errorResponse);
    }
};

export const refreshToken = async (refreshToken: string): Promise<Status> => {
    const userId = verifyToken(refreshToken);
    const user = await User.findById({ userId });
    if (user) {
        // TODO: TRY TO PRINT THIS AND SEE WHAT IT GIVES YOU
        const tokenIndex = user.refreshToken.findIndex(
            (index) => index.refreshToken === refreshToken
        );

        if (tokenIndex === -1) {
            return {
                success: false,
                message: '404 Unauthorized',
            };
        } else {
            const token = getToken({ _id: userId });
            const newRefreshToken = getRefreshToken({ _id: userId });
            user.refreshToken[tokenIndex].refreshToken = newRefreshToken;
            const freshUser = await user.save();

            if (freshUser === null || freshUser === undefined) {
                return {
                    success: false,
                    message: 'failed to save user after token update ',
                };
            } else {
                return {
                    success: true,
                    message: 'Refresh token updated!',
                    user: freshUser,
                    token: token,
                    refreshToken: refreshToken,
                };
            }
        }
    } else {
        return {
            success: false,
            message: '401 Unauthorized',
        };
    }
};
