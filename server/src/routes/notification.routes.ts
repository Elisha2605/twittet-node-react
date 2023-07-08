import { Router } from 'express';
import {
    getMentionsNotificationController,
    getAllNotificationController,
    updateNotificationsStateController,
    getMessageNotificationController,
    removeMessageNotificaitonController,
} from '../../src/controllers/notification.controller';

import { verifyUser } from '../../src/utils/jwt.util';

const notificationRouter = Router();

notificationRouter.get('', verifyUser(), getAllNotificationController);
notificationRouter.get(
    '/mentions',
    verifyUser(),
    getMentionsNotificationController
);
notificationRouter.get(
    '/message',
    verifyUser(),
    getMessageNotificationController
);
notificationRouter.patch(
    '/remove-message-notification',
    verifyUser(),
    removeMessageNotificaitonController
);
notificationRouter.patch(
    '/update-state',
    verifyUser(),
    updateNotificationsStateController
);

export default notificationRouter;
