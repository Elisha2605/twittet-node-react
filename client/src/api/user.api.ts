import { GETREQUESTOPTIONS, http } from "../config/axios.config";

export const getAllUsers = async () => {
    try {
        const res = await http.get('/users');
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserInfo = async () => {
    try {
        const res = await http.get('/users/info', GETREQUESTOPTIONS());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};