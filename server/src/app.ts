import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConn } from './config/db';
import session from 'express-session';
import passport from 'passport';
import mongoSession from 'connect-mongodb-session';
import httpContext from 'express-http-context';
import cookieParser from 'cookie-parser';
import { UserContext } from './config/custom.config';
import bodyParser from 'body-parser';
import 'src/strategies/JwtStrategy';
import 'src/strategies/LocalStrategy';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

declare module 'express-session' {
    interface SessionData extends UserContext {
        test: string;
        cookie: Cookie;
        passport: {
            user: any;
        };
    }
}

declare global {
    namespace Express {
        interface User {
            _id: string;
            name: string;
            email: string;
            refreshToken: string;
            token: string;
        }
    }
}

declare module 'http' {
    interface IncomingMessage {
        user: any;
    }
}

const MongoDBStore = mongoSession(session);

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
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    allowedHeaders:
        'Content-Type, Authorization, Access-Control-Allow-Credentials',
};
app.use(cors(corsOptions));

const store = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: 'sessions',
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

// ROUTES - API
app.get('/', (req, res) => {
    res.send('Hello ' + JSON.stringify(req.session));
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Internal server error',
    });
});

export default app;
