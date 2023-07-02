import { GETREQUESTOPTIONS, http } from '../config/axios.config';

export const getAllNotifications = async () => {
    try {
        const res = await http.get('/notifications', GETREQUESTOPTIONS());
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
};

export const getMentionsNotification = async () => {
    try {
        const res = await http.get(
            '/notifications/mentions',
            GETREQUESTOPTIONS()
        );
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
};

export const updateNotificationsState = async () => {
    try {
        const res = await http.patch(
            '/notifications/update-state',
            {},
            GETREQUESTOPTIONS()
        );
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
};
