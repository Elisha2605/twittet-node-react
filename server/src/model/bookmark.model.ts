import { ObjectId } from 'mongodb';
import mongoose, { Types } from 'mongoose';
import { handleError } from 'src/utils/db.util';

export interface Ibookmark extends mongoose.Document {
    user: ObjectId | string;
    tweet: ObjectId | string;
}

const bookmarkModel = {
    user: {
        type: Types.ObjectId,
        ref: 'User',
        require: true,
    },
    tweet: {
        type: Types.ObjectId,
        ref: 'Tweet',
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
};

const boomarkSchema = new mongoose.Schema<Ibookmark>(bookmarkModel);
const Bookmark = mongoose.model<Ibookmark>(
    'Bookmark',
    boomarkSchema,
    'Bookmark'
);
Bookmark.on('error', handleError);

export default Bookmark;
