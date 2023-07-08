import { Router } from 'express';
import {
    getConversationController,
    sendMessageController,
    updateMessageStatusController,
} from '../../src/controllers/message.controller';
import { verifyUser } from '../../src/utils/jwt.util';

const messageRouter = Router();

messageRouter.get('/conversation/:id', verifyUser(), getConversationController);
messageRouter.post('/send/:id', verifyUser(), sendMessageController);
messageRouter.patch(
    '/update-status/:id',
    verifyUser(),
    updateMessageStatusController
);

export default messageRouter;
