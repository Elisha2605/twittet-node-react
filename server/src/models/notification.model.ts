import mongoose, { Types, ObjectId } from 'mongoose';
import { handleError } from '../../src/utils/db.util';

export interface INotification extends mongoose.Document {
    type: string;
    user: ObjectId | string;
    sender: ObjectId | string;
    tweet: ObjectId | string;
    follow: ObjectId | string;
    message: string;
    read: boolean;
    createdAt: Date;
}

const notificationModel = {
    type: {
        type: String,
        required: true,
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sender: {
        type: Types.ObjectId,
        ref: 'User',
        required: false,
    },
    tweet: {
        type: Types.ObjectId,
        ref: 'Tweet',
        required: false,
    },
    follow: {
        type: Types.ObjectId,
        ref: 'Follow',
        required: false,
    },
    message: {
        type: String,
        ref: 'Message',
        required: false,
    },
    read: {
        type: Boolean,
        default: false,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
};

const notificationSchema = new mongoose.Schema<INotification>(
    notificationModel,
    {
        timestamps: true,
    }
);

const Notification = mongoose.model<INotification>(
    'Notification',
    notificationSchema,
    'Notification'
);
Notification.on('error', handleError);

export default Notification;
