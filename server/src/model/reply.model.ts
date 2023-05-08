import mongoose, { Types, ObjectId } from 'mongoose';
import { handleError } from 'src/utils/db.util';

export interface IReply extends mongoose.Document {
    tweet: ObjectId | string;
    user: ObjectId | string;
    image: string;
    text: string;
}

export const replyModel = {
    tweet: {
        type: Types.ObjectId,
        ref: 'Tweet',
        require: true,
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        require: true,
    },
    image: {
        type: String,
        default: null,
        require: false,
    },
    text: {
        type: String,
        default: null,
        require: false,
    },
};

const replySchema = new mongoose.Schema<IReply>(replyModel, {
    timestamps: true,
});

const Reply = mongoose.model<IReply>('Reply', replySchema, 'Reply');
Reply.on('error', handleError);

export default Reply;
