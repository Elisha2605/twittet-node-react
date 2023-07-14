import mongoose, { ObjectId, Types } from 'mongoose';
import { handleError } from '../../src/utils/db.util';
import { MESSAGE_TYPE } from '../../src/constants/message.contants';

interface Imessage extends mongoose.Document {
    type: string;
    sender: string | ObjectId;
    receiver: string | ObjectId;
    text: string;
    image?: string;
    originalMessage: {
        text: string;
        image: string;
    };
    visited: boolean;
    deletedBy: (string | ObjectId)[];
    read: boolean;
}

const messageModel = {
    type: {
        type: String,
        required: true,
        default: MESSAGE_TYPE.regular,
    },
    sender: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
    },
    receiver: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
    },
    text: {
        type: String,
    },
    image: {
        type: String,
        required: false,
    },
    originalMessage: {
        text: {
            type: String,
            image: false,
        },
        originalImage: {
            type: String,
            required: false,
        },
    },
    visited: {
        type: Boolean,
        default: false,
    },
    deletedBy: {
        type: [Types.ObjectId],
        ref: 'User',
    },
    read: {
        type: Boolean,
        default: false,
    },
};

const messageSchema = new mongoose.Schema<Imessage>(messageModel, {
    timestamps: true,
});

const Message = mongoose.model<Imessage>('Message', messageSchema, 'Message');
Message.on('error', handleError);
export default Message;
