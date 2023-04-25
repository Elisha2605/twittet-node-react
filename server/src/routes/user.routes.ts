import { Router } from 'express';
import { verifyUser } from 'src/utils/jwt.util';
import { image, info, me, users } from 'src/controllers/user.controller';
import upload from 'src/middleware/multer.middleware';

const userRouter = Router();

userRouter.get('', verifyUser(), users);
userRouter.get('/me', verifyUser(), me);
userRouter.get('/info/:id', verifyUser(), info);
userRouter.post('/upload', upload.single('avatar'), verifyUser(), image);

export default userRouter;
