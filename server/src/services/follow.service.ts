import Follow from '../../src/models/follow.model';
import User, { IUser } from '../../src/models/user.model';
import { ApiResponse, ErrorResponse } from '../../src/types/apiResponse.types';
import { CustomError } from '../../src/utils/helpers';

export const getUserFollows = async (userId: string): Promise<any> => {
    try {
        const result = await Follow.findOne({ user: userId })
            .populate({
                path: 'user',
                select: 'name username',
            })
            .populate({
                path: 'followers.user',
                select: '_id name username avatar isVerified isProtected',
                model: 'User',
            })
            .populate({
                path: 'followings.user',
                select: '_id name username avatar isVerified isProtected',
                model: 'User',
            })
            .populate({
                path: 'pendings.user',
                select: '_id name username avatar isVerified isProtected',
                model: 'User',
            })
            .populate({
                path: 'waitings.user',
                select: '_id name username avatar isVerified isProtected',
                model: 'User',
            })
            .exec();

        if (!result) {
            return [];
        }
        return result;
    } catch (error) {
        console.error(error);
    }
};

export const getAuthUserFollow = async (userId: string): Promise<any> => {
    try {
        const result = await Follow.findOne({ user: userId })
            .populate({
                path: 'user',
                select: 'name username',
            })
            .populate({
                path: 'followers.user',
                select: '_id name username avatar isVerified',
                model: 'User',
            })
            .populate({
                path: 'followings.user',
                select: '_id name username avatar isVerified',
                model: 'User',
            })
            .populate({
                path: 'pendings.user',
                select: '_id name username avatar isVerified',
                model: 'User',
            })
            .populate({
                path: 'waitings.user',
                select: '_id name username avatar isVerified',
                model: 'User',
            })
            .exec();

        if (!result) {
            return [];
        }
        return result;
    } catch (error) {
        console.error(error);
    }
};

const handleProtectedFollowRequest = async (
    leader: any,
    follower: any
): Promise<ApiResponse<any>> => {
    // handle follow request for protected users
    try {
        let receiver: any = await Follow.findOne({ user: leader._id });
        let sender: any = await Follow.findOne({ user: follower._id });

        /**
         * Check if follower._id is in receiver.waitings array or leader._id is in sender.pendings array, if yes:
         *   a. remove both follower._id and leader._id from receiver and sender.
         *
         * If not continue with the bellow if statements.
         */
        if (
            (receiver &&
                receiver.waitings.some(
                    (item: any) =>
                        item.user.toString() === follower._id.toString()
                )) ||
            (receiver &&
                receiver.followers.some(
                    (item: any) =>
                        item.user.toString() === follower._id.toString()
                )) ||
            (sender &&
                sender.pendings.some(
                    (item: any) =>
                        item.user.toString() === leader._id.toString()
                )) ||
            (sender &&
                sender.followings.some(
                    (item: any) =>
                        item.user.toString() === leader._id.toString()
                ))
        ) {
            // Remove follower._id from receiver.waitings array
            receiver.waitings = receiver.waitings.filter(
                (item: any) => item.user.toString() !== follower._id.toString()
            );
            receiver.followers = receiver.followers.filter(
                (item: any) => item.user.toString() !== follower._id.toString()
            );

            // Remove leader._id from sender.pendings array
            sender.pendings = sender.pendings.filter(
                (item: any) => item.user.toString() !== leader._id.toString()
            );
            sender.followings = sender.followings.filter(
                (item: any) => item.user.toString() !== leader._id.toString()
            );

            // Save the updated documents
            const result = await Promise.all([receiver.save(), sender.save()]);
            return {
                success: true,
                message: 'Unsend',
                status: 200,
                payload: result,
            };
        }

        // unfollow if user is protected
        // if ((receiver && receiver.followers.some((item: any) => item.user.toString)))

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
                message: 'Pending',
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
                message: 'Pending',
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
                message: 'Pending',
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
                message: 'Pending',
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
    followerId: string,
    leaderId: string
): Promise<ApiResponse<any>> => {
    try {
        const leader: IUser = await User.findById(leaderId);
        const follower: IUser = await User.findById(followerId);

        if (!leader) {
            throw CustomError('User not found', 404);
        }
        if (!follower) {
            throw CustomError('Follower user not found', 404);
        }

        if (followerId.toString() === leader._id.toString()) {
            return {
                success: false,
                message: 'You can not follow yourself',
                status: 400,
                payload: [],
            };
        }

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
    // Handle follow request if user is not protected
    let receiver: any = await Follow.findOne({ user: leader._id });
    let sender: any = await Follow.findOne({ user: follower._id });

    if (
        (receiver &&
            receiver.followers.some(
                (item: any) => item.user.toString() === follower._id.toString()
            )) ||
        (sender &&
            sender.followings.some(
                (item: any) => item.user.toString() === leader._id.toString()
            ))
    ) {
        // Remove follower._id from receiver.followers array
        receiver.followers = receiver.followers.filter(
            (item: any) => item.user.toString() !== follower._id.toString()
        );
        receiver.followerCount = receiver.followers.length;

        // Remove leader._id from sender.followings array
        sender.followings = sender.followings.filter(
            (item: any) => item.user.toString() !== leader._id.toString()
        );

        sender.followingCount = sender.followings.length;
        // Save the updated documents
        const result = await Promise.all([receiver.save(), sender.save()]);
        return {
            success: true,
            message: 'Unfollow',
            status: 200,
            payload: result,
        };
    }
    if (!receiver && !sender) {
        // Both the receiver and sender do not exist
        // Create new documents for both
        receiver = new Follow({
            user: leader._id,
            followers: [{ user: follower._id }],
            followerCount: 1,
        });
        sender = new Follow({
            user: follower._id,
            followings: [{ user: leader._id }],
            followingCount: 1,
        });

        // Save the new documents
        const result = await Promise.all([receiver.save(), sender.save()]);
        return {
            success: true,
            message: 'Following!',
            status: 200,
            payload: result,
        };
    } else if (receiver && sender) {
        // Both the receiver and sender exist

        // Update followers array of the receiver
        receiver.followers.push({ user: follower._id });
        receiver.followerCount = receiver.followers.length;

        // Update followings array of the sender
        sender.followings.push({ user: leader._id });
        sender.followingCount = sender.followings.length;

        // Save the updated sender and receiver documents
        const result = await Promise.all([receiver.save(), sender.save()]);
        return {
            success: true,
            message: 'Following!',
            status: 200,
            payload: result,
        };
    } else if (receiver && !sender) {
        // Only the receiver exists
        // Update followers array of the receiver
        receiver.followers.push({ user: follower._id });
        receiver.followerCount = receiver.followers.length;

        // Create new document for sender
        sender = new Follow({
            user: follower._id,
            followings: [{ user: leader._id }],
            followingCount: 1,
        });

        // Save the updated receiver and new sender documents
        const result = await Promise.all([receiver.save(), sender.save()]);
        return {
            success: true,
            message: 'Following!',
            status: 200,
            payload: result,
        };
    } else if (!receiver && sender) {
        // Only the sender exists
        // Create new document for receiver
        receiver = new Follow({
            user: leader._id,
            followers: [{ user: follower._id }],
            followerCount: 1,
        });

        // Update followings array of the sender
        sender.followings.push({ user: leader._id });
        sender.followingCount = sender.followings.length;

        // Save the new receiver and updated sender documents
        const result = await Promise.all([receiver.save(), sender.save()]);
        return {
            success: true,
            message: 'Following!',
            status: 200,
            payload: result,
        };
    }
}

export const approveFollowRequest = async (
    leader: any,
    follower: any
): Promise<ApiResponse<any>> => {
    try {
        const receiver: any = await Follow.findOne({ user: leader });
        const sender: any = await Follow.findOne({ user: follower });

        if (!receiver) {
            throw CustomError('User not found', 404);
        }
        if (!sender) {
            throw CustomError('Follower user not found', 404);
        }

        if (sender._id.toString() === leader.toString()) {
            return {
                success: false,
                message: 'You can not follow yourself',
                status: 400,
                payload: [],
            };
        }

        // put the sender ID in the receiver followers array
        receiver.followers.push({ user: sender.user._id });

        // remove the sender ID from the receiver waitings array
        receiver.waitings = receiver.waitings.filter(
            (waiting: any) => !waiting.user.equals(sender.user._id)
        );

        // put the receiver ID in the sender followings array
        sender.followings.push({ user: receiver.user._id });

        // remove the receiver ID from the sender pendings array
        sender.pendings = sender.pendings.filter(
            (pending: any) => !pending.user.equals(receiver.user._id)
        );

        const result = await Promise.all([receiver.save(), sender.save()]);
        return {
            success: true,
            message: 'Approved Follow request',
            status: 200,
            payload: result,
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

export const declineFollowRequest = async (
    leader: any,
    follower: any
): Promise<ApiResponse<any>> => {
    try {
        const receiver: any = await Follow.findOne({ user: leader });
        const sender: any = await Follow.findOne({ user: follower });

        if (!receiver) {
            throw CustomError('User not found', 404);
        }
        if (!sender) {
            throw CustomError('Follower user not found', 404);
        }

        if (sender._id.toString() === leader.toString()) {
            return {
                success: false,
                message: 'You can not approve yourself',
                status: 400,
                payload: [],
            };
        }

        // remove the sender ID from the receiver waitings array
        receiver.waitings = receiver.waitings.filter(
            (waiting: any) => !waiting.user.equals(sender.user._id)
        );

        // put the sender ID in the declines array
        receiver.declines.push({ user: sender.user._id });

        // remove the receiver ID from the sender pendings array
        sender.pendings = sender.pendings.filter(
            (pending: any) => !pending.user.equals(receiver.user._id)
        );

        const result = await Promise.all([receiver.save(), sender.save()]);
        return {
            success: true,
            message: 'Declined follow request',
            status: 200,
            payload: result,
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
