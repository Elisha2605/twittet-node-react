import { GETREQUESTOPTIONS, http } from '../config/axios.config';

export const getConversation = async (id: string) => {
    try {
        const res = await http.get(
            `/messages/conversation/${id}`,
            GETREQUESTOPTIONS()
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const sendMessage = async (receiverId: string, text: string) => {
    try {
        const res = await http.post(
            `/messages/send/${receiverId}`,
            { text: text },
            GETREQUESTOPTIONS()
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
