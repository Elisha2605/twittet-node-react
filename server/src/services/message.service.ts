import Message from '../../src/models/message.model';
import { ApiResponse, ErrorResponse } from '../../src/types/apiResponse.types';

export const sendMessage = async (
    sender: string,
    receiver: string,
    text: string
): Promise<ApiResponse<any>> => {
    try {
        const message = await Message.create({
            sender: sender,
            receiver: receiver,
            text: text,
        });

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
