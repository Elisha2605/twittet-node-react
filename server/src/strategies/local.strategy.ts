import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from 'src/model/user.model';

passport.use(
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        User.authenticate()
    )
);

passport.serializeUser((user, done) => {
    const sessionUser = {
        id: user._id,
    };
    done(null, sessionUser);
});