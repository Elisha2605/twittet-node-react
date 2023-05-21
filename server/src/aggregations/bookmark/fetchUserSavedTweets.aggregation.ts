import mongoose from 'mongoose';
import Bookmark from 'src/model/bookmark.model';

export const fetchUserSavedTweets = async (userId: string) => {
    const tweets = await Bookmark.aggregate([
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
                from: 'Tweet',
                localField: 'tweet.originalTweet',
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
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                _id: '$tweet._id',
                type: '$tweet.type',
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
                image: '$tweet.image',
                text: '$tweet.text',
                audience: '$tweet.audience',
                reply: '$tweet.reply',
                mentions: '$tweet.mentions',
                createdAt: '$tweet.createdAt',
                updatedAt: '$tweet.updatedAt',
                likes: '$likes.likes',
                replyCount: '$tweet.replyCount',
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
