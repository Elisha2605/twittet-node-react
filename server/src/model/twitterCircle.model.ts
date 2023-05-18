import { ObjectId } from 'mongodb';
import mongoose, { Types } from 'mongoose';
import { handleError } from 'src/utils/db.util';

export interface ITwitterCircle extends mongoose.Document {
    user: ObjectId | string;
    members: (ObjectId | string)[];
    count: number;
}

const twitterCirlceModel = {
    user: {
        type: Types.ObjectId,
        ref: 'User',
        require: true,
    },
    members: {
        type: [Types.ObjectId],
        ref: 'User',
        require: true,
    },
    count: {
        type: Number,
        default: 0,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
};

const twitterCircleSchema = new mongoose.Schema<ITwitterCircle>(
    twitterCirlceModel
);

const TwitterCircle = mongoose.model<ITwitterCircle>(
    'TwitterCircle',
    twitterCircleSchema,
    'TwitterCircle'
);
TwitterCircle.on('error', handleError);

export default TwitterCircle;
