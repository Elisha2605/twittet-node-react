import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { handleError } from '../../src/utils/db.util';

export interface ISession extends mongoose.Types.Subdocument {
    refreshToken: string;
}

const sessionSchema = new mongoose.Schema(
    {
        refreshToken: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export interface IUser extends mongoose.Document {
    email: string;
    name: string;
    username: string;
    avatar: string;
    coverImage: string;
    bio: string;
    location: string;
    website: string;
    isActive: boolean;
    isVerified: boolean;
    isProtected: boolean;
    refreshToken: mongoose.Types.DocumentArray<ISession>;
    twitterCircleCount: number;
    setPassword: any;
    changePassword: any;
    comparePassword: any;
}

export const userModel = {
    email: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    avatar: {
        type: String,
        default: 'default-avatar.jpg',
        required: false,
    },
    coverImage: {
        type: String,
        default: 'default-cover.jpg',
        required: false,
    },
    bio: {
        type: String,
        default: null,
        required: false,
    },
    twitterCircleCount: {
        type: Number,
        default: 0,
        required: false,
    },
    location: {
        type: String,
        default: null,
        required: false,
    },
    website: {
        type: String,
        default: null,
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: false,
    },
    isProtected: {
        type: Boolean,
        default: false,
        required: false,
    },
    authStrategy: {
        type: String,
        default: 'local',
        required: true,
    },
    refreshToken: {
        type: [sessionSchema],
    },
};

const userSchema = new mongoose.Schema<IUser>(userModel, { timestamps: true });
//Remove refreshToken from the response
userSchema.set('toJSON', {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform: function (doc, ret, options) {
        delete ret.refreshToken;
        return ret;
    },
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.set('collection', 'User');

export interface userModel extends mongoose.PassportLocalModel<IUser> {}

const User = mongoose.model<IUser, userModel>('User', userSchema);
User.on('error', handleError);

export default User;
