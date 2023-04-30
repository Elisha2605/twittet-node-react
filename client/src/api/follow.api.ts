import { GETREQUESTOPTIONS, http } from '../config/axios.config';

export const getAuthUserFollows = async (userId: string) => {
    try {
        const res = await http.get(`/follows/${userId}`, GETREQUESTOPTIONS());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const sendFollowRequest = async (senderId: string, receiverId: string) => {
    try {
        const res = await http.post(
            `/follows/send`,
            { senderId: senderId, receiverId: receiverId },
            GETREQUESTOPTIONS(),
        );
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
}