import mongoose from 'mongoose';
import { TWEET_AUDIENCE, TWEET_REPLY } from 'src/constants/tweet.constants';
import Follow from 'src/model/follow.model';
import Reply from 'src/model/reply.model';
import Tweet from 'src/model/tweet.model';
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
        const tweet: any = await Tweet.findById(tweetId);

        if (!tweet) {
            throw CustomError('Tweet not found!', 404);
        }

        const authorFollowers = await Follow.findOne({ user: tweet.user });

        // check for Twitter Circle
        if (
            tweet.user.toString() !== userId.toString() &&
            tweet.audience === TWEET_AUDIENCE.twitterCircle &&
            !authorFollowers.followers.some(
                (follower: any) =>
                    follower.user.toString() === userId.toString()
            )
        ) {
            throw CustomError(
                'Unthorised! only people in the Twitter Circle who follow the user can reply!',
                400
            );
        }

        // check for people people you follow
        if (
            tweet.user.toString() !== userId.toString() &&
            tweet.reply === TWEET_REPLY.peopleYouFollow &&
            !authorFollowers.followings.some(
                (follower: any) =>
                    follower.user.toString() === userId.toString()
            )
        ) {
            throw CustomError(
                'Unthorised! only people the user follows can reply!',
                400
            );
        }

        // check for people you mention
        if (
            tweet.user.toString() !== userId.toString() &&
            tweet.reply === TWEET_REPLY.onlyPeopleYouMention &&
            !tweet.mentions.includes(userId)
        ) {
            throw CustomError(
                'Unthorised! only people mentioned by the user can reply!',
                400
            );
        }

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

        const newObject = {
            _id: populatedReply._id,
            tweet: populatedReply.tweet,
            user: populatedReply.user,
            text: populatedReply.text,
            image: populatedReply.image,
            replyCount: tweet.replyCount,
        };

        return {
            success: true,
            message: 'Successfully created reply',
            status: 200,
            payload: newObject,
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
