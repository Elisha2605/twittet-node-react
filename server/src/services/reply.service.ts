import mongoose from 'mongoose';
import Reply from 'src/model/reply.model';
import { ApiResponse, ErrorResponse } from 'src/types/apiResponse.types';
import { CustomError } from 'src/utils/helpers';

export const getAllTweetReplies = async (
    tweetId: string
): Promise<ApiResponse<any>> => {
    try {
        const tweetReplies = await Reply.aggregate([
            {
                $match: {
                    tweet: new mongoose.Types.ObjectId(tweetId),
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
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    _id: 1,
                    tweet: '$tweet._id',
                    user: {
                        _id: '$user._id',
                        name: '$user.name',
                        username: '$user.username',
                        avatar: '$user.avatar',
                        coverImage: '$user.coverImage',
                        isVerified: '$user.isVerified',
                        isProtected: '$user.isProtected',
                    },
                    image: 1,
                    text: 1,
                    createdAt: 1,
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
            message: 'Tweet replies',
            status: 200,
            payload: tweetReplies,
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

export const getReplyById = async (
    replyId: string
): Promise<ApiResponse<any>> => {
    try {
        const tweetReplies = await Reply.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(replyId),
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
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    _id: 1,
                    tweet: '$tweet._id',
                    user: {
                        _id: '$user._id',
                        name: '$user.name',
                        username: '$user.username',
                        avatar: '$user.avatar',
                        coverImage: '$user.coverImage',
                        isVerified: '$user.isVerified',
                        isProtected: '$user.isProtected',
                    },
                    image: 1,
                    text: 1,
                    createdAt: 1,
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
            message: 'Tweet replies',
            status: 200,
            payload: tweetReplies,
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

export const createReply = async (
    tweetId: string,
    userId: string,
    text: string,
    image: string
): Promise<ApiResponse<any>> => {
    try {
        const newReply = new Reply({
            tweet: tweetId,
            user: userId,
            text: text,
            image: image,
        });
        const savedReply = await newReply.save();
        if (!savedReply) {
            throw CustomError('Could not create reply', 500);
        }
        const populatedReply = await newReply.populate({
            path: 'user',
            select: 'name username avatar coverImage isVerified isProtected',
            model: 'User',
        });

        return {
            success: true,
            message: 'Successfully created reply',
            status: 200,
            payload: populatedReply,
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
