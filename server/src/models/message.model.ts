import mongoose, { ObjectId, Types } from 'mongoose';
import { handleError } from '../../src/utils/db.util';

interface Imessage extends mongoose.Document {
    sender: string | ObjectId;
    receiver: string | ObjectId;
    text: string;
    image?: string;
    read: boolean;
}

const messageModel = {
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
