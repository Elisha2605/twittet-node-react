import mongoose, { Types, ObjectId } from 'mongoose';
import {
    TWEET_AUDIENCE,
    TWEET_REPLY,
    TWEET_TYPE,
} from '../../src/constants/tweet.constants';
import { handleError } from '../../src/utils/db.util';
import User from './user.model';
import Notification, { INotification } from './notification.model';
import {
    NOTIFICATION_MESSAGE,
    NOTIFICATION_TYPE,
} from '../../src/constants/notification.constants';
import TwitterCircle from './twitterCircle.model';

export interface ITweet extends mongoose.Document {
    type: string;
    user: ObjectId | string;
    image: string;
    text: string;
    audience: string;
    reply: string;
    mentions: ObjectId[];
    originalTweet: ObjectId | string;
    replyCount: number;
    retweetCount: number;
    bookmarkCount: number;
    viewCount: number;
}

export const tweetModel = {
    type: {
        type: String,
        required: true,
        default: TWEET_TYPE.regular,
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image: {
        type: String,
        default: null,
        required: false,
    },
    text: {
        type: String,
        default: null,
        required: false,
    },
    audience: {
        type: String,
        default: TWEET_AUDIENCE.everyone,
        required: false,
    },
    reply: {
        type: String,
        default: TWEET_REPLY.everyone,
        required: false,
    },
    mentions: [
        {
            type: Types.ObjectId,
            ref: 'User',
            required: false,
        },
    ],
    originalTweet: {
        type: Types.ObjectId,
        ref: 'Tweet',
        required: false,
    },
    replyCount: {
        type: Number,
        default: 0,
        required: true,
    },
    retweetCount: {
        type: Number,
        default: 0,
        required: true,
    },
    bookmarkCount: {
        type: Number,
        default: 0,
        required: true,
    },
    viewCount: {
        type: Number,
        default: 0,
        required: true,
    },
};

const tweetSchema = new mongoose.Schema<ITweet>(tweetModel, {
    timestamps: true,
});

// adding a pre-save hook to parse mentions from the tweet text
tweetSchema.pre<ITweet>('save', function (next) {
    const text = this.text;
    const regex = /@([a-zA-Z0-9_-]+)/g; // match @username
    const mentions: string[] = [];
    let match: any;
    while ((match = regex.exec(text)) !== null) {
        const username = match[1];
        mentions.push(username);
    }

    // find the user ids for each mentioned username
    User.find({ username: { $in: mentions } }, '_id')
        .then((users) => {
            this.mentions = users.map((user) => user._id);
            next();

            // create a notification for each mentioned user
            users.forEach((user) => {
                const notification: INotification = new Notification({
                    type: NOTIFICATION_TYPE.mention,
                    user: user._id,
                    sender: this.user,
                    tweet: this._id,
                    message: NOTIFICATION_MESSAGE.mention,
                });
                notification.save().catch((error) => {
                    console.error(`Failed to create notification: ${error}`);
                });
            });
        })
        .catch((error) => next(error));
});

// adding a pre-save hook to initialize a new twitter circle doc fo a user.
tweetSchema.pre<ITweet>('save', async function (next) {
    if (this.audience === TWEET_AUDIENCE.twitterCircle) {
        try {
            const existingTwitterCircle = await TwitterCircle.findOne({
                user: this.user,
            });

            if (existingTwitterCircle) {
                console.log('User Circle doc already exists!');
                return;
            }

            const newCircle = await TwitterCircle.create({
                user: this.user,
                members: [],
                count: 0,
            });
            console.log('New Twitter Circle created:', newCircle);
            next();
        } catch (err) {
            console.error('Error creating Twitter Circle:', err);
            next(err);
        }
    } else {
        next();
    }
});

const Tweet = mongoose.model<ITweet>('Tweet', tweetSchema, 'Tweet');
Tweet.on('error', handleError);

export default Tweet;