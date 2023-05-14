import { Router } from 'express';
import { addUserToTwitterCircleController } from 'src/controllers/twitterCircle.controller';
import { verifyUser } from 'src/utils/jwt.util';

const twitterCircleRouter = Router();

twitterCircleRouter.post(
    '/:id',
    verifyUser(),
    addUserToTwitterCircleController
);

export default twitterCircleRouter;
