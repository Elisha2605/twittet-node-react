import mongoose from 'mongoose';
import User from '../../../src/models/user.model';

export const fetchUserInfo = async (userId: string) => {
    const user = await User.aggregate([
        {
            $lookup: {
                from: 'TwitterCircle',
                localField: '_id',
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
                from: 'Follow',
                localField: '_id',
                foreignField: 'user',
                as: 'follow',
            },
        },
        {
            $unwind: {
                path: '$follow',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                username: 1,
                coverImage: 1,
                avatar: 1,
                bio: 1,
                location: 1,
                website: 1,
                isVerified: 1,
                isProtected: 1,
                isActive: 1,
                createdAt: 1,
                twitterCircleCount: '$twitterCircle.count',
                followerCount: '$follow.followerCount',
                followingCount: '$follow.followingCount',
            },
        },
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId),
            },
        },
    ]).exec();

    return user;
};
