import mongoose from 'mongoose';
import Tweet from '../../../src/models/tweet.model';

export const fetchUserTweetReplies = async (userId: string) => {
    const tweets = await Tweet.aggregate([
        {
            $lookup: {
                from: 'Reply',
                localField: '_id',
                foreignField: 'tweet',
                as: 'replyTweets',
            },
        },
        {
            $unwind: {
                path: '$replyTweets',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'User',
                localField: 'replyTweets.user',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: '$user',
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
            $match: {
                'replyTweets.user': new mongoose.Types.ObjectId(userId),
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
                type: '$audience.type',
                user: {
                    _id: '$user._id',
                    name: '$user.name',
                    username: '$user.username',
                    avatar: '$user.avatar',
                    coverImage: '$user.coverImage',
                    isVerified: '$user.isVerified',
                    isProtected: '$user.isProtected',
                },
                image: '$replyTweets.image',
                text: '$replyTweets.text',
                audience: '$replyTweets.audience',
                reply: '$replyTweets.reply',
                mentions: '$replyTweets.mentions',
                createdAt: '$replyTweets.createdAt',
                updatedAt: '$replyTweets.updatedAt',
            },
        },
    ]).exec();

    return tweets;
};
