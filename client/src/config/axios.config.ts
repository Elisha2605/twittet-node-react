import axios from 'axios';

const http = axios.create({
    baseURL: 'https://fake-twitter.herokuapp.com/',
    timeout: 30000,
});

const getCurrentContext = () => {
    const storedContext = JSON.parse(localStorage.getItem('context') as string);

    if (storedContext !== null) {
        return storedContext;
    }
};

const GETREQUESTOPTIONS = () => {
    return {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${getCurrentContext().token}`,
            Accept: 'application/json',
        },
    };
};

const GETREQUESTOPTIONS_WITH_MULTIFROM = () => {
    return {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${getCurrentContext().token}`,
            Accept: 'application/json'
        },
    };
};

export { http, getCurrentContext, GETREQUESTOPTIONS, GETREQUESTOPTIONS_WITH_MULTIFROM };