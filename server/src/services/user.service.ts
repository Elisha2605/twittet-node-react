import User from 'src/model/user.model';

export const getAllUsers = async (): Promise<any> => {
    const users = await User.find({});
    return users;
};

export const getUserInfo = async (userId: string): Promise<any> => {
    const user = await User.findById(userId);
    return user;
};
