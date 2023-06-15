import mongoose from 'mongoose';
import { NOTIFICATION_TYPE } from '../../src/constants/notification.constants';
import Notification from '../../src/models/notification.model';
import { ApiResponse, ErrorResponse } from '../../src/types/apiResponse.types';

export const getLikesNotification = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const notifications = await Notification.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: 'Tweet',
                    localField: 'tweet',
                    foreignField: '_id',
                    as: 'tweet',
                },
            },
            {
                $unwind: '$tweet',
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $lookup: {
                    from: 'Like',
                    localField: 'tweet._id',
                    foreignField: 'tweet',
                    as: 'likes',
                },
            },
            {
                $unwind: {
                    path: '$likes',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: '$tweet._id',
                    type: 1,
                    message: 1,
                    user: {
                        _id: '$user._id',
                        name: '$user.name',
                        username: '$user.username',
                        avatar: '$user.avatar',
                        coverImage: '$user.coverImage',
                        isVerified: '$user.isVerified',
                        isProtected: '$user.isProtected',
                    },
                    image: '$tweet.image',
                    text: '$tweet.text',
                    audience: '$tweet.audience',
                    reply: '$tweet.reply',
                    createdAt: '$createdAt',
                    updatedAt: '$updatedAt',
                    likes: '$likes.likes',
                    totalLikes: {
                        $cond: {
                            if: {
                                $isArray: '$likes.likes',
                            },
                            then: {
                                $size: '$likes.likes',
                            },
                            else: 0,
                        },
                    },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]).exec();

        if (!notifications) {
            return {
                success: true,
                message: 'Mentions Notification not found',
                status: 404,
                payload: {},
            };
        }

        return {
            success: true,
            message: 'Successfuly fetched menstions notification!',
            status: 200,
            payload: notifications,
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

export const getMentionsNotification = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const notifications = await Notification.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    type: NOTIFICATION_TYPE.mention,
                },
            },
            {
                $lookup: {
                    from: 'Tweet',
                    localField: 'tweet',
                    foreignField: '_id',
                    as: 'tweet',
                },
            },
            {
                $unwind: '$tweet',
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'tweet.user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $lookup: {
                    from: 'Like',
                    localField: 'tweet._id',
                    foreignField: 'tweet',
                    as: 'likes',
                },
            },
            {
                $unwind: {
                    path: '$likes',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: '$tweet._id',
                    type: 1,
                    message: 1,
                    user: {
                        _id: '$user._id',
                        name: '$user.name',
                        username: '$user.username',
                        avatar: '$user.avatar',
                        coverImage: '$user.coverImage',
                        isVerified: '$user.isVerified',
                        isProtected: '$user.isProtected',
                    },
                    image: '$tweet.image',
                    text: '$tweet.text',
                    audience: '$tweet.audience',
                    reply: '$tweet.reply',
                    createdAt: '$createdAt',
                    updatedAt: '$updatedAt',
                    likes: '$likes.likes',
                    totalLikes: {
                        $cond: {
                            if: {
                                $isArray: '$likes.likes',
                            },
                            then: {
                                $size: '$likes.likes',
                            },
                            else: 0,
                        },
                    },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]).exec();

        return {
            success: true,
            message: 'Successfuly fetched all notifications!',
            status: 200,
            payload: notifications,
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
