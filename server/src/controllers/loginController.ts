import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { FormInputs } from 'src/model/userModel';
import { loginUser } from '../services/loginService';

const router = express.Router();

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: FormInputs = req.body;

    const response = await loginUser(email, password);
    console.log(response);
    res.json(response);
});

export default router;
