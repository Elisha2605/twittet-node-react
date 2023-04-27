import { GETREQUESTOPTIONS, http } from "../config/axios.config";

export const getAllUsers = async () => {
    try {
        const res = await http.get('/users');
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('context');
            window.location.href = '/';
        } else {
            console.error(error);
            throw error;
        }
    }
};

export const getAuthUserInfo = async () => {
    try {
        const res = await http.get('/users/me', GETREQUESTOPTIONS());
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('context');
            window.location.href = '/';
        } else {
            console.error(error);
            throw error;
        }
    }
};

export const getUserById = async (userId: string) => {
    try {
        const res = await http.get(`/users/info/${userId}`, GETREQUESTOPTIONS());
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('context');
            window.location.href = '/';
        } else {
            console.error(error);
            throw error;
        }
    }
};