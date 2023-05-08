import {
    GETREQUESTOPTIONS,
    GETREQUESTOPTIONS_WITH_MULTIFROM,
    http,
} from '../config/axios.config';

export const getAllTweetReplies = async (tweetId: string) => {
    try {
        const res = await http.get(`/replies/${tweetId}`, GETREQUESTOPTIONS());
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

export const getReplyById = async (replyId: string) => {
    try {
        const res = await http.get(`/replies/reply${replyId}`, GETREQUESTOPTIONS());
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

export const createTweetReply = async (
    tweetId: string,
    text: string,
    image: File | null,
) => {
    try {
        const res = await http.post(
            `/replies/create/${tweetId}`,
            { text: text, replyImage: image },
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
