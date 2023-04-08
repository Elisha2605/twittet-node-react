import { Router } from 'express';
import { verifyUser } from 'src/middleware/auth.middleware';
import { users } from 'src/controllers/user.controller';

const userRouter = Router();

userRouter.get('', verifyUser(), users);

export default userRouter;
