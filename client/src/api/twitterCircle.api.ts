import { GETREQUESTOPTIONS, http } from '../config/axios.config';

export const getAuthUserTwitterCircleMembers = async () => {
    try {
        const res = await http.get('/twitterCircles', GETREQUESTOPTIONS());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addUserToTwitterCircle = async (userId: string) => {
    try {
        const res = await http.post(`/twitterCircles/${userId}`, {}, GETREQUESTOPTIONS());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};