import {
    GETREQUESTOPTIONS,
    http,
} from '../config/axios.config';

export const getUserLikedTweets = async (userId: string) => {
    try {
        const res = await http.get(`/likes/liked-tweets/${userId}`, GETREQUESTOPTIONS());
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
};

export const likeTweet = async (tweetId: string) => {
    try {
        const res = await http.post(`/likes/${tweetId}`, {}, GETREQUESTOPTIONS());
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
};