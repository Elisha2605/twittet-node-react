import { Router } from 'express';
import { verifyUser } from '../../src/utils/jwt.util';
import {
    editEmailController,
    editProtectedController,
    editUserProfileController,
    editUsernameController,
    image,
    info,
    me,
    searchUserByEmailController,
    searchUserByUserNameController,
    searchUsersController,
    users,
} from '../../src/controllers/user.controller';
import upload, { uploadToS3 } from '../../src/middleware/multer.middleware';

const userRouter = Router();

userRouter.get('', verifyUser(), users);
userRouter.get('/me', verifyUser(), me);
userRouter.get('/info/:id', verifyUser(), info);
userRouter.get('/search', verifyUser(), searchUsersController);
userRouter.get('/search/email', verifyUser(), searchUserByEmailController);
userRouter.get(
    '/search/username',
    verifyUser(),
    searchUserByUserNameController
);
userRouter.patch(
    '/edit-profile',
    upload.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'avatar', maxCount: 1 },
    ]),
    uploadToS3(['cover', 'avatar']),
    verifyUser(),
    editUserProfileController
);
userRouter.patch('/username', verifyUser(), editUsernameController);
userRouter.patch('/email', verifyUser(), editEmailController);
userRouter.patch('/is-protected', verifyUser(), editProtectedController);
userRouter.post(
    '/upload',
    upload.single('avatar'),
    uploadToS3('avatar'),
    verifyUser(),
    image
);

export default userRouter;
