import mongoose from 'mongoose';
import Tweet from 'src/models/tweet.model';

export const fetchTweetById = async (tweetId: string) => {
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
                bookmarkCount: 1,
                retweetCount: 1,
                viewCount: 1,
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

    return tweet;
};
