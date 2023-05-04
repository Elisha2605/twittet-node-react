import { Router } from 'express';
import {
    getUserLikedTweetsController,
    likeController,
} from 'src/controllers/like.controller';

import { verifyUser } from 'src/utils/jwt.util';

const likeRouter = Router();

likeRouter.get('/liked-tweets/:id', verifyUser(), getUserLikedTweetsController);
likeRouter.post('/:id', verifyUser(), likeController);

export default likeRouter;
