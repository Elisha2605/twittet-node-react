import { GETREQUESTOPTIONS, http } from '../config/axios.config';

export const requestPasswordReset = async (email: string) => {
    try {
        const res = await http.post(
            `/password-reset/request/`,
            { email: email },
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

export const verifyPasswordVerificationToken = async (token: string) => {
    try {
        const res = await http.get(
            `/password-reset/verify-code/${token}`, GETREQUESTOPTIONS()
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


export const resetPassword = async (password: string, token: string) => {
    try {
        const res = await http.patch(
            `/password-reset/reset`,
            { password: password, token: token },
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
