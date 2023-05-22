import { Router } from 'express';
import {
    requestPasswordResetController,
    resetPasswordController,
} from 'src/controllers/passwordReset.controller';
import { verifyUser } from 'src/utils/jwt.util';

const passwordRouter = Router();

passwordRouter.post('/request', verifyUser(), requestPasswordResetController);
passwordRouter.post('/reset', verifyUser(), resetPasswordController);

export default passwordRouter;
