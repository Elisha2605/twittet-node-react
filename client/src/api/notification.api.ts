import {
    GETREQUESTOPTIONS,
    http,
} from '../config/axios.config';


export const getLikesNotification = async () => {
    try {
        const res = await http.get('/notifications/likes', GETREQUESTOPTIONS());
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
};

export const getMentionsNotification = async () => {
    try {
        const res = await http.get('/notifications/mentions', GETREQUESTOPTIONS());
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
};