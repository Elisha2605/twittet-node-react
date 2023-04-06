import { getRefreshToken, getToken, verifyToken } from 'src/authentication';
import User, { IUser } from 'src/model/user.model';

export interface UserSingUpInfo {
    email: string;
    password: string;
    repeatPassword: string;
}

export interface Status {
    succeded: boolean;
    message: string;
    token?: string;
    refreshToken?: string;
    user?: IUser;
}

export const signup = async (
    email: string,
    password: string
): Promise<Status> => {
    try {
        const isUser = await User.findOne({ email: email });
        if (!password) {
            return {
                succeded: false,
                message: 'Repeated password is different',
            };
        }
        if (isUser) {
            return {
                succeded: false,
                message: 'User already exists',
            };
        }
        if (!email) {
            return {
                succeded: false,
                message: 'Email is missing',
            };
        }
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);

        const user = await User.register(
            new User({
                email: email,
            }),
            password
        );

        user.expiryDate = expiry;
        const token = getToken({ _id: user._id });
        const refreshToken = getRefreshToken({ _id: user._id });
        user.refreshToken.push({ refreshToken: refreshToken });
        const newUser = await user.save();
        if (newUser === null || newUser === undefined) {
            return { succeded: false, message: 'failed to save ' };
        } else {
            return {
                succeded: true,
                message: 'Successfylly user creation!',
                refreshToken: refreshToken,
                token: token,
            };
        }
    } catch (error) {
        return {
            succeded: false,
            message: 'Server Error',
        };
    }
};

export const login = async (userId: string): Promise<Status> => {
    console.log('Inside login service');
    const token = getToken({ _id: userId });
    const refreshToken = getRefreshToken({ _id: userId });
    const user = await User.findById(userId);
    user.refreshToken.push({ refreshToken: refreshToken });

    const loggedInUser = await user.save();
    if (loggedInUser === null || loggedInUser === undefined) {
        return { succeded: false, message: 'failed to save ' };
    } else {
        return {
            succeded: true,
            message: 'Successfylly Logged in!',
            token: token,
            refreshToken: refreshToken,
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
                succeded: false,
                message: '404 Unauthorized',
            };
        } else {
            const token = getToken({ _id: userId });
            const newRefreshToken = getRefreshToken({ _id: userId });
            user.refreshToken[tokenIndex].refreshToken = newRefreshToken;
            const freshUser = await user.save();

            if (freshUser === null || freshUser === undefined) {
                return {
                    succeded: false,
                    message: 'failed to save user after token update ',
                };
            } else {
                return {
                    succeded: true,
                    message: 'Refresh token updated!',
                    user: freshUser,
                    token: token,
                    refreshToken: refreshToken,
                };
            }
        }
    } else {
        return {
            succeded: false,
            message: '401 Unauthorized',
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

    const LoggedOutUser = await user.save();

    if (LoggedOutUser === null || LoggedOutUser === undefined) {
        return {
            succeded: false,
            message: 'failed to logout user',
        };
    } else {
        return {
            succeded: true,
            message: 'User succefully logged out',
        };
    }
};
