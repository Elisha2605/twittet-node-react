import { Router } from 'express';
import { likeTweetController } from 'src/controllers/like.controller';

import { verifyUser } from 'src/utils/jwt.util';

const likeRouter = Router();

likeRouter.post('/:id', verifyUser(), likeTweetController);

export default likeRouter;
