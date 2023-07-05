import Contact from 'src/models/contact.model';
import Message from '../../src/models/message.model';
import { ApiResponse, ErrorResponse } from '../../src/types/apiResponse.types';

export const getConversation = async (
    authUser: string,
    otherUser: string
): Promise<ApiResponse<any>> => {
    try {
        const conversation = await Message.find({
            $or: [
                { sender: authUser, receiver: otherUser },
                { sender: otherUser, receiver: authUser },
            ],
        });

        return {
            success: true,
            message: 'fetched Conversation',
            status: 200,
            payload: conversation,
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

export const sendMessage = async (
    sender: string,
    receiver: string,
    text: string
): Promise<ApiResponse<any>> => {
    try {
        const receiverUser = await Contact.findOne({ user: receiver });

        const message = await Message.create({
            sender: sender,
            receiver: receiver,
            text: text,
            read: false,
        });

        if (!receiverUser) {
            const receiverUser = new Contact({
                user: receiver,
                contactList: [sender],
            });
            await receiverUser.save();
        }

        if (
            receiverUser &&
            !receiverUser.contactList.some(
                (u: any) => u.toString() === sender.toString()
            )
        ) {
            receiverUser.contactList.push(sender);
            await receiverUser.save();
        }

        if (!message) {
            return {
                success: true,
                message: 'Could not send message',
                status: 500,
                payload: {},
            };
        }

        return {
            success: true,
            message: 'Message sent',
            status: 200,
            payload: message,
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
