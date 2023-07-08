import Contact from '../../src/models/contact.model';
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
                contactList: [{ user: sender }],
            });
            await receiverUser.save();
        }

        /** If sender is not in contactList and 
        receiver exists push sender in contactList */
        if (
            receiverUser &&
            !receiverUser.contactList.some(
                (u: any) => u.user.toString() === sender.toString()
            )
        ) {
            receiverUser.contactList.unshift({
                user: sender,
            });
            await receiverUser.save();
        }

        /** If sender is in contactList shift sender index to last. -
         * should be reversed in fontend */
        if (
            receiverUser &&
            receiverUser.contactList.some(
                (u: any) => u.user.toString() === sender.toString()
            )
        ) {
            const senderIndex = receiverUser.contactList.findIndex(
                (u: any) => u.user.toString() === sender.toString()
            );
            if (senderIndex !== -1 && senderIndex !== 0) {
                const [removedSender] = receiverUser.contactList.splice(
                    senderIndex,
                    1
                );
                receiverUser.contactList.unshift(removedSender);
                await receiverUser.save();
            }
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

export const updateMessageStatus = async (
    sender: string,
    receiver: string
): Promise<ApiResponse<any>> => {
    try {
        const updateResult = await Message.updateMany(
            { receiver: receiver, sender: sender, read: false },
            { $set: { read: true } }
        );

        return {
            success: true,
            message: 'Notifications read',
            status: 200,
            payload: updateResult,
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
