import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:4000/api',
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
            authorization: `Bearer ${getCurrentContext().token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        },
    };
};

export { http, getCurrentContext, GETREQUESTOPTIONS, GETREQUESTOPTIONS_WITH_MULTIFROM };