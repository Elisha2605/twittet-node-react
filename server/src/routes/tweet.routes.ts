import { Router } from 'express';
import {
    createTweetController,
    getAllTweetsController,
} from 'src/controllers/tweet.controller';
import { verifyUser } from 'src/utils/jwt.util';
import upload from 'src/middleware/multer.middleware';

const tweetRouter = Router();

tweetRouter.get('', verifyUser(), getAllTweetsController);

tweetRouter.post(
    '/create',
    upload.single('tweetImage'),
    verifyUser(),
    createTweetController
);

export default tweetRouter;
