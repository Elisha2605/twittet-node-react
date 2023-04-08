import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { handleError } from 'src/utils/db.util';

export interface ISession extends mongoose.Types.Subdocument {
    refreshToken: string;
}

const sessionSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        default: '',
    },
});

export interface IUser extends mongoose.Document {
    email: string;
    refreshToken: mongoose.Types.DocumentArray<ISession>;
    setPassword: any;
    changePassword: any;
    isActive: boolean;
}

export const userModel = {
    email: {
        type: String,
        unique: true,
        required: true,
    },
    authStrategy: {
        type: String,
        default: 'local',
    },
    refreshToken: {
        type: [sessionSchema],
    },
    isActive: {
        type: Boolean,
        require: true,
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
