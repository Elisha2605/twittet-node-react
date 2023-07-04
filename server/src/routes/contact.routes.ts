import { Router } from 'express';
import { verifyUser } from '../../src/utils/jwt.util';
import {
    addContactController,
    getAllContactsController,
    removeContactController,
} from '../../src/controllers/contact.controller';

const contactRouter = Router();

contactRouter.get('', verifyUser(), getAllContactsController);
contactRouter.post('/add/:id', verifyUser(), addContactController);
contactRouter.patch('/remove/:id', verifyUser(), removeContactController);

export default contactRouter;
