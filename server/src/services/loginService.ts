import { IUser, User } from 'src/model/userModel';

export const loginUser = async (
    email: string,
    password: string
): Promise<IUser> => {
    const user = User.find((user) => {
        return user.email === email && user.password === password;
    });

    return user;
};
