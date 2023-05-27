import mongoose from 'mongoose';
import { handleError } from '../../src/utils/db.util';

export interface IEmailTemplate extends mongoose.Document {
    name: string;
    sender: string;
    subject: string;
    html: string;
}

const emailTemplateModel = {
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    html: {
        type: String,
        required: true,
    },
};

const emailTemplateSchema = new mongoose.Schema<IEmailTemplate>(
    emailTemplateModel,
    {
        timestamps: true,
    }
);
emailTemplateSchema.set('collection', 'EmailTemplate');
const EmailTemplate = mongoose.model(
    'EmailTemplate',
    emailTemplateSchema,
    'EmailTemplate'
);
EmailTemplate.on('error', handleError);

export default EmailTemplate;
