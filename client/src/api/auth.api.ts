import { GETREQUESTOPTIONS, http } from '../config/axios.config';

export const singup = async (
    email: string,
    avatar: any | undefined,
    password: string,
    passwordConfirmation: string
) => {
    const res = await http.post(
        '/auth/signup',
        {
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
        }
    )
    .catch((error) => {
        return error.response;
    });
    
    return res.data;
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
            user: {
                _id: res.data.user._id,
                name: res.data.user.name,
                username: res.data.user.username,
                email: res.data.user.email,
                avatar: res.data.user.avatar,
                coverImage: res.data.user.coverImage,
                isActive: res.data.user.isActive,
                isVerified: res.data.user.isVerified,
                isProtected: res.data.user.isProtected,
                createdAt: res.data.user.createdAt,
            }
        };
        localStorage.setItem('context', JSON.stringify(contex));
        setTimeout(() => {
            window.location.href = '/home';
        }, 1000)
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
        localStorage.removeItem('activeTab-home');
        localStorage.removeItem('activeTab-notification');
        localStorage.removeItem('activeTab-profile');
        window.location.href = '/';
    }
    return res.data;
};

export const getNewContext = async () => {
    return (await http.get('/auth/context', GETREQUESTOPTIONS())).data;
};
