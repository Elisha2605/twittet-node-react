import { Router } from 'express';
import { sendMessageController } from '../../src/controllers/message.controller';
import { verifyUser } from '../../src/utils/jwt.util';

const messageRouter = Router();

messageRouter.post('/send/:id', verifyUser(), sendMessageController);

export default messageRouter;
