import { Router } from 'express';
import { verifyUser } from 'src/utils/jwt.util';
import { image, info, users } from 'src/controllers/user.controller';
import upload from 'src/middleware/multer.middleware';

const userRouter = Router();

userRouter.get('', verifyUser(), users);
userRouter.get('/info', verifyUser(), info);

userRouter.get('/info', verifyUser());

userRouter.post('/upload', upload.single('avatar'), verifyUser(), image);

export default userRouter;
