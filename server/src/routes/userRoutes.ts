import { Router } from 'express';
import { users } from 'src/controllers/userController';

export const userRouter = Router();

userRouter.get('', users);

export default userRouter;
