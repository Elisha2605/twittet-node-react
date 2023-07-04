import { ApiResponse, ErrorResponse } from '../../src/types/apiResponse.types';
import Contact from '../../src/models/contact.model';
import { fetchUserInfo } from '../../src/aggregations/user/fetchUserInfo.aggregation';

export const getAllContacts = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const contacts = await Contact.findOne({ user: userId })
            .populate({
                path: 'contactList',
                select: 'name username avatar isVerified isProtected',
            })
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
            return {
                success: true,
                message: 'User already exist in contact',
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

export const removeContact = async (
    userId: string,
    userToremove: string
): Promise<ApiResponse<any>> => {
    try {
        const existingUser = await Contact.findOne({ user: userId });
        const removedUser = await fetchUserInfo(userToremove);

        if (
            existingUser &&
            existingUser.contactList.some(
                (u: any) => u.toString() === userToremove
            )
        ) {
            existingUser.contactList = existingUser.contactList.filter(
                (u: any) => u.toString() !== userToremove
            );

            await existingUser.save();
            return {
                success: true,
                message: 'User removed from contact',
                status: 200,
                payload: removedUser,
            };
        }
        return {
            success: false,
            message: 'Could not remove user from contact',
            status: 500,
            payload: null,
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
