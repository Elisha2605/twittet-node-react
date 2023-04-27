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

        let follow: any = await Follow.findOne({ user: receiverId });

        if (!follow) {
            follow = new Follow({ user: receiverId });
        }
        follow.followers.push({ user: followerUser._id });

        const response = await follow.save();

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
