import { GETREQUESTOPTIONS, http } from "../config/axios.config";


export const singup = async (
    email: string,
    avatar: any | undefined,
    password: string,
    passwordConfirmation: string
) => {
    try {
        const res = await http.post('/auth/signup', {
            email: email,
            avatar: avatar,
            password: password,
            passwordConfirmation: passwordConfirmation,
        }, 
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
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
        };
        localStorage.setItem('context', JSON.stringify(contex));
        window.location.href = '/'
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
        window.location.href = '/'
    }
    return res.data;
};

export const getNewContext = async () => {
    return (await http.get('/auth/context', GETREQUESTOPTIONS())).data;
};