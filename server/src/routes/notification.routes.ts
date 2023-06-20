import { Router } from 'express';
import {
    getMentionsNotificationController,
    getLikesNotificationController,
    updateNotificationsStateController,
} from '../../src/controllers/notification.controller';

import { verifyUser } from '../../src/utils/jwt.util';

const notificationRouter = Router();

notificationRouter.get('/likes', verifyUser(), getLikesNotificationController);
notificationRouter.get(
    '/mentions',
    verifyUser(),
    getMentionsNotificationController
);
notificationRouter.patch(
    '/update-state',
    verifyUser(),
    updateNotificationsStateController
);

export default notificationRouter;
