import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import aws from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configure your AWS SDK credentials
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Create an instance of the S3 service
const s3 = new aws.S3();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/gif'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(
                new Error('Only .png, .jpg, .jpeg, and .gif files are allowed!')
            );
        }
    },
});

// Upload middleware function
const uploadToS3 = (folder: string) => (req: any, res: any, next: any) => {
    if (!req.file) {
        return next();
    }

    const file = req.file;
    const uuid = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uuid}${fileExtension}`;
    const key = `${folder}/${filename}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    s3.upload(params, (err: Error, data: any) => {
        if (err) {
            return next(err);
        }

        // Add the S3 URL to the request body or any other desired location
        req.file.filename = filename;
        next();
    });
};

export { uploadToS3 };
export default upload;
