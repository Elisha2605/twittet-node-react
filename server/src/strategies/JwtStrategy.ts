import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import User, { IUser } from 'src/model/user.model';

dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, function (jwt_payload: any, done: any) {
        User.findOne(
            { _id: jwt_payload._id },
            function (error: any, user: IUser) {
                if (error) {
                    return done(error, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }
        );
    })
);

passport.deserializeUser(function (user: any, done) {
    done(null, user);
});
