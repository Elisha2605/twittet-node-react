import { http } from "../config/axios.config";

export const getAllUsers = async () => {
    try {
        const res = await http.get('/users');
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};