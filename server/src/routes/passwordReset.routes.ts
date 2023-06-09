import { Router } from 'express';
import {
    verifyPasswordVerificationTokenController,
    requestPasswordResetController,
    resetPasswordController,
} from '../../src/controllers/passwordReset.controller';
import { verifyUser } from '../../src/utils/jwt.util';

const passwordRouter = Router();

passwordRouter.post('/request', verifyUser(), requestPasswordResetController);
passwordRouter.get(
    '/verify-code/:token',
    verifyUser(),
    verifyPasswordVerificationTokenController
);
passwordRouter.patch('/reset', verifyUser(), resetPasswordController);

export default passwordRouter;
