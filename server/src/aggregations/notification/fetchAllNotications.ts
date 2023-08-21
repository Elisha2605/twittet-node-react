import mongoose from 'mongoose';
import Notification from '../../models/notification.model';

export const fetchAllNotifications = async (userId: string) => {
    const notifications = await Notification.aggregate([
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
                localField: 'sender',
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
            $project: {
                _id: '$tweet._id',
                type: 1,
                message: 1,
                read: 1,
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
                createdAt: '$createdAt',
                updatedAt: '$updatedAt',
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

    return notifications;
};
