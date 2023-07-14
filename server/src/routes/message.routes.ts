import { Router } from 'express';
import {
    deleteMessageController,
    getConversationController,
    replyToMessageController,
    sendMessageController,
    updateMessageStatusController,
} from '../../src/controllers/message.controller';
import { verifyUser } from '../../src/utils/jwt.util';
import upload, { uploadToS3 } from '../../src/middleware/multer.middleware';

const messageRouter = Router();

messageRouter.get('/conversation/:id', verifyUser(), getConversationController);
messageRouter.post(
    '/send/:id',
    verifyUser(),
    upload.fields([{ name: 'messageImage', maxCount: 1 }]),
    uploadToS3(['messageImage']),
    sendMessageController
);
messageRouter.post(
    '/reply/:id',
    verifyUser(),
    upload.fields([{ name: 'messageImage', maxCount: 1 }]),
    uploadToS3(['messageImage']),
    replyToMessageController
);
messageRouter.patch(
    '/update-status/:id',
    verifyUser(),
    updateMessageStatusController
);
messageRouter.delete('/delete/:id', verifyUser(), deleteMessageController);

export default messageRouter;
