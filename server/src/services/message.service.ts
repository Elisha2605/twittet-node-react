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
            deletedBy: { $ne: authUser }, // Exclude messages where authUser is in the deletedBy array
        });

        return {
            success: true,
            message: 'Fetched Conversation',
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
    text: string,
    image: string
): Promise<ApiResponse<any>> => {
    try {
        const receiverUser = await Contact.findOne({ user: receiver });

        const message = await Message.create({
            sender: sender,
            receiver: receiver,
            text: text,
            image: image,
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

export const deleteMessage = async (
    user: string,
    messageId: string,
    isDeleteForBoth: boolean
): Promise<ApiResponse<any>> => {
    try {
        const deletedMessage = await Message.findById(messageId);

        if (!deletedMessage) {
            return {
                success: true,
                message: `'Message not found!`,
                status: 404,
                payload: 0,
            };
        }

        const authUser = user.toString();
        const sender = deletedMessage.sender.toString();
        const receiver = deletedMessage.receiver.toString();

        // helper function
        const hasUserDeletedMessage = () => {
            return deletedMessage.deletedBy.includes(authUser);
        };

        // checking deletion permission
        if (sender !== authUser && receiver !== authUser) {
            return {
                success: false,
                message: 'Not Allowed to delete this message',
                status: 400,
                payload: {},
            };
        }

        // delete for message for both users
        if (sender === authUser && isDeleteForBoth) {
            await deletedMessage.deleteOne();
            return {
                success: true,
                message: `Message deleted for both users!`,
                status: 200,
                payload: true,
            };
        }

        // check if user has already deleted the msg
        if (deletedMessage && hasUserDeletedMessage()) {
            return {
                success: true,
                message: `Message already deleted by: ${authUser}`,
                status: 200,
                payload: {},
            };
        }

        if (deletedMessage && !hasUserDeletedMessage()) {
            deletedMessage.deletedBy.push(authUser);
            await deletedMessage.save();

            if (deletedMessage.deletedBy.length === 2) {
                await deletedMessage.deleteOne();
                console.log('Message deleted by both users');
            }
        }

        return {
            success: true,
            message: `Deleted message with id: ${deletedMessage._id}`,
            status: 200,
            payload: true,
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
