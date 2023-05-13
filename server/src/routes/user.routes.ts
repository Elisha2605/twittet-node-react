import { Router } from 'express';
import { verifyUser } from 'src/utils/jwt.util';
import {
    editUserProfileController,
    image,
    info,
    me,
    searchUsersController,
    users,
} from 'src/controllers/user.controller';
import upload from 'src/middleware/multer.middleware';

const userRouter = Router();

userRouter.get('', verifyUser(), users);
userRouter.get('/me', verifyUser(), me);
userRouter.get('/info/:id', verifyUser(), info);
userRouter.get('/search', verifyUser(), searchUsersController);
userRouter.patch(
    '/edit-profile',
    upload.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'avatar', maxCount: 1 },
    ]),
    verifyUser(),
    editUserProfileController
);
userRouter.post('/upload', upload.single('avatar'), verifyUser(), image);

export default userRouter;
