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
import 'src/strategies/JwtStrategy';
import 'src/strategies/LocalStrategy';
import './types/user.type';
import errorHandler from './middleware/error.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';


dotenv.config();

const app: Application = express();

dbConn();

app.use(passport.initialize());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
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

// ERROR - REQUEST HANDLING
app.use(errorHandler);

export default app;
