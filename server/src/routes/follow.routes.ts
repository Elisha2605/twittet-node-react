import { Router } from 'express';
import {
    followRequestController,
    getAuthUserFollowsController,
} from 'src/controllers/follow.controller';
import { verifyUser } from 'src/utils/jwt.util';

const followRouter = Router();

followRouter.get('', verifyUser(), getAuthUserFollowsController);
followRouter.post('/send/:id', verifyUser(), followRequestController);

export default followRouter;
