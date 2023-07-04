import mongoose, { ObjectId, Types } from 'mongoose';
import { handleError } from '../../src/utils/db.util';

interface IContact extends mongoose.Document {
    user: string | ObjectId;
    contactList: (string | ObjectId)[];
    blockedList: (string | ObjectId)[];
}

const contactModel = {
    user: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
    },
    contactList: {
        type: [Types.ObjectId],
        ref: 'User',
    },
    blockedList: {
        type: [Types.ObjectId],
        ref: 'User',
    },
};

const contactSchema = new mongoose.Schema<IContact>(contactModel, {
    timestamps: true,
});

const Contact = mongoose.model<IContact>('Contact', contactSchema, 'Contact');
Contact.on('error', handleError);
export default Contact;
