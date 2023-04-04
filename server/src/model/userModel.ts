// import mongoose from 'mongoose';
// import { handleError } from './errors/errorHandlingService';

// export interface FormInputs {
//     email: string;
//     password: string;
// }

// export interface IUser {
//     email: string;
//     password: string;
// }

// export const userModel = {
//     email: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
// };

// const userSchema = new mongoose.Schema<IUser>(userModel, {
//     timestamps: true,
// });

// userSchema.set('collection', 'User');
// const User = mongoose.model('User', userSchema, 'User');

// User.on('error', handleError);

// export default User;
