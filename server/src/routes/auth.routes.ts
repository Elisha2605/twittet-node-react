import { Router } from 'express';
import passport from 'passport';
import { logIn, singUp } from 'src/controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', singUp);
authRouter.post('/login', passport.authenticate('local'), logIn);

export default authRouter;
