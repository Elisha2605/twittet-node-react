import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = `server/src/uploads/${file.fieldname}`;
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const uuid = uuidv4();
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uuid + fileExtension);
    },
});

const fileFilter = function (req: any, file: any, cb: any) {
    if (!req.file) {
        // continue even if no file is provided
        cb(null, true);
    } else {
        // check if the file meets the accepted file types
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
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;