import { TWEET_AUDIENCE } from 'src/constants/tweet.constants';
import Follow from 'src/model/follow.model';
import Tweet from 'src/model/tweet.model';
import { ApiResponse, ErrorResponse } from 'src/types/apiResponse.types';
import { CustomError } from 'src/utils/helpers';

export const getAllTweets = async (): Promise<ApiResponse<any>> => {
    try {
        const tweets = await Tweet.find({})
            .populate({
                path: 'user',
                select: 'name username avatar coverImage isVerified isProtected',
                model: 'User',
            })
            .sort({ createdAt: -1 })
            .exec();
        if (tweets.length === 0) {
            return { success: false, message: 'No tweet found!', status: 200 };
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

export const getUserTweets = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const tweet = await Tweet.find({ user: userId })
            .populate({
                path: 'user',
                select: 'name username avatar coverImage isVerified isProtected',
                model: 'User',
            })
            .sort({ createdAt: -1 })
            .exec();
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
        const tweets = await Tweet.find({ user: { $in: followingIds } })
            .populate({
                path: 'user',
                select: 'name username avatar coverImage isVerified isProtected',
                model: 'User',
            })
            .sort({ createdAt: -1 })
            .exec();

        // To consider in the feature ( additional query criteria to filter the tweets based on their audience or reply)
        // const tweets = await Tweet.find({
        //     user: { $in: followingIds },
        //     audience: {
        //         $in: [TWEET_AUDIENCE.everyone, TWEET_AUDIENCE.followers],
        //     },
        //     reply: { $in: [TWEET_REPLY.everyone, TWEET_REPLY.followers] },
        // });

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

export const deleteTweet = async (
    tweetId: string,
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const tweetToDelete: any = await Tweet.findById(tweetId);
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
        await tweetToDelete.deleteOne();
        return {
            success: true,
            message: 'Successfully created tweet',
            status: 200,
            payload: tweetToDelete,
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
