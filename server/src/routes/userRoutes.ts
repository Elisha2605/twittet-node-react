import { Router } from 'express';
import { greetings } from 'src/controllers/userController';

export const userRouter = Router();

userRouter.get('', greetings);

export default userRouter;
