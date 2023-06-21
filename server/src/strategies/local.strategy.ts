import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../../src/models/user.model';

passport.use(
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        User.authenticate()
    )
);
