import mongoose from 'mongoose';
import { TWEET_AUDIENCE } from 'src/constants/tweet.constants';
import Follow from 'src/model/follow.model';
import Like from 'src/model/like.model';
import Tweet from 'src/model/tweet.model';
import { ApiResponse, ErrorResponse } from 'src/types/apiResponse.types';
import { CustomError } from 'src/utils/helpers';

export const getAllTweets = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const tweets = await Tweet.aggregate([
            {
                $lookup: {
                    from: 'TwitterCircle',
                    localField: 'user',
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
                $lookup: {
                    from: 'Like',
                    localField: '_id',
                    foreignField: 'tweet',
                    as: 'likes',
                },
            },
            {
                $unwind: { path: '$likes', preserveNullAndEmptyArrays: true },
            },
            {
                $match: {
                    $or: [
                        {
                            audience: TWEET_AUDIENCE.everyone,
                        },
                        {
                            audience: TWEET_AUDIENCE.twitterCircle,
                            $expr: {
                                $cond: {
                                    if: {
                                        $eq: [
                                            new mongoose.Types.ObjectId(userId),
                                            '$twitterCircle.user',
                                        ],
                                    },
                                    then: true,
                                    else: {
                                        $in: [
                                            new mongoose.Types.ObjectId(userId),
                                            '$twitterCircle.members',
                                        ],
                                    },
                                },
                            },
                        },
                    ],
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $project: {
                    _id: 1,
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
                    audience: 1,
                    reply: 1,
                    mentions: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    likes: '$likes.likes',
                    replyCount: 1,
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
                    isInCircle: 1,
                    twitterCircleMembers: 1,
                },
            },
        ]).exec();

        if (tweets.length === 0) {
            return {
                success: true,
                message: 'Not tweets found!',
                status: 404,
                payload: [],
            };
        }
        return {
            success: true,
            message: 'Successfully fetched tweets',
            status: 200,
            payload: tweets,
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

export const getTweetById = async (tweetId: string): Promise<any> => {
    try {
        const tweet = await Tweet.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(tweetId),
                },
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
                $lookup: {
                    from: 'Like',
                    localField: '_id',
                    foreignField: 'tweet',
                    as: 'likes',
                },
            },
            {
                $unwind: { path: '$likes', preserveNullAndEmptyArrays: true },
            },
            {
                $project: {
                    _id: 1,
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
                    audience: 1,
                    reply: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    mentions: 1,
                    replyCount: 1,
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
        ]).exec();

        return {
            success: true,
            message: 'Successfully fetched tweet',
            status: 200,
            payload: tweet,
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

export const getUserTweets = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const tweet = await Tweet.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                },
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
                $lookup: {
                    from: 'Like',
                    localField: '_id',
                    foreignField: 'tweet',
                    as: 'likes',
                },
            },
            {
                $unwind: { path: '$likes', preserveNullAndEmptyArrays: true },
            },
            {
                $project: {
                    _id: 1,
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
                    audience: 1,
                    reply: 1,
                    createdAt: 1,
                    updatedAt: 1,
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
        if (tweet.length < 0) {
            throw CustomError('Tweets not found', 204);
        }
        return {
            success: true,
            message: 'Successfully fetched tweets',
            status: 200,
            payload: tweet,
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

export const getFollowTweets = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const follow = await Follow.findOne({ user: userId }).populate(
            'followings.user'
        );
        // Extract the user IDs from the followings array
        const followingIds = follow.followings.map(
            (following: any) => following.user._id
        );

        // Find all tweets from users in the followings array
        const tweets = await Tweet.aggregate([
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
                $lookup: {
                    from: 'Like',
                    localField: '_id',
                    foreignField: 'tweet',
                    as: 'likes',
                },
            },
            {
                $unwind: { path: '$likes', preserveNullAndEmptyArrays: true },
            },
            {
                $project: {
                    _id: 1,
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
                    audience: 1,
                    reply: 1,
                    createdAt: 1,
                    updatedAt: 1,
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
                $match: {
                    'user._id': { $in: followingIds },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]).exec();

        if (tweets.length === 0) {
            return {
                success: true,
                message: 'Not tweets found!',
                status: 404,
                payload: [],
            };
        }

        return {
            success: true,
            message: 'Successfully fetched tweets',
            status: 200,
            payload: tweets,
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

export const createTweet = async (
    userId: string,
    text: string,
    image: string,
    audience: string,
    reply: string
): Promise<ApiResponse<any>> => {
    try {
        const newTweet = new Tweet({
            user: userId,
            text: text,
            image: image,
            audience: audience,
            reply: reply,
        });
        const savedTweet = await newTweet.save();
        if (!savedTweet) {
            throw CustomError('Could not create tweet', 500);
        }
        const populatedTweet = await newTweet.populate({
            path: 'user',
            select: 'name username avatar coverImage isVerified isProtected',
            model: 'User',
        });

        return {
            success: true,
            message: 'Successfully created tweet',
            status: 200,
            payload: populatedTweet,
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

export const editTweet = async (
    tweetId: string,
    userId: string,
    text: string,
    image: string,
    audience: string,
    reply: string
): Promise<ApiResponse<any>> => {
    try {
        const query = {
            _id: tweetId,
            user: userId,
        };

        const update: { [key: string]: any } = {
            text: text,
            audience: audience,
            reply: reply,
        };

        if (image) {
            update.image = image;
        }

        const updatedTweet = await Tweet.findOneAndUpdate(query, update, {
            new: true,
        });

        if (!updatedTweet) {
            return {
                success: true,
                message: 'Tweet not found or unauthorized!',
                status: 404,
                payload: {},
            };
        }

        return {
            success: true,
            message: 'Successfully edited tweet',
            status: 200,
            payload: updatedTweet,
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

export const updateTweetAudience = async (
    userId: string,
    tweetId: string,
    audienceOption: string
): Promise<ApiResponse<any>> => {
    try {
        const tweetToUpdate = await Tweet.findOne({
            _id: tweetId,
            user: userId,
        });
        if (!tweetToUpdate) {
            throw CustomError('Tweet not found', 404);
        }
        if (audienceOption === TWEET_AUDIENCE.everyone) {
            tweetToUpdate.audience = audienceOption;
        } else if (audienceOption === TWEET_AUDIENCE.twitterCircle) {
            tweetToUpdate.audience = audienceOption;
        } else {
            throw CustomError('Input Error', 400);
        }
        tweetToUpdate.save();
        return {
            success: true,
            message: 'Successfully created tweet',
            status: 200,
            payload: tweetToUpdate,
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

export const deleteTweet = async (
    tweetId: string,
    userId: string
): Promise<ApiResponse<any>> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const tweetToDelete: any = await Tweet.findById(tweetId).session(
            session
        );
        const tweetLikes: any = await Like.findOne({ tweet: tweetId }).session(
            session
        );
        if (!tweetToDelete) {
            return {
                success: true,
                message: 'Tweet not found!',
                status: 204,
                payload: {},
            };
        }
        if (!tweetToDelete.user._id.equals(userId)) {
            throw CustomError('Unauthorized', 403);
        }
        // Delete tweetLikes and tweetToDelete if both exist
        if (tweetLikes) {
            await Promise.all([
                tweetLikes.deleteOne({ session }),
                tweetToDelete.deleteOne({ session }),
            ]);
        } else {
            await tweetToDelete.deleteOne({ session });
        }

        await session.commitTransaction();
        session.endSession();

        return {
            success: true,
            message: 'Successfully deleted tweet',
            status: 200,
            payload: tweetToDelete,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        const errorResponse: ErrorResponse = {
            success: false,
            message: error.message || 'Internal server error',
            status: error.statusCode || 500,
            error: error,
        };
        return Promise.reject(errorResponse);
    }
};
