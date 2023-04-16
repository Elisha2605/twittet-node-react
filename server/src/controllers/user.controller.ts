import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getAllUsers, getUserInfo } from 'src/services/user.service';

export const users = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.signedCookies); // this shows on when in the browser
    const result = await getAllUsers();
    res.send(result);
});

export const info = asyncHandler(async (req: Request, res: Response) => {
    const user = await getUserInfo(req.user._id);
    res.send(user);
});

export const image = asyncHandler(async (req: Request, res: Response) => {
    if (req.file) {
        console.log(req.file);
    }
    console.log(req.body);
    res.send({
        body: req.body.name,
        file: req.file.filename,
    });
});
