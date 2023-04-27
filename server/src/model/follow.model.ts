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

export interface IFollow extends mongoose.Document {
    user: ObjectId | string;
    followers: mongoose.Types.DocumentArray<IFollower>;
    followings: mongoose.Types.DocumentArray<IFollowing>;
    pending: mongoose.Types.DocumentArray<IPending>;
}

const followModel = {
    user: {
        type: Types.ObjectId,
        ref: 'User',
        require: true,
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
};

const followSchema = new mongoose.Schema<IFollow>(followModel, {
    timestamps: true,
});

const Follow = mongoose.model<IFollow>('Follow', followSchema, 'Follow');
Follow.on('error', handleError);

export default Follow;
