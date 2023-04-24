import { Router } from 'express';
import {
    createTweetController,
    deleteTweetController,
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

tweetRouter.delete('/delete/:id', verifyUser(), deleteTweetController);

export default tweetRouter;
