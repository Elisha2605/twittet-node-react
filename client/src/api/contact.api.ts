import { GETREQUESTOPTIONS, http } from '../config/axios.config';

export const getAllContacts = async () => {
    try {
        const res = await http.get('/contacts', GETREQUESTOPTIONS());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getContactById = async (contactId: string) => {
    try {
        const res = await http.get(`/contacts/${contactId}`, GETREQUESTOPTIONS());
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addContact = async (contactId: string) => {
    try {
        const res = await http.post(
            `/contacts/add/${contactId}`,
            {},
            GETREQUESTOPTIONS()
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const removeContact = async (contactId: string) => {
    try {
        const res = await http.patch(
            `/contacts/remove/${contactId}`,
            {},
            GETREQUESTOPTIONS()
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
