import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const router = express.Router();

export const greetings = asyncHandler(async (req: Request, res: Response) => {
    res.send('Hello world');
});

export default router;
