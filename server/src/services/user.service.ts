import User from 'src/model/user.model';

export const getAllUsers = async (): Promise<any> => {
    const users = await User.find({});
    return users;
};
