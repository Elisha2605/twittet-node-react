import {
    GETREQUESTOPTIONS,
    GETREQUESTOPTIONS_WITH_MULTIFROM,
    http,
} from '../config/axios.config';

export const getAllUsers = async () => {
    try {
        const res = await http.get('/users', GETREQUESTOPTIONS());
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
};

export const getAuthUserInfo = async () => {
    try {
        const res = await http.get('/users/me', GETREQUESTOPTIONS());
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

export const getUserById = async (userId: string) => {
    try {
        const res = await http.get(
            `/users/info/${userId}`,
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

export const searchUsers = async (searchTerm: string) => {
    try {
        const res = await http.get(
            `/users/search?q=${searchTerm}`,
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

export const searchUserByEmail = async (searchTerm: string) => {
    try {
        const res = await http.get(
            `/users/search/email?q=${searchTerm}`,
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

export const searchUserByUserName = async (searchTerm: string) => {
    try {
        const res = await http.get(
            `/users/search/username?q=${searchTerm}`,
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

export const editUserProfile = async (
    coverImage: File | null,
    avatarImage: File | null,
    name: string | null,
    bio: string | null,
    location: string | null,
    website: string | null
) => {
    const res = await http.patch(
        `/users/edit-profile`,
        {
            cover: coverImage,
            avatar: avatarImage,
            name: name,
            bio: bio,
            location: location,
            website: website,
        },
        GETREQUESTOPTIONS_WITH_MULTIFROM()
    );

    if (res.status === 200) {
        const contextStr = localStorage.getItem('context');
        if (contextStr) {
            const context = JSON.parse(contextStr);
            const updatedUser = {
                ...context.user,
                name: res.data.user.name,
                avatar: res.data.user.avatar,
                coverImage: res.data.user.coverImage,
                website: res.data.user.website,
            };
            const updatedContext = {
                ...context,
                user: updatedUser,
            };
            localStorage.setItem('context', JSON.stringify(updatedContext));
        } else {
            console.log('Context not found in local storage');
        }
    }

    return res.data;
};

export const editUserName = async (username: string) => {
    try {
        const res = await http.patch(
            `/users/username`,
            { username: username },
            GETREQUESTOPTIONS()
        );
        const contextStr = localStorage.getItem('context');

        if (contextStr) {
            const context = JSON.parse(contextStr);
            const updatedUser = {
                ...context.user,
                username: res.data.user.username,
            };
            const updatedContext = {
                ...context,
                user: updatedUser,
            };
            localStorage.setItem('context', JSON.stringify(updatedContext));
            return res.data;
        }
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

export const editEmail = async (email: string) => {
    try {
        const res = await http.patch(
            `/users/email`,
            { email: email },
            GETREQUESTOPTIONS()
        );
        const contextStr = localStorage.getItem('context');
        if (contextStr) {
            const context = JSON.parse(contextStr);
            const updatedUser = {
                ...context.user,
                email: res.data.user.email,
            };
            const updatedContext = {
                ...context,
                user: updatedUser,
            };
            localStorage.setItem('context', JSON.stringify(updatedContext));
        } else {
            console.log('Context not found in local storage');
        }

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

export const editProtected = async (isProtected: boolean) => {
    try {
        const res = await http.patch(
            `/users/is-protected`,
            { isProtected: isProtected },
            GETREQUESTOPTIONS()
        );
        const contextStr = localStorage.getItem('context');
        if (contextStr) {
            const context = JSON.parse(contextStr);
            const updatedUser = {
                ...context.user,
                isProtected: res.data.user.isProtected,
            };
            const updatedContext = {
                ...context,
                user: updatedUser,
            };
            localStorage.setItem('context', JSON.stringify(updatedContext));
            return res.data;
        }
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
