import { Strategy as LocalStrategy } from 'passport-local';
import { async } from 'q';
import User, { IUser } from 'src/model/user.model';
import { validatePassword } from 'src/services/user.service';

export const localStrategy = new LocalStrategy(
    {
        usernameField: 'email',
    },
    async (email: string, password: string, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect email or password.',
                });
            }
            const isPasswordValid = validatePassword(user, password);
            if (!isPasswordValid) {
                return done(null, false, {
                    message: 'Incorrect email or password.',
                });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);

export const serializeUser = (
    user: IUser,
    done: (err: any, id?: string) => void
) => {
    done(null, user._id);
};

export const deserializeUser = async (
    id: string,
    done: (error: any, user?: IUser) => void
) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
};
