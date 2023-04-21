import { GETREQUESTOPTIONS, GETREQUESTOPTIONS_WITH_MULTIFROM, http } from '../config/axios.config';

export const getAllTweets = async () => {
    try {
        const res = await http.get('/tweets', GETREQUESTOPTIONS());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createTweet = async (text: string, image: any) => {
    console.log('Inside createTweet');
    console.log(image);

    try {
        const res = await http.post(
            '/tweets/create',
            {
                text: text,
                tweetImage: image,
            },
            GETREQUESTOPTIONS_WITH_MULTIFROM()
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
