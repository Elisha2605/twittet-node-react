import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = `uploads/${file.fieldname}`;
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const uuid = uuidv4();
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uuid + fileExtension);
    },
});

const upload = multer({ storage: storage });

export default upload;
