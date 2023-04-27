import mongoose, { ObjectId, Types } from 'mongoose';
import { handleError } from 'src/utils/db.util';

export interface IFollower extends mongoose.Types.Subdocument {
    from: ObjectId | string;
}

export interface IFollowing extends mongoose.Types.Subdocument {
    from: {
        type: Types.ObjectId;
        ref: 'User';
    };
}

export interface IPending extends mongoose.Types.Subdocument {
    from: {
        type: Types.ObjectId;
        ref: 'User';
    };
}

const followerSchema = new mongoose.Schema(
    {
        from: {
            type: Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const followingSchema = new mongoose.Schema(
    {
        from: {
            type: Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const pendingSchema = new mongoose.Schema(
    {
        from: {
            type: Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

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
