import { Router } from 'express';
import {
    createReplyController,
    getAllTweetRepliesController,
    getReplyByIdController,
} from '../../src/controllers/reply.controller';
import upload, { uploadToS3 } from '../../src/middleware/multer.middleware';

import { verifyUser } from '../../src/utils/jwt.util';

const replyRouter = Router();

replyRouter.post(
    '/create/:id',
    upload.fields([{ name: 'replyImage', maxCount: 1 }]),
    uploadToS3(['replyImage']),
    verifyUser(),
    createReplyController
);
replyRouter.get('/:id', verifyUser(), getAllTweetRepliesController);
replyRouter.get('/reply/:id', verifyUser(), getReplyByIdController);

export default replyRouter;
