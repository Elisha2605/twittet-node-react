import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import User from '../../src/models/user.model';

dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload: any, done: any) => {
        try {
            const user = await User.findOne({ _id: jwt_payload._id });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

// Not used => this function is defined to deserialize
// the user object stored in the session (if sessions are used).
passport.deserializeUser(function (user: any, done) {
    done(null, user);
});
