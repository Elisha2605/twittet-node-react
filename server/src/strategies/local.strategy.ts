import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from 'src/models/user.model';

passport.use(
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        User.authenticate()
    )
);

passport.serializeUser((user: any, done) => {
    const sessionUser = {
        id: user._id,
    };
    done(null, sessionUser);
});
