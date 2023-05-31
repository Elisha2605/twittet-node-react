import { GETREQUESTOPTIONS, http } from '../config/axios.config';

export const getAuthUserTwitterCircleMembers = async () => {
    try {
        const res = await http.get('/twitterCircles', GETREQUESTOPTIONS());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addUserToTwitterCircle = async (userId: string) => {
    try {
        const res = await http.post(`/twitterCircles/${userId}`, {}, GETREQUESTOPTIONS());

        if (res.status === 200) {
            const contextStr = localStorage.getItem('context');
            if (contextStr) {
                const context = JSON.parse(contextStr);
                const updatedUser = {
                    ...context.user,
                    twitterCircleCount: res.data.user.count,
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
    } catch (error) {
        console.error(error);
        throw error;
    }
};