import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getAllUsers } from 'src/services/user.service';

export const users = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.signedCookies);
    const result = await getAllUsers();
    res.send(result);
});
