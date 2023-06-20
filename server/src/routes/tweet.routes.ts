import { Router } from 'express';
import {
    replyController,
    createTweetController,
    deleteTweetController,
    editTweetController,
    getAllTweetsController,
    getFollowTweetsController,
    getTweetByIdController,
    getUserTweetRepliesController,
    getUserTweetsController,
    reTweetController,
    updateAudienceController,
    getTweetRepliesController,
} from '../../src/controllers/tweet.controller';
import { verifyUser } from '../../src/utils/jwt.util';
import upload, { uploadToS3 } from '../../src/middleware/multer.middleware';

const tweetRouter = Router();

tweetRouter.get('', verifyUser(), getAllTweetsController);
tweetRouter.get('/replies/:id', verifyUser(), getTweetRepliesController);
tweetRouter.get(
    '/user-replies/:id',
    verifyUser(),
    getUserTweetRepliesController
);
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
    '/reply/:id',
    verifyUser(),
    upload.fields([{ name: 'tweetImage', maxCount: 1 }]),
    uploadToS3(['tweetImage']),
    replyController
);
tweetRouter.post(
    '/retweet/:id',
    verifyUser(),
    upload.fields([{ name: 'tweetImage', maxCount: 1 }]),
    uploadToS3(['tweetImage']),
    reTweetController
);

tweetRouter.patch(
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
