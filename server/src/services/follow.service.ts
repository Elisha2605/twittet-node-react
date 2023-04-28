import Follow from 'src/model/follow.model';
import User, { IUser } from 'src/model/user.model';
import { ApiResponse, ErrorResponse } from 'src/types/apiResponse.types';
import { CustomError } from 'src/utils/helpers';

export const getUserFollowers = async (userId: string): Promise<any> => {
    try {
        const result = await Follow.findOne({ user: userId })
            .populate({
                path: 'user',
                select: 'name',
            })
            .populate({
                path: 'followers.user',
                select: 'name email',
                model: 'User',
            })
            .exec();
        return result;
    } catch (error) {
        console.error(error);
    }
};

// Follow Request
export const sendFollowRequest = async (
    incommingReqId: string,
    receiverId: string
): Promise<ApiResponse<any>> => {
    try {
        const user: IUser = await User.findById(receiverId);

        if (!user) {
            throw CustomError('User not found', 404);
        }

        const followerUser: IUser = await User.findById(incommingReqId);

        if (!followerUser) {
            throw CustomError('Follower user not found', 404);
        }

        let receiver: any = await Follow.findOne({ user: receiverId });
        let sender: any = await Follow.findOne({ user: incommingReqId });

        if (user.isProtected) {
            // Handle pending requests -> if both users doens't exist
            if (!receiver && !sender) {
                receiver = new Follow({ user: receiverId });
                sender = new Follow({ user: incommingReqId });
                receiver.pendings.push({ user: followerUser._id });
                sender.waitings.push({ user: receiverId });
                await sender.save();

                const response = await receiver.save();

                return {
                    success: true,
                    message: 'Successfully sent follow request!',
                    status: 200,
                    payload: response,
                };
                // Handle pending requests -> if both users exist
            } else if (receiver && sender) {
                receiver.pendings.push({ user: followerUser._id });
                sender.waitings.push({ user: receiverId });
                await sender.save();

                const response = await receiver.save();
                return {
                    success: true,
                    message: 'Successfully sent follow request!',
                    status: 200,
                    payload: response,
                };
                // Handle pending requests -> if receiver doens't exist, but sender exist
            } else if (receiver && !sender) {
                receiver = new Follow({ user: receiverId });
                sender.waitings.push({ user: receiverId });
                await sender.save();

                const response = await receiver.save();
                return {
                    success: true,
                    message: 'Successfully sent follow request!',
                    status: 200,
                    payload: response,
                };
            }
        }

        if (!receiver) {
            receiver = new Follow({ user: receiverId });
        }

        receiver.followers.push({ user: followerUser._id });
        const response = await receiver.save();
        return {
            success: true,
            message: 'Successfully sent follow request!',
            status: 200,
            payload: response,
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
