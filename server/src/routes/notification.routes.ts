import { Router } from 'express';
import {
    getMentionsNotificationController,
    getAllNotificationController,
    updateNotificationsStateController,
} from '../../src/controllers/notification.controller';

import { verifyUser } from '../../src/utils/jwt.util';

const notificationRouter = Router();

notificationRouter.get('', verifyUser(), getAllNotificationController);
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
