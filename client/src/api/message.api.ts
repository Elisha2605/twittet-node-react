import { GETREQUESTOPTIONS, GETREQUESTOPTIONS_WITH_MULTIFROM, http } from '../config/axios.config';

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

export const sendMessage = async (
    receiverId: string,
    text: string | null,
    image: File | null
) => {
    try {
        const res = await http.post(
            `/messages/send/${receiverId}`,
            {
                text: text,
                messageImage: image,
            },
            GETREQUESTOPTIONS_WITH_MULTIFROM()
        );
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

export const updateMessageStatus = async (senderId: string) => {
    try {
        const res = await http.patch(
            `/messages/update-status/${senderId}`,
            {},
            GETREQUESTOPTIONS()
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
