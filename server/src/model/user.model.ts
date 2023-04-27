import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { handleError } from 'src/utils/db.util';

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
    isActive: boolean;
    isVerified: boolean;
    isProtected: boolean;
    refreshToken: mongoose.Types.DocumentArray<ISession>;
    setPassword: any;
    changePassword: any;
}

export const userModel = {
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: (v: string) => {
                return v !== undefined;
            },
            message: (props: any) => `${props.path} is required.`,
        },
    },
    name: {
        type: String,
        unique: false, // change to true
        required: false, // change to true
        validate: {
            validator: (v: string) => {
                return v !== undefined;
            },
            message: (props: any) => `${props.path} is required.`,
        },
    },
    username: {
        type: String,
        unique: false, // change to true
        required: false, // change to true
        validate: {
            validator: (v: string) => {
                return v !== undefined;
            },
            message: (props: any) => `${props.path} is required.`,
        },
    },
    avatar: {
        type: String,
        default: 'default-avatar.jpg',
        required: false,
    },
    coverImage: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true,
        require: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true,
    },
    isProtected: {
        type: Boolean,
        default: false,
        required: true,
    },
    authStrategy: {
        type: String,
        default: 'local',
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
