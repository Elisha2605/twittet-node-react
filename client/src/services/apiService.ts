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

export const GETREQUESTOPTIONS = () => {
    return {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${getCurrentContext().token}`,
            Accept: 'application/json',
        },
    };
};

export const getAllUsers = async () => {
    try {
        const res = await http.get('/users');
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const singup = async (
    email: string,
    password: string,
    passwordConfirmation: string
) => {
    try {
        const res = await http.post('/auth/signup', {
            email: email,
            password: password,
            passwordConfirmation: passwordConfirmation,
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const login = async (email: string, password: string) => {
    const res = await http
        .post(
            '/auth/login',
            {
                email: email,
                password: password,
            },
            {
                withCredentials: true,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
            }
        )
        .catch((error) => {
            return error.response;
        });

    if (res.status === 200) {
        const contex = {
            isLoggedIn: res.data.isLoggedIn,
            token: res.data.token,
            expiryDate: res.data.user.expiryDate,
        };
        localStorage.setItem('context', JSON.stringify(contex));
    }

    return res.data;
};

export const logout = async () => {
    const res = await http
        .post('/auth/logout', {}, GETREQUESTOPTIONS())
        .catch((error) => {
            return error.response;
        });
    if (res.status === 200) {
        localStorage.removeItem('context');
    }
    return res.data;
};
