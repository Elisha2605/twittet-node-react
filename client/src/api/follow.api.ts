import { GETREQUESTOPTIONS, http } from "../config/axios.config";

export const getAuthUserFollows = async () => {
    try {
        const res = await http.get('/follows', GETREQUESTOPTIONS());
        return res.data
    } catch (error) {
        console.error(error);
        throw error
    }
}