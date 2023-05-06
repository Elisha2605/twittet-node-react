import { Router } from 'express';
import {
    createTweetController,
    deleteTweetController,
    editTweetController,
    getAllTweetsController,
    getFollowTweetsController,
    getTweetByIdController,
    getUserTweetsController,
    updateAudienceController,
} from 'src/controllers/tweet.controller';
import { verifyUser } from 'src/utils/jwt.util';
import upload from 'src/middleware/multer.middleware';

const tweetRouter = Router();

tweetRouter.get('', verifyUser(), getAllTweetsController);
tweetRouter.get('/user/:id', verifyUser(), getUserTweetsController);
tweetRouter.get('/follow/:id', verifyUser(), getFollowTweetsController);
tweetRouter.get('/tweet/:id', verifyUser(), getTweetByIdController);
tweetRouter.post(
    '/create',
    upload.single('tweetImage'),
    verifyUser(),
    createTweetController
);

tweetRouter.put(
    '/edit/:id',
    verifyUser(),
    upload.single('tweetImage'),
    editTweetController
);

tweetRouter.patch(
    '/update-audience/:id',
    verifyUser(),
    updateAudienceController
);
tweetRouter.delete('/delete/:id', verifyUser(), deleteTweetController);

export default tweetRouter;
