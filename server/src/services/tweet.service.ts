import mongoose from 'mongoose';
import { fetchCreatedTweet } from '../../src/aggregations/tweet/fetchCreatedTweet.aggregation';
import { fetchFollowerTweets } from '../../src/aggregations/tweet/fetchFollowerTweets.aggregation';
import { fetchTweetById } from '../../src/aggregations/tweet/fetchTweetById.aggregation';
import { getTweets } from '../../src/aggregations/tweet/fetchTweets.aggregation';
import { fetchUserTweets } from '../../src/aggregations/tweet/fetchUserTweets.aggregation';
import {
    TWEET_AUDIENCE,
    TWEET_REPLY,
    TWEET_TYPE,
} from '../../src/constants/tweet.constants';
import Follow from '../../src/models/follow.model';
import Like from '../../src/models/like.model';
import Tweet from '../../src/models/tweet.model';
import User from '../../src/models/user.model';
import { ApiResponse, ErrorResponse } from '../../src/types/apiResponse.types';
import { CustomError } from '../../src/utils/helpers';
import { fetchUserTweetReplies } from '../../src/aggregations/tweet/fetchUserTweetReplies.aggregation';
import { fetchTweetReplies } from '../../src/aggregations/tweet/fetchTweetReplies.aggregation';

export const getAllTweets = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const tweets = await getTweets(userId);

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

export const getTweetReplies = async (
    tweetId: string,
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const replies = await fetchTweetReplies(tweetId, userId);

        if (replies.length === 0) {
            return {
                success: true,
                message: 'Replies not found!',
                status: 404,
                payload: [],
            };
        }
        return {
            success: true,
            message: 'Successfully fetched replies',
            status: 200,
            payload: replies,
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
        const viewedTweet = await Tweet.findById(tweetId);
        const tweet: any = await fetchTweetById(tweetId);

        if (!viewedTweet) {
            return {
                success: true,
                message: 'Tweet not found!',
                status: 404,
                payload: {},
            };
        }

        await viewedTweet.updateOne({ $inc: { viewCount: 1 } });

        if (!tweet) {
            return {
                success: true,
                message: 'Tweet not found!',
                status: 404,
                payload: {},
            };
        }

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
    userId: string,
    visitorId: string
): Promise<ApiResponse<any>> => {
    try {
        const tweets = await fetchUserTweets(userId, visitorId);

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

export const getFollowTweets = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const follow = await Follow.findOne({ user: userId }).populate(
            'followings.user'
        );

        if (!follow) {
            return {
                success: true,
                message: 'Follow status not found!',
                status: 404,
                payload: [],
            };
        }
        // Extract the user IDs from the followings array
        const followingIds = follow.followings.map(
            (following: any) => following.user._id
        );

        // Find all tweets from users in the followings array
        const tweets = await fetchFollowerTweets(userId, followingIds);

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

export const getUserTweetReplies = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const tweets = await fetchUserTweetReplies(userId);
        return {
            success: true,
            message: 'Successfully fetched user replies',
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

export const reply = async (
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

        const newReply = new Tweet({
            type: TWEET_TYPE.reply,
            originalTweet: tweet._id,
            user: userId,
            text: text,
            image: image,
        });
        await newReply.updateOne({ $inc: { replyCount: 1 } });
        const savedReply: any = await newReply.save();
        if (!savedReply) {
            throw CustomError('Could not create reply', 500);
        }
        await tweet.updateOne({ $inc: { replyCount: 1 } });
        const populatedReply = await newReply.populate({
            path: 'user',
            select: 'name username avatar coverImage isVerified isProtected createdAt',
            model: 'User',
        });

        const newObject = {
            _id: populatedReply._id,
            user: populatedReply.user,
            text: populatedReply.text,
            image: populatedReply.image,
            replyCount: tweet.replyCount,
            createdAt: savedReply.createdAt,
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

export const reTweet = async (
    tweetId: string,
    userId: string,
    text: string,
    image: string,
    audience: string,
    reply: string
): Promise<ApiResponse<any>> => {
    try {
        const tweet = await Tweet.findById(tweetId);
        const retweetedTweet = await Tweet.findById(tweet.originalTweet);
        const user = await User.findById(userId);

        let newTweet: any;

        // undo retweet without quote.
        if (
            !tweet.text &&
            !tweet.image &&
            retweetedTweet &&
            tweet &&
            tweet.type === TWEET_TYPE.reTweet &&
            tweet.user.toString() === user._id.toString()
        ) {
            console.log(tweet._id);
            await retweetedTweet.updateOne({ $inc: { retweetCount: -1 } });
            await tweet.deleteOne();

            return {
                success: true,
                message: 'Undo Retweet',
                status: 200,
                payload: [],
            };
        }

        if (
            !text &&
            !image &&
            tweet.type === TWEET_TYPE.reTweet &&
            retweetedTweet
        ) {
            newTweet = createRetweetWithoutQuote(tweet, user);
        } else if (
            text &&
            tweet.type === TWEET_TYPE.reTweet &&
            retweetedTweet
        ) {
            newTweet = createRetweetWithQuote(tweet, user, text, image);
        } else {
            newTweet = createRetweet(
                tweet,
                userId,
                text,
                image,
                audience,
                reply
            );
        }

        const savedReTweet = await newTweet.save();
        await tweet.updateOne({ $inc: { retweetCount: 1 } });
        if (!savedReTweet) {
            throw CustomError('Could not create tweet', 500);
        }

        const tweets = await fetchCreatedTweet(savedReTweet._id);

        return {
            success: true,
            message: 'Successfully created tweet',
            status: 200,
            payload: tweets[0],
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
        const tweetReply: any = await Tweet.findOne({
            _id: tweetToDelete.originalTweet,
        }).session(session);

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
                tweetLikes.deleteOne({ session }), // Deleting all tweet's likes
                tweetToDelete.deleteOne({ session }),
            ]);
        } else if (tweetReply && tweetReply.replyCount > 0) {
            tweetReply.replyCount -= 1; // Decreasing the tweetCount by 1
            await Promise.all([
                tweetReply.save({ session }), // Save the updated tweetReply
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

//////// helper function ///

export const undoRetweet = async (tweet: any, user: any) => {
    const removedTweet = await Tweet.findByIdAndDelete({
        tweet: tweet._id,
        user: user._id,
    });
    return removedTweet;
};

export const createRetweetWithoutQuote = (tweet: any, user: any) => {
    return new Tweet({
        type: TWEET_TYPE.reTweet,
        originalTweet: tweet.originalTweet,
        user: user._id,
        audience: tweet.audience,
        reply: tweet.reply,
    });
};

export const createRetweetWithQuote = (
    tweet: any,
    user: any,
    text: string,
    image: string
) => {
    return new Tweet({
        type: TWEET_TYPE.reTweet,
        originalTweet: tweet.originalTweet,
        user: user._id,
        text: text,
        image: image,
        audience: tweet.audience,
        reply: tweet.reply,
    });
};

export const createRetweet = (
    tweet: any,
    userId: string,
    text: string,
    image: string,
    audience: string,
    reply: string
) => {
    return new Tweet({
        type: TWEET_TYPE.reTweet,
        originalTweet: tweet._id,
        user: userId,
        text: text,
        image: image,
        audience: audience,
        reply: reply,
    });
};
