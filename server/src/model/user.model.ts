import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { handleError } from './errors/errorHandlingService';

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
    expiryDate: Date;
    refreshToken: mongoose.Types.DocumentArray<ISession>;
    setPassword: any;
    changePassword: any;
}

export const userModel = {
    email: {
        type: String,
        unique: true,
        required: true,
    },
    expiryDate: {
        type: Date,
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
