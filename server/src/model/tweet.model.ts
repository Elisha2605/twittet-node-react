import mongoose, { Schema, Types, ObjectId, model } from 'mongoose';
import { handleError } from 'src/utils/db.util';

// SUB DOCUMENTS

export interface ITweet extends mongoose.Document {
    user: ObjectId | string;
    image: string;
    text: string;
    privacy: string; //Create constants (Everyone, Twitter Circle);
}

export const tweetModel = {
    user: {
        type: Types.ObjectId,
        ref: 'User',
        // require: true,
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
    privacy: {
        type: String,
        require: false,
    },
};

const tweetSchema = new Schema<ITweet>(tweetModel, {
    timestamps: true,
});
const Tweet = model<ITweet>('Tweet', tweetSchema, 'Tweet');
Tweet.on('error', handleError);

export default Tweet;
