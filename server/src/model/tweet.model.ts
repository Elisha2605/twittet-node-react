import mongoose, { Types, ObjectId } from 'mongoose';
import { TWEET_AUDIENCE, TWEET_REPLY } from 'src/constants/tweet.constants';
import { handleError } from 'src/utils/db.util';
import Like from './like.model';

// SUB DOCUMENTS

export interface ITweet extends mongoose.Document {
    user: ObjectId | string;
    image: string;
    text: string;
    audience: string; //Create constants (Everyone, Twitter Circle);
    reply: string;
}

export const tweetModel = {
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
    audience: {
        type: String,
        default: TWEET_AUDIENCE.everyone,
        require: false,
    },
    reply: {
        type: String,
        default: TWEET_REPLY.everyone,
        require: false,
    },
};

const tweetSchema = new mongoose.Schema<ITweet>(tweetModel, {
    timestamps: true,
});

const Tweet = mongoose.model<ITweet>('Tweet', tweetSchema, 'Tweet');
Tweet.on('error', handleError);

export default Tweet;
