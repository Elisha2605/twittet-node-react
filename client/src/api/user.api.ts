import { GETREQUESTOPTIONS, GETREQUESTOPTIONS_WITH_MULTIFROM, http } from "../config/axios.config";

export const getAllUsers = async () => {
    try {
        const res = await http.get('/users');
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
        const res = await http.get(`/users/info/${userId}`, GETREQUESTOPTIONS());
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
        const res = await http.get(`/users/search?q=${searchTerm}`, GETREQUESTOPTIONS());
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

        const contextStr = localStorage.getItem("context");
        if (contextStr) {
        const context = JSON.parse(contextStr);
        const token = context.token;
        const contex = {
            isLoggedIn: true,
            token: token,
            user: {
            _id: res.data.user._id,
            name: res.data.user.name,
            email: res.data.user.email,
            avatar: res.data.user.avatar,
            coverImage: res.data.user.coverImage,
            isActive: res.data.user.isActive,
            isVerified: res.data.user.isVerified,
            isProtected: res.data.user.isProtected,
            createdAt: res.data.user.createdAt,
            },  
        };
        localStorage.setItem("context", JSON.stringify(contex));
        } else {
            console.log("Context not found in local storage");
        }

    
    }
  
    return res.data;
  };