import mongoose, { ObjectId, Types } from 'mongoose';
import { handleError } from 'src/utils/db.util';
import Notification from './notification.model';
import Tweet from './tweet.model';
import { NOTIFICATION_TYPE } from '../../src/constants/notification.constants';
import { NOTIFICATION_MESSAGE } from '../../src/constants/notification.constants';

export interface Ilike extends mongoose.Document {
    tweet: ObjectId | string;
    likes: (ObjectId | string)[];
    likesCount: number;
}

const likeModel = {
    tweet: {
        type: Types.ObjectId,
        ref: 'Tweet',
        required: true,
    },
    likes: {
        type: [Types.ObjectId],
        ref: 'User',
        required: true,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
};

const likeSchema = new mongoose.Schema<Ilike>(likeModel);

// Like notification hook
likeSchema.post<Ilike>('save', async function (doc, next) {
    try {
        const tweet = await Tweet.findById(doc.tweet);

        if (!tweet) {
            return next();
        }

        const likes = doc.likes;
        if (!likes || likes.length === 0) {
            return next();
        }

        const likingUser = likes[likes.length - 1];
        if (likingUser.toString() !== tweet.user.toString()) {
            const existingNotification = await Notification.findOne({
                type: NOTIFICATION_TYPE.like,
                user: tweet.user,
                sender: likingUser,
                tweet: tweet._id,
            });

            if (!existingNotification) {
                const notification = new Notification({
                    type: NOTIFICATION_TYPE.like,
                    user: tweet.user,
                    sender: likingUser,
                    tweet: tweet._id,
                    message: NOTIFICATION_MESSAGE.like,
                });
                await notification.save();
            }
        }
    } catch (error) {
        return next(error);
    }
});

const Like = mongoose.model<Ilike>('Like', likeSchema, 'Like');
Like.on('error', handleError);

export default Like;
