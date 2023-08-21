import mongoose from 'mongoose';
import Contact from '../../../src/models/contact.model';

export const fetchContactById = async (userId: string, contactId: string) => {
    const contact = await Contact.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                'contactList.user': new mongoose.Types.ObjectId(contactId),
            },
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
                                                $eq: ['$receiver', '$$contact'],
                                            },
                                        ],
                                    },
                                    {
                                        $and: [
                                            {
                                                $eq: ['$sender', '$$contact'],
                                            },
                                            {
                                                $eq: ['$receiver', '$$user'],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $sort: { createdAt: -1 },
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

    return contact;
};
