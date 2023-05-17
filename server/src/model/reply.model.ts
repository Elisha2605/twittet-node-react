import mongoose, { Types, ObjectId } from 'mongoose';
import { handleError } from 'src/utils/db.util';
import Tweet from './tweet.model';

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

replySchema.pre(['save', 'remove'], async function (next) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const reply = this;
        const tweet = await Tweet.findById(reply.tweet);
        if (tweet) {
            if (reply.isNew) {
                // Increment replyCount on save
                tweet.replyCount += 1;
            } else {
                // Decrement replyCount on remove
                tweet.replyCount -= 1;
            }
            await tweet.save();
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Reply = mongoose.model<IReply>('Reply', replySchema, 'Reply');
Reply.on('error', handleError);

export default Reply;
