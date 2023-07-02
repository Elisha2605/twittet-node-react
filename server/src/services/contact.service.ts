import { ApiResponse, ErrorResponse } from '../../src/types/apiResponse.types';
import Contact from '../../src/models/contact.model';
import { fetchUserInfo } from '../../src/aggregations/user/fetchUserInfo.aggregation';

export const getAllContacts = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const contacts = await Contact.findOne({ user: userId })
            .populate('contactList', 'name email')
            .exec();

        if (!contacts) {
            return {
                success: false,
                message: 'Contacts not found',
                status: 404,
                payload: null,
            };
        }

        return {
            success: true,
            message: 'fetched contacts',
            status: 200,
            payload: contacts,
        };
    } catch (error) {
        const errorResponse: ErrorResponse = {
            success: false,
            message: error.message || 'Internal server error',
            status: error.statusCode || 500,
            error: error,
        };
        return Promise.reject(errorResponse);
    }
};

export const addContact = async (
    userId: string,
    newUser: string
): Promise<ApiResponse<any>> => {
    try {
        const existingUser = await Contact.findOne({ user: userId });
        const userToAdd = await fetchUserInfo(newUser);

        if (!existingUser) {
            const addedUser = new Contact({
                user: userId,
                contactList: [newUser],
            });
            const res = await addedUser.save();
            return {
                success: true,
                message: 'User added to contact',
                status: 200,
                payload: res,
            };
        }

        if (
            existingUser &&
            existingUser.contactList.some((u: any) => u.toString() === newUser)
        ) {
            existingUser.contactList = existingUser.contactList.filter(
                (u: any) => u.toString() !== newUser
            );

            await existingUser.save();
            return {
                success: true,
                message: 'User removed from contact',
                status: 200,
                payload: userToAdd,
            };
        }
        existingUser.contactList.push(newUser);
        await existingUser.save();
        return {
            success: true,
            message: 'User added to contact',
            status: 200,
            payload: userToAdd,
        };
    } catch (error) {
        const errorResponse: ErrorResponse = {
            success: false,
            message: error.message || 'Internal server error',
            status: error.statusCode || 500,
            error: error,
        };
        return Promise.reject(errorResponse);
    }
};
