import { Router } from 'express';
import {
    getConversationController,
    sendMessageController,
} from '../../src/controllers/message.controller';
import { verifyUser } from '../../src/utils/jwt.util';

const messageRouter = Router();

messageRouter.get('/conversation/:id', verifyUser(), getConversationController);
messageRouter.post('/send/:id', verifyUser(), sendMessageController);

export default messageRouter;
