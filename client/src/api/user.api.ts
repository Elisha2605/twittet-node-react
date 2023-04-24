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
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('context');
            localStorage.removeItem('activeTab-home');
            localStorage.removeItem('activeTab-notification');
            localStorage.removeItem('activeTab-profile');
            window.location.href = '/';
        } else {
            console.error(error);
            throw error;
        }
    }
};