import { Router } from 'express';
import passport from 'passport';
import { logIn, logOUt, singUp } from 'src/controllers/auth.controller';
import { verifyUser } from 'src/middleware/auth.middleware';

const authRouter = Router();

authRouter.post('/signup', singUp);
authRouter.post(
    '/login',
    passport.authenticate('local', { session: false }),
    logIn
);
authRouter.post('/logout', verifyUser(), logOUt);

export default authRouter;
