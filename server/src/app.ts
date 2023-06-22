import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConn } from './config/db.config';
import passport from 'passport';
import httpContext from 'express-http-context';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import './strategies/jwt.strategy';
import './strategies/local.strategy';
import './types/user.type';
import errorHandler from './middleware/error.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import path from 'path';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tweetRouter from './routes/tweet.routes';
import followRouter from './routes/follow.routes';
import likeRouter from './routes/like.routes';
import bookmarkRouter from './routes/bookmark.routes';
import replyRouter from './routes/reply.routes';
import notificationRouter from './routes/notification.routes';
import twitterCircleRouter from './routes/twitterCircle.routes';
import passwordRouter from './routes/passwordReset.routes';

dotenv.config();

const app: Application = express();

dbConn();

app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(httpContext.middleware);

const corsOptions = {
    origin: [process.env.BASE_URL, process.env.PROD_URL],
    credentials: true,
    optionSuccessStatus: 200,
    allowedHeaders:
        'Content-Type, Authorization, Access-Control-Allow-Credentials',
};
app.use(cors(corsOptions));

app.use(cookieParser(process.env.JWT_SECRET));

app.use(loggerMiddleware);

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tweets', tweetRouter);
app.use('/api/follows', followRouter);
app.use('/api/likes', likeRouter);
app.use('/api/bookmarks', bookmarkRouter);
app.use('/api/replies', replyRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/twitterCircles', twitterCircleRouter);
app.use('/api/password-reset', passwordRouter);

// SERVING STATIC FILES

const __dirname = path.resolve(path.dirname(''));
const __distPath = path.resolve(path.dirname(''));

app.use('/avatar', express.static(path.join(__distPath, 'uploads', 'avatar')));
app.use('/cover', express.static(path.join(__distPath, 'uploads', 'cover')));
app.use(
    '/tweetImage',
    express.static(path.join(__distPath, 'uploads', 'tweetImage'))
);
app.use(
    '/replyImage',
    express.static(path.join(__distPath, 'uploads', 'replyImage'))
);

app.use(express.static(path.resolve(__dirname, 'client', 'build')));

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// ERROR - REQUEST HANDLING
app.use(errorHandler);

export default app;
