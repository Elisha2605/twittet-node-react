import mongoose, { ObjectId, Types } from 'mongoose';
import { handleError } from 'src/utils/db.util';

export interface Ilike extends mongoose.Document {
    tweet: ObjectId | string;
    likes: (ObjectId | string)[];
}

const likeModel = {
    tweet: {
        type: Types.ObjectId,
        ref: 'Tweet',
        require: true,
    },
    likes: {
        type: [Types.ObjectId],
        ref: 'User',
        require: true,
    },
};

const likeSchema = new mongoose.Schema<Ilike>(likeModel);

const Like = mongoose.model<Ilike>('Like', likeSchema, 'Like');
Like.on('error', handleError);

export default Like;
