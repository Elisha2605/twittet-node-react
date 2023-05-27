import mongoose, { ObjectId, Types } from 'mongoose';
import { handleError } from '../../src/utils/db.util';

export interface IPasswordReset extends mongoose.Document {
    user_id: ObjectId | string;
    token: string;
    expiry: Date;
    isTokenUsed: boolean;
    resetTimestamp: Date;
}

const passwordResetModel = {
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiry: {
        type: Date,
        require: true,
    },
    isTokenUsed: {
        type: Boolean,
        require: true,
        default: false,
    },
    resetTimestamp: {
        type: Date,
    },
};

const passwordResteSchema = new mongoose.Schema<IPasswordReset>(
    passwordResetModel,
    {
        timestamps: true,
    }
);

passwordResteSchema.set('collection', 'PasswordReset');
const PasswordReset = mongoose.model(
    'PasswordReset',
    passwordResteSchema,
    'PasswordReset'
);

PasswordReset.on('error', handleError);

export default PasswordReset;
