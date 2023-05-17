import mongoose from 'mongoose';
import User from 'src/model/user.model';
import { ApiResponse, ErrorResponse } from 'src/types/apiResponse.types';
import { CustomError } from 'src/utils/helpers';

export const getAllUsers = async (): Promise<any> => {
    try {
        const users = await User.find({});
        if (users.length < 0) {
            throw CustomError('No users found', 404);
        }
        return {
            success: true,
            message: 'Success',
            status: 200,
            payload: users,
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

// authUser
export const getAuthUserInfo = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const user = await User.aggregate([
            {
                $lookup: {
                    from: 'TwitterCircle',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'twitterCircle',
                },
            },
            {
                $unwind: {
                    path: '$twitterCircle',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'Follow',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'follow',
                },
            },
            {
                $unwind: {
                    path: '$follow',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    username: 1,
                    avatar: 1,
                    coverImage: 1,
                    isVerified: 1,
                    isProtected: 1,
                    twitterCircleCount: '$twitterCircle.count',
                    followerCount: '$follow.followerCount',
                    followingCount: '$follow.followingCount',
                },
            },
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
        ]).exec();

        if (!user) {
            throw CustomError('No user found', 404);
        }
        return {
            success: true,
            message: 'Success',
            status: 200,
            payload: user,
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

// other user
export const getUserById = async (userId: string): Promise<any> => {
    try {
        const user = await User.aggregate([
            {
                $lookup: {
                    from: 'TwitterCircle',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'twitterCircle',
                },
            },
            {
                $unwind: {
                    path: '$twitterCircle',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'Follow',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'follow',
                },
            },
            {
                $unwind: {
                    path: '$follow',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    username: 1,
                    coverImage: 1,
                    avatar: 1,
                    bio: 1,
                    location: 1,
                    website: 1,
                    isVerified: 1,
                    isProtected: 1,
                    isActive: 1,
                    createdAt: 1,
                    twitterCircleCount: '$twitterCircle.count',
                    followerCount: '$follow.followerCount',
                    followingCount: '$follow.followingCount',
                },
            },
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
        ]).exec();

        return {
            success: true,
            message: 'Success',
            status: 200,
            payload: user[0],
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

export const getUserInfo = async (userId: string): Promise<any> => {
    const user = await User.findById(userId);
    return user;
};

export const searchUsers = async (
    searchTerm: string
): Promise<ApiResponse<any>> => {
    try {
        const regex = new RegExp(searchTerm, 'i');
        const users = await User.find({
            $or: [{ name: regex }, { username: regex }],
        }).limit(13);

        return {
            success: true,
            message: 'Success',
            status: 200,
            payload: users,
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

export const editUserProfile = async (
    userId: string,
    coverImage: string,
    avatar: string,
    name: string,
    bio: string,
    location: string,
    website: string
): Promise<ApiResponse<any>> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw CustomError('User not found', 404);
        }

        user.coverImage = coverImage === null ? user.coverImage : coverImage;
        user.avatar = avatar === null ? user.avatar : avatar;
        user.name = name === '' ? user.name : name;
        user.bio = bio;
        user.location = location;
        user.website = website;

        const editedUser = await user.save();

        return {
            success: true,
            message: 'Success',
            status: 200,
            payload: editedUser,
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
