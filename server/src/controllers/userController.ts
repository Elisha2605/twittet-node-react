import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getAllUser } from 'src/services/loginService';

const router = express.Router();

export const users = asyncHandler(async (req: Request, res: Response) => {
    const users = await getAllUser();
    res.json(users);
});

export default router;
