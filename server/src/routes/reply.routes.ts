import { Router } from 'express';
import {
    createReplyController,
    getAllTweetRepliesController,
    getReplyByIdController,
} from '../../src/controllers/reply.controller';
import upload from '../../src/middleware/multer.middleware';

import { verifyUser } from '../../src/utils/jwt.util';

const replyRouter = Router();

replyRouter.post(
    '/create/:id',
    upload.single('replyImage'),
    verifyUser(),
    createReplyController
);
replyRouter.get('/:id', verifyUser(), getAllTweetRepliesController);
replyRouter.get('/reply/:id', verifyUser(), getReplyByIdController);

export default replyRouter;
