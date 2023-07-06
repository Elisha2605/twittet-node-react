import { ApiResponse, ErrorResponse } from '../../src/types/apiResponse.types';
import Contact from '../../src/models/contact.model';
import { fetchUserInfo } from '../../src/aggregations/user/fetchUserInfo.aggregation';
import mongoose from 'mongoose';

export const getAllContacts = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const contacts = await Contact.aggregate([
            {
                $match: { user: new mongoose.Types.ObjectId(userId) },
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'contactList.user',
                    foreignField: '_id',
                    as: 'contacts',
                },
            },
            {
                $unwind: '$contacts',
            },
            {
                $lookup: {
                    from: 'Message',
                    let: { user: '$user', contact: '$contacts._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {
                                            $and: [
                                                { $eq: ['$sender', '$$user'] },
                                                {
                                                    $eq: [
                                                        '$receiver',
                                                        '$$contact',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            $and: [
                                                {
                                                    $eq: [
                                                        '$sender',
                                                        '$$contact',
                                                    ],
                                                },
                                                {
                                                    $eq: [
                                                        '$receiver',
                                                        '$$user',
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $limit: 1,
                        },
                    ],
                    as: 'lastMessage',
                },
            },
            {
                $unwind: {
                    path: '$lastMessage',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    contactListIndex: {
                        $indexOfArray: ['$contactList.user', '$contacts._id'],
                    },
                },
            },
            {
                $sort: {
                    contactListIndex: 1,
                },
            },
            {
                $project: {
                    _id: '$contacts._id',
                    name: '$contacts.name',
                    username: '$contacts.username',
                    avatar: '$contacts.avatar',
                    isVerified: '$contacts.isVerified',
                    isProtected: '$contacts.isProtected',
                    lastMessage: {
                        $ifNull: ['$lastMessage', null],
                    },
                },
            },
        ]);

        return {
            success: true,
            message: 'Fetched contacts',
            status: 200,
            payload: contacts,
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

export const addContact = async (
    userId: string,
    newUser: string
): Promise<ApiResponse<any>> => {
    try {
        const existingUser = await Contact.findOne({ user: userId });
        const userToAdd = await fetchUserInfo(newUser);

        if (!existingUser) {
            const addedUser = new Contact({
                user: userId,
                contactList: [{ user: newUser }],
            });
            const res = await addedUser.save();
            return {
                success: true,
                message: 'User added to contact',
                status: 200,
                payload: res,
            };
        }

        if (
            existingUser &&
            existingUser.contactList.some(
                (u: any) => u.user.toString() === newUser
            )
        ) {
            return {
                success: true,
                message: 'User already exists in contact',
                status: 200,
                payload: userToAdd,
            };
        }

        existingUser.contactList.unshift({ user: newUser });
        await existingUser.save();
        return {
            success: true,
            message: 'User added to contact',
            status: 200,
            payload: userToAdd,
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

export const removeContact = async (
    userId: string,
    userToRemove: string
): Promise<ApiResponse<any>> => {
    try {
        const updatedUser = await Contact.findOneAndUpdate(
            { user: userId },
            { $pull: { contactList: { user: userToRemove } } },
            { new: true }
        );

        if (updatedUser) {
            const removedUser = await fetchUserInfo(userToRemove);

            return {
                success: true,
                message: 'User removed from contact',
                status: 200,
                payload: removedUser,
            };
        }

        return {
            success: false,
            message: 'Could not remove user from contact',
            status: 500,
            payload: null,
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
