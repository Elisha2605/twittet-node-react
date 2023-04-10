import { Router } from 'express';
import { verifyUser } from 'src/utils/jwt.util';
import { info, users } from 'src/controllers/user.controller';

const userRouter = Router();

userRouter.get('', verifyUser(), users);
userRouter.get('/info', verifyUser(), info);

export default userRouter;
