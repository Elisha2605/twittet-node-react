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
import 'src/strategies/jwt.strategy';
import 'src/strategies/local.strategy';
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

// SERVING STATIC FILES
app.use('/avatar', express.static(path.join(__dirname, 'uploads', 'avatar')));
app.use('/cover', express.static(path.join(__dirname, 'uploads', 'cover')));
app.use(
    '/tweetImage',
    express.static(path.join(__dirname, 'uploads', 'tweetImage'))
);

// ERROR - REQUEST HANDLING
app.use(errorHandler);

export default app;
