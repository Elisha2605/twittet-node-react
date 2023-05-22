import PasswordReset from 'src/models/passwordReset.model';
import User from 'src/models/user.model';
import { ApiResponse, ErrorResponse } from 'src/types/apiResponse.types';
import { CustomError, generatePasswordToken } from 'src/utils/helpers';

export const requestPasswordReset = async (
    userId: string,
    email: string
): Promise<ApiResponse<any>> => {
    try {
        const user = await User.findOne({ _id: userId, email: email });
        console.log(`Password initiation: ${user.email}`);

        if (!user) {
            throw CustomError('User does not exists', 400);
        }

        const expiry = new Date(new Date().getTime() + 30 * 60 * 1000);

        const token = generatePasswordToken();
        console.log(`Password token: ${token}`);

        const newPasswordInitiation = new PasswordReset({
            user: user.id,
            token: token,
            expiry: expiry,
        });

        const result = await newPasswordInitiation.save();

        return {
            success: true,
            message: 'Successfully sent password reset request',
            status: 200,
            payload: result,
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

export const resetPassword = async (
    userId: string,
    password: string,
    token: string
): Promise<ApiResponse<any>> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw CustomError('User does not exists', 400);
        }

        const resetRequest = await PasswordReset.findOne({
            user: user._id,
            token: token,
        });

        if (!resetRequest || !resetRequest.token) {
            return {
                success: true,
                message: 'Invalid password verification code',
                status: 400,
                payload: {},
            };
        }

        if (resetRequest.isTokenUsed) {
            return {
                success: true,
                message: 'password verification code already used',
                status: 400,
                payload: {},
            };
        }

        if (resetRequest.expiry.getTime() < new Date().getTime()) {
            return {
                success: true,
                message: 'Session expired',
                status: 400,
                payload: {},
            };
        }

        resetRequest.isTokenUsed = true;
        resetRequest.resetTimestamp = new Date();

        const result = await resetRequest.save();

        const newPassword = await user.setPassword(password);
        await newPassword.save();

        return {
            success: true,
            message: 'Successfully reset password!',
            status: 200,
            payload: result,
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
