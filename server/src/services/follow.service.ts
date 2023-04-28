import { response } from 'express';
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

const handleProtectedFollowRequest = async (
    leader: any,
    follower: any
): Promise<ApiResponse<any>> => {
    // Code to handle follow request for protected users
    try {
        let receiver: any = await Follow.findOne({ user: leader._id });
        let sender: any = await Follow.findOne({ user: follower._id });
        if (!receiver && !sender) {
            // Both the receiver and sender do not exist
            // Create new documents for both
            receiver = new Follow({
                user: leader._id,
                waitings: [{ user: follower._id }],
            });
            sender = new Follow({
                user: follower._id,
                pendings: [{ user: leader._id }],
            });
            // Save the new documents
            const result = await Promise.all([receiver.save(), sender.save()]);
            return {
                success: true,
                message: 'Yuhuuu!',
                status: 200,
                payload: result,
            };
        } else if (receiver && sender) {
            // The follow request is not pending, so add it
            receiver.waitings.push({ user: follower._id });
            sender.pendings.push({ user: leader._id });
            const response = await Promise.all([
                receiver.save(),
                sender.save(),
            ]);
            return {
                success: true,
                message: 'Follow request sent',
                status: 200,
                payload: response,
            };
        } else if (receiver && !sender) {
            // Only the receiver exists
            // Update pendings array of the receiver and create a new sender document
            receiver.waitings.push({ user: follower._id });

            // Create new document for sender
            sender = new Follow({
                user: follower._id,
                pendings: [{ user: leader._id }],
            });

            // Save the updated receiver and new sender documents
            const result = await Promise.all([receiver.save(), sender.save()]);
            return {
                success: true,
                message: 'Yuhuuu!',
                status: 200,
                payload: result,
            };
        } else if (!receiver && sender) {
            // Only the sender exists
            // Create new document for receiver and update sender waitings array
            receiver = new Follow({
                user: leader._id,
                waitings: [{ user: follower._id }],
            });

            // Update waitings array of the sender
            sender.pendings.push({ user: leader._id });

            // Save the new receiver and updated sender documents
            const result = await Promise.all([receiver.save(), sender.save()]);
            return {
                success: true,
                message: 'Yuhuuu!',
                status: 200,
                payload: result,
            };
        }
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

// Follow Request
export const sendFollowRequest = async (
    incomingReqId: string,
    receiverId: string
): Promise<ApiResponse<any>> => {
    try {
        const leader: IUser = await User.findById(receiverId);
        const follower: IUser = await User.findById(incomingReqId);

        if (!leader) {
            throw CustomError('User not found', 404);
        }
        if (!follower) {
            throw CustomError('Follower user not found', 404);
        }

        // Handle follow request if user is protected
        if (leader.isProtected) {
            return handleProtectedFollowRequest(leader, follower);
        }

        return handleUnprotectedFollowRequest(leader, follower);
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

async function handleUnprotectedFollowRequest(
    leader: any,
    follower: any
): Promise<ApiResponse<any>> {
    // Code to handle follow request for unprotected users
    // Handle follow request if user is not protected
    let receiver: any = await Follow.findOne({ user: leader._id });
    let sender: any = await Follow.findOne({ user: follower._id });
    if (!receiver && !sender) {
        // Both the receiver and sender do not exist
        // Create new documents for both
        receiver = new Follow({
            user: leader._id,
            followers: [{ user: follower._id }],
        });
        sender = new Follow({
            user: follower._id,
            followings: [{ user: leader._id }],
        });

        // Save the new documents
        const result = await Promise.all([receiver.save(), sender.save()]);
        return {
            success: true,
            message: 'Yuhuuu!',
            status: 200,
            payload: result,
        };
    } else if (receiver && sender) {
        // Both the receiver and sender exist

        // Update followers array of the receiver
        receiver.followers.push({ user: follower._id });
        // Update followings array of the sender
        sender.followings.push({ user: leader._id });

        // Save the updated sender and receiver documents
        const result = await Promise.all([receiver.save(), sender.save()]);
        return {
            success: true,
            message: 'Yuhuuu!',
            status: 200,
            payload: result,
        };
    } else if (receiver && !sender) {
        // Only the receiver exists
        // Update followers array of the receiver
        receiver.followers.push({ user: follower._id });

        // Create new document for sender
        sender = new Follow({
            user: follower._id,
            followings: [{ user: leader._id }],
        });

        // Save the updated receiver and new sender documents
        const result = await Promise.all([receiver.save(), sender.save()]);
        return {
            success: true,
            message: 'Yuhuuu!',
            status: 200,
            payload: result,
        };
    } else if (!receiver && sender) {
        // Only the sender exists
        // Create new document for receiver
        receiver = new Follow({
            user: leader._id,
            followers: [{ user: follower._id }],
        });

        // Update followings array of the sender
        sender.followings.push({ user: leader._id });

        // Save the new receiver and updated sender documents
        const result = await Promise.all([receiver.save(), sender.save()]);
        return {
            success: true,
            message: 'Yuhuuu!',
            status: 200,
            payload: result,
        };
    }
}
