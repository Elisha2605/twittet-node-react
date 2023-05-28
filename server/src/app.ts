import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConn } from './config/db.config';
import session from 'express-session';
import passport from 'passport';
import mongoSession from 'connect-mongodb-session';
import httpContext from 'express-http-context';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import './strategies/jwt.strategy';
import './strategies/local.strategy';
import './types/user.type';
import errorHandler from './middleware/error.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tweetRouter from './routes/tweet.routes';
import path from 'path';
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
    origin: true,
    credentials: true,
    optionSuccessStatus: 200,
    allowedHeaders:
        'Content-Type, Authorization, Access-Control-Allow-Credentials',
};
app.use(cors(corsOptions));

const MongoDBStore = mongoSession(session);

const store = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: 'sessions',
});

store.on('error', (error) => {
    console.log(error);
});

app.use(
    session({
        secret: process.env.JWT_SECRET,
        cookie: {
            maxAge: 3600000 * 24,
            httpOnly: false,
        },
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(passport.session());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(loggerMiddleware);

// ROUTES - API
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
const __distPath = path.resolve(path.dirname('dist/server/src'));

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

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'client/build')));

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     });
// }

// Step 1:
app.use(express.static(path.resolve(__dirname, 'client', 'build')));
// Step 2:
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// ERROR - REQUEST HANDLING
app.use(errorHandler);

export default app;
