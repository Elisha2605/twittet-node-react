import { UserContext } from 'src/types/custom';

declare module 'express-session' {
    interface SessionData extends UserContext {
        test: string;
        cookie: Cookie;
        passport: {
            user: any;
        };
    }
}

// Extending the User interface of the express module
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

// extending the IncomingMessage interface of the http module
declare module 'http' {
    interface IncomingMessage {
        user: any;
    }
}
