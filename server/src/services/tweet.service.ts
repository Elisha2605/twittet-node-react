import mongoose, { Types } from 'mongoose';
import { TWEET_AUDIENCE, TWEET_TYPE } from 'src/constants/tweet.constants';
import Follow from 'src/model/follow.model';
import Like from 'src/model/like.model';
import Tweet from 'src/model/tweet.model';
import User from 'src/model/user.model';
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
                    from: 'Tweet',
                    localField: 'originalTweet',
                    foreignField: '_id',
                    as: 'retweet',
                },
            },
            {
                $unwind: { path: '$retweet', preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'retweet.user',
                    foreignField: '_id',
                    as: 'tweetOwner',
                },
            },
            {
                $unwind: {
                    path: '$tweetOwner',
                    preserveNullAndEmptyArrays: true,
                },
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
                    type: 1,
                    retweet: {
                        tweet: '$retweet',
                        user: {
                            _id: '$tweetOwner._id',
                            name: '$tweetOwner.name',
                            username: '$tweetOwner.username',
                            avatar: '$tweetOwner.avatar',
                            coverImage: '$tweetOwner.coverImage',
                            isVerified: '$tweetOwner.isVerified',
                            isProtected: '$tweetOwner.isProtected',
                        },
                    },
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
                    type: 1,
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

        if (!tweet) {
            return {
                success: true,
                message: 'Not tweets found!',
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
                    from: 'Tweet',
                    localField: 'originalTweet',
                    foreignField: '_id',
                    as: 'retweet',
                },
            },
            {
                $unwind: { path: '$retweet', preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'retweet.user',
                    foreignField: '_id',
                    as: 'tweetOwner',
                },
            },
            {
                $unwind: {
                    path: '$tweetOwner',
                    preserveNullAndEmptyArrays: true,
                },
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
                    'user._id': new mongoose.Types.ObjectId(userId),
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
                    type: 1,
                    retweet: {
                        tweet: '$retweet',
                        user: {
                            _id: '$tweetOwner._id',
                            name: '$tweetOwner.name',
                            username: '$tweetOwner.username',
                            avatar: '$tweetOwner.avatar',
                            coverImage: '$tweetOwner.coverImage',
                            isVerified: '$tweetOwner.isVerified',
                            isProtected: '$tweetOwner.isProtected',
                        },
                    },
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
                    from: 'Tweet',
                    localField: 'originalTweet',
                    foreignField: '_id',
                    as: 'retweet',
                },
            },
            {
                $unwind: { path: '$retweet', preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'retweet.user',
                    foreignField: '_id',
                    as: 'tweetOwner',
                },
            },
            {
                $unwind: {
                    path: '$tweetOwner',
                    preserveNullAndEmptyArrays: true,
                },
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
                    'user._id': { $in: followingIds },
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
                    type: 1,
                    retweet: {
                        tweet: '$retweet',
                        user: {
                            _id: '$tweetOwner._id',
                            name: '$tweetOwner.name',
                            username: '$tweetOwner.username',
                            avatar: '$tweetOwner.avatar',
                            coverImage: '$tweetOwner.coverImage',
                            isVerified: '$tweetOwner.isVerified',
                            isProtected: '$tweetOwner.isProtected',
                        },
                    },
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
        if (!savedReTweet) {
            throw CustomError('Could not create tweet', 500);
        }

        const tweets = await getTweetAggregate(savedReTweet._id);

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

//////// helper function ///
export const getTweetAggregate = async (tweetId: Types.ObjectId) => {
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
                from: 'Tweet',
                localField: 'originalTweet',
                foreignField: '_id',
                as: 'retweet',
            },
        },
        {
            $unwind: {
                path: '$retweet',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'User',
                localField: 'retweet.user',
                foreignField: '_id',
                as: 'tweetOwner',
            },
        },
        {
            $unwind: {
                path: '$tweetOwner',
                preserveNullAndEmptyArrays: true,
            },
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
            $unwind: {
                path: '$likes',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $match: {
                _id: tweetId,
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
                type: 1,
                retweet: {
                    tweet: '$retweet',
                    user: {
                        _id: '$tweetOwner._id',
                        name: '$tweetOwner.name',
                        username: '$tweetOwner.username',
                        avatar: '$tweetOwner.avatar',
                        coverImage: '$tweetOwner.coverImage',
                        isVerified: '$tweetOwner.isVerified',
                        isProtected: '$tweetOwner.isProtected',
                    },
                },
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
            },
        },
    ]).exec();

    return tweets;
};
