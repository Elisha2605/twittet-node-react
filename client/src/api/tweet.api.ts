import {
    GETREQUESTOPTIONS,
    GETREQUESTOPTIONS_WITH_MULTIFROM,
    http,
} from '../config/axios.config';

export const getAllTweets = async () => {
    try {
        const res = await http.get('/tweets', GETREQUESTOPTIONS());
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

export const getTweetById = async (tweetId: string) => {
    try {
        const res = await http.get(`/tweets/tweet/${tweetId}`, GETREQUESTOPTIONS());
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

export const getUserTweets = async () => {
    try {
        const res = await http.get(
            '/tweets/user-tweets',
            GETREQUESTOPTIONS()
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

export const getFollowTweets = async () => {
    try {
        const res = await http.get(
            '/tweets/follower-tweets',
            GETREQUESTOPTIONS()
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

export const createTweet = async (
    text: string | null,
    image: File | null,
    audience: string,
    reply: string
) => {
    try {
        const res = await http.post(
            '/tweets/create',
            {
                text: text,
                tweetImage: image,
                audience: audience,
                reply: reply,
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

export const editTweet = async (
    tweetId: string,
    text: string | null,
    image: File | null,
    audience: string,
    reply: string
) => {
    try {
        const res = await http.put(
            `/tweets/edit/${tweetId}`,
            {
                text: text,
                tweetImage: image,
                audience: audience,
                reply: reply,
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

export const deleteTweet = async (tweetId: string) => {
    try {
        const res = await http.delete(
            `/tweets/delete/${tweetId}`,
            GETREQUESTOPTIONS()
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

export const updateTweetAudience = async (
    tweetId: string,
    audienceOption: string
) => {
    try {
        const res = await http.patch(
            `/tweets/update-audience/${tweetId}`,
            { audienceOption: audienceOption },
            GETREQUESTOPTIONS()
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
