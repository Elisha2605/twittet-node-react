import { Router } from 'express';
import {
    approveFollowRequestController,
    declineFollowRequestController,
    followRequestController,
    getAuthUserFollowsController,
    getUserFollowsController,
} from '../../src/controllers/follow.controller';
import { verifyUser } from '../../src/utils/jwt.util';

const followRouter = Router();

followRouter.get('', verifyUser(), getAuthUserFollowsController);
followRouter.get('/:id', verifyUser(), getUserFollowsController);
followRouter.post('/request/:id', verifyUser(), followRequestController);
followRouter.post('/approve', verifyUser(), approveFollowRequestController);
followRouter.post('/decline', verifyUser(), declineFollowRequestController);

export default followRouter;
