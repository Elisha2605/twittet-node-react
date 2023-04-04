import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import userRouter from './routes/userRoutes';
// import loginRouter from './routes/loginRoutes';
import { dbConn } from './config/db';
import session from 'express-session';
import {
    localStrategy,
    serializeUser,
    deserializeUser,
} from './config/passport.config';
import passport from 'passport';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app: Application = express();

dbConn();

app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        cookie: {
            maxAge: 3600000 * 24,
            httpOnly: false,
        },
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.use(express.json());
app.use(cors());

// app.use('/api/login', loginRouter);
// app.use('/api/users', userRouter);
app.use('/auth', authRoutes);

export default app;
