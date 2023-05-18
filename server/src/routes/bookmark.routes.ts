import { Router } from 'express';
import {
    getUserSavedTweetController,
    saveTweetToBookmarkController,
} from 'src/controllers/bookmark.controller';
import { verifyUser } from 'src/utils/jwt.util';

const bookmarkRouter = Router();

bookmarkRouter.get('', verifyUser(), getUserSavedTweetController);
bookmarkRouter.post('/:id', verifyUser(), saveTweetToBookmarkController);

export default bookmarkRouter;
