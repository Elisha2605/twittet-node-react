import { Router } from 'express';
import {
    createTweetController,
    deleteTweetController,
    getAllTweetsController,
    getFollowTweetsController,
    getUserTweetsController,
    updateAudienceController,
} from 'src/controllers/tweet.controller';
import { verifyUser } from 'src/utils/jwt.util';
import upload from 'src/middleware/multer.middleware';

const tweetRouter = Router();

tweetRouter.get('', verifyUser(), getAllTweetsController);
tweetRouter.get('/user/:id', verifyUser(), getUserTweetsController);
tweetRouter.get('/follow/:id', verifyUser(), getFollowTweetsController);
tweetRouter.post(
    '/create',
    upload.single('tweetImage'),
    verifyUser(),
    createTweetController
);
tweetRouter.delete('/delete/:id', verifyUser(), deleteTweetController);
tweetRouter.patch(
    '/update-audience/:id',
    verifyUser(),
    updateAudienceController
);

export default tweetRouter;
