import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
userSchema.set('collection', 'User');

const User = mongoose.model<IUser>('User', userSchema);

export default User;
