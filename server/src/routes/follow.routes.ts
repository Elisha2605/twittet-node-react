import { Router } from 'express';
import {
    followRequestController,
    getFollowersController,
} from 'src/controllers/follow.controller';
import { verifyUser } from 'src/utils/jwt.util';

const followRouter = Router();

followRouter.get('', verifyUser(), getFollowersController);
followRouter.post('/send/:id', verifyUser(), followRequestController);

export default followRouter;
