import { getRefreshToken, getToken, verifyToken } from 'src/utils/jwt.util';
import User, { IUser } from 'src/model/user.model';

export interface UserSingUpInfo {
    email: string;
    password: string;
    repeatPassword: string;
}

export interface Status {
    success: boolean;
    message: string;
    token?: string;
    refreshToken?: string;
    user?: IUser;
}

export const signup = async (
    email: string,
    password: string,
    passwordConfirmation: string
): Promise<Status> => {
    try {
        if (password !== passwordConfirmation) {
            return {
                success: false,
                message: 'Repeated password is different',
            };
        }
        const isUser = await User.findOne({ email: email });
        if (isUser) {
            return {
                success: false,
                message: 'User already exists',
            };
        }
        if (!email) {
            return {
                success: false,
                message: 'Email is missing',
            };
        }
        const user = await User.register(
            new User({
                email: email,
                isActive: true,
            }),
            password
        );

        const newUser = await user.save();
        if (newUser === null || newUser === undefined) {
            return { success: false, message: 'failed to save ' };
        } else {
            return {
                success: true,
                message: 'Successfylly user creation!',
                user: user,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: 'Server Error',
        };
    }
};

export const login = async (userId: string): Promise<Status> => {
    const token = getToken({ _id: userId });
    const refreshToken = getRefreshToken({ _id: userId });
    const user = await User.findById(userId);
    user.refreshToken.push({ refreshToken: refreshToken });

    const loggedInUser = await user.save();
    if (loggedInUser === null || loggedInUser === undefined) {
        return { success: false, message: 'failed to save ' };
    } else {
        return {
            success: true,
            message: 'Successfylly Logged in!',
            token: token,
            refreshToken: refreshToken,
        };
    }
};

export const logout = async (
    userId: string,
    refreshToken: string
): Promise<Status> => {
    const user = await User.findById(userId);

    const tokenIndex = user.refreshToken.findIndex(
        (index) => index.refreshToken === refreshToken
    );

    if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).deleteOne();
    }
    const logoutUser = await user.save();
    if (logoutUser === null || logoutUser === undefined) {
        return {
            success: false,
            message: 'Error: Failed to logout!',
        };
    } else {
        return {
            success: true,
            message: 'User sucessefully logged out',
        };
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
