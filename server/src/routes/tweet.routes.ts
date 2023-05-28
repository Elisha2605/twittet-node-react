import { Router } from 'express';
import {
    createTweetController,
    deleteTweetController,
    editTweetController,
    getAllTweetsController,
    getFollowTweetsController,
    getTweetByIdController,
    getUserTweetsController,
    reTweetController,
    updateAudienceController,
} from '../../src/controllers/tweet.controller';
import { verifyUser } from '../../src/utils/jwt.util';
import upload, { uploadToS3 } from '../../src/middleware/multer.middleware';

const tweetRouter = Router();

tweetRouter.get('', verifyUser(), getAllTweetsController);
tweetRouter.get('/user-tweets/:id', verifyUser(), getUserTweetsController);
tweetRouter.get('/follower-tweets', verifyUser(), getFollowTweetsController);
tweetRouter.get('/tweet/:id', verifyUser(), getTweetByIdController);
tweetRouter.post(
    '/create',
    verifyUser(),
    upload.fields([{ name: 'tweetImage', maxCount: 1 }]),
    uploadToS3(['tweetImage']),
    createTweetController
);
tweetRouter.post(
    '/retweet/:id',
    verifyUser(),
    upload.fields([{ name: 'tweetImage', maxCount: 1 }]),
    uploadToS3(['tweetImage']),
    reTweetController
);

tweetRouter.put(
    '/edit/:id',
    verifyUser(),
    upload.fields([{ name: 'tweetImage', maxCount: 1 }]),
    uploadToS3(['tweetImage']),
    editTweetController
);

tweetRouter.patch(
    '/update-audience/:id',
    verifyUser(),
    updateAudienceController
);
tweetRouter.delete('/delete/:id', verifyUser(), deleteTweetController);

export default tweetRouter;
