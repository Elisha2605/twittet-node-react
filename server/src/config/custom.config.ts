import { IUser } from 'src/model/user.model';

export interface UserContext {
    isLoggedIn: boolean;
    user: IUser;
}
