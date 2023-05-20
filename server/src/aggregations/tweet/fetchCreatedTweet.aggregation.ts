import mongoose from 'mongoose';
import Tweet from 'src/model/tweet.model';

export const fetchCreatedTweet = async (tweetId: mongoose.Types.ObjectId) => {
    const tweet = await Tweet.aggregate([
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
                bookmarkCount: 1,
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

    return tweet;
};
