import { Router } from 'express';
import {
    addUserToTwitterCircleController,
    getUserTwitterCircleMembersController,
} from 'src/controllers/twitterCircle.controller';
import { verifyUser } from 'src/utils/jwt.util';

const twitterCircleRouter = Router();

twitterCircleRouter.get(
    '',
    verifyUser(),
    getUserTwitterCircleMembersController
);

twitterCircleRouter.post(
    '/:id',
    verifyUser(),
    addUserToTwitterCircleController
);

export default twitterCircleRouter;
