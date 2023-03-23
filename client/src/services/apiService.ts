import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:4000/api',
    timeout: 30000,
});

export const getAllUsers = async () => {
    try {
        const res = await http.get('/users');
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
