import { GETREQUESTOPTIONS, http } from "../config/axios.config";

export const getAuthUserFollows = async (userId: string) => {
    try {
        const res = await http.get(`/follows/${userId}`, GETREQUESTOPTIONS());
        return res.data
    } catch (error) {
        console.error(error);
        throw error
    }
}