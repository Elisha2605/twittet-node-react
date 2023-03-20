import User, { IUser } from 'src/model/userModel';

export const loginUser = async (
    email: string,
    password: string
): Promise<IUser> => {
    try {
        const newObj = {
            email: email,
            password: password,
        };

        const user = new User(newObj);
        user.save();
        return user;
    } catch (error) {
        console.log(error);
    }
};
