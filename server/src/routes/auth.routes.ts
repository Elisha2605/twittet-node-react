import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import {
    createUser,
    findUserByEmail,
    loginUser,
} from 'src/services/user.service';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await createUser(email, password);
    return res.status(201).send({ id: user._id, email: user.email });
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', async (error, user) => {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res
                .status(401)
                .send({ message: 'Incorrect email or password' });
        }
        const token = await loginUser(req, user);
        return res.send({ token });
    })(req, res, next);
});

interface CustomSession {
    refreshToken?: string;
}

router.post(
    '/refresh-token',
    async (req: Request & { session: CustomSession }, res: Response) => {
        const { refreshToken } = req.session;
        if (!refreshToken) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        try {
            const decodedToken = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET as string
            ) as { userId: string };
            const user = await findUserByEmail(decodedToken.userId);

            if (!user) {
                return res.status(401).send({ message: 'Unauthorized' });
            }
            const newToken = jwt.sign(
                { userId: user.id },
                process.env.ACCESS_TOKEN_SECRET as string,
                {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
                }
            );
            const newRefreshToken = jwt.sign(
                { userId: user.id },
                process.env.REFRESH_TOKEN_SECRET as string,
                {
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
                }
            );
            req.session.refreshToken = newRefreshToken;
            return res.send({ token: newToken });
        } catch (error) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
    }
);

export default router;
