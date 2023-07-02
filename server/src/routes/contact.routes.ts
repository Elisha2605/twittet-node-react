import { Router } from 'express';
import { verifyUser } from '../../src/utils/jwt.util';
import {
    addContactController,
    getAllContactsController,
} from '../../src/controllers/contact.controller';

const contactRouter = Router();

contactRouter.get('', verifyUser(), getAllContactsController);
contactRouter.post('/add/:id', verifyUser(), addContactController);

export default contactRouter;
