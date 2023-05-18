import mongoose, { ObjectId, Types } from 'mongoose';
import { handleError } from 'src/utils/db.util';

export interface IFollower extends mongoose.Types.Subdocument {
    user: ObjectId | string;
}
export interface IFollowing extends mongoose.Types.Subdocument {
    user: ObjectId | string;
}
export interface IPending extends mongoose.Types.Subdocument {
    user: ObjectId | string;
}
export interface IWaiting extends mongoose.Types.Subdocument {
    user: ObjectId | string;
}
export interface IDeclined extends mongoose.Types.Subdocument {
    user: ObjectId | string;
}

const followerSchema = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const followingSchema = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const pendingSchema = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const waitingSchema = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const declinedSchema = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export interface IFollow extends mongoose.Document {
    user: ObjectId | string;
    followers: mongoose.Types.DocumentArray<IFollower>;
    followings: mongoose.Types.DocumentArray<IFollowing>;
    pendings: mongoose.Types.DocumentArray<IPending>;
    waitings: mongoose.Types.DocumentArray<IWaiting>;
    followerCount: number;
    followingCount: number;
}

const followModel = {
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    followers: {
        type: [followerSchema],
    },
    followings: {
        type: [followingSchema],
    },
    pendings: {
        type: [pendingSchema],
    },
    waitings: {
        type: [waitingSchema],
    },
    declines: {
        type: [declinedSchema],
    },
    followerCount: {
        type: Number,
        default: 0,
        required: true,
    },
    followingCount: {
        type: Number,
        default: 0,
        required: true,
    },
};

const followSchema = new mongoose.Schema<IFollow>(followModel, {
    timestamps: true,
});

const Follow = mongoose.model<IFollow>('Follow', followSchema, 'Follow');
Follow.on('error', handleError);

export default Follow;
