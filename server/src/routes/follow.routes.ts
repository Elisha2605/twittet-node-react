import { Router } from 'express';
import {
    followRequestController,
    getUserFollowsController,
} from 'src/controllers/follow.controller';
import { verifyUser } from 'src/utils/jwt.util';

const followRouter = Router();

followRouter.get('/:id', verifyUser(), getUserFollowsController);
followRouter.post('/send', verifyUser(), followRequestController);

export default followRouter;
