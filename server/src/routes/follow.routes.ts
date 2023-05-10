import { Router } from 'express';
import {
    approveFollowRequestController,
    declineFollowRequestController,
    followRequestController,
    getUserFollowsController,
} from 'src/controllers/follow.controller';
import { verifyUser } from 'src/utils/jwt.util';

const followRouter = Router();

followRouter.get('/:id', verifyUser(), getUserFollowsController);
followRouter.post('/send', verifyUser(), followRequestController);
followRouter.post('/approve', verifyUser(), approveFollowRequestController);
followRouter.post('/decline', verifyUser(), declineFollowRequestController);

export default followRouter;
