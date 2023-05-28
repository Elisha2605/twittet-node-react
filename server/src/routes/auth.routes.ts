import { Router } from 'express';
import {
    context,
    logIn,
    logOUt,
    singUp,
} from '../../src/controllers/auth.controller';
import { verifyUser } from '../../src/utils/jwt.util';
import upload, { uploadToS3 } from '../../src/middleware/multer.middleware';

const authRouter = Router();

authRouter.post(
    '/signup',
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    uploadToS3(['avatar']),
    singUp
);
authRouter.post('/login', logIn);
authRouter.post('/logout', verifyUser(), logOUt);
authRouter.get('/context', verifyUser(), context);

export default authRouter;
