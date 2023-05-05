import { GETREQUESTOPTIONS, http } from '../config/axios.config';

export const getUserSavedTweets = async () => {
    try {
        const res = await http.get('/bookmarks', GETREQUESTOPTIONS());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const saveTweetToBookmark = async (tweetId: string) => {
    try {
        const res = await http.post(`/bookmarks/${tweetId}`, {}, GETREQUESTOPTIONS());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
