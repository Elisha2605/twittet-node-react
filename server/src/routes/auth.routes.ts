import { Router } from 'express';
import { logIn, singUp } from 'src/controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', singUp);
authRouter.post('/login', logIn);

export default authRouter;
