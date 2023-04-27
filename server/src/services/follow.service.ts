import Follow, { IFollow } from 'src/model/follow.model';
import User, { IUser } from 'src/model/user.model';
import { ApiResponse, ErrorResponse } from 'src/types/apiResponse.types';
import { CustomError } from 'src/utils/helpers';

export const getUserFollowers = async (userId: string): Promise<any> => {
    try {
        const result = await Follow.find({ user: userId })
            .populate({
                path: 'user',
                select: 'name',
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
    incommingReq: string,
    receiver: string
): Promise<ApiResponse<any>> => {
    try {
        const user: IUser = await User.findById(receiver);

        if (!user) {
            throw CustomError('User not found', 404);
        }

        let follow: any = await Follow.findOne({ user: receiver });

        // Handle peding requests

        if (!follow) {
            follow = new Follow({ user: receiver });
        }
        follow.followers.push(incommingReq);

        const response = await follow.save();

        return {
            success: true,
            message: 'Successfully sent follow request!',
            status: 200,
            payload: response,
        };

        // const follow: any = new Follow({
        //     user: receiver,
        // });
        // follow.followers.push(incommingReq);
        // const response = await follow.save();
        // if (!response) {
        //     throw CustomError('Could not send request', 500);
        // }
        // return {
        //     success: true,
        //     message: 'Successfully sent follow request!',
        //     status: 200,
        //     payload: follow,
        // };
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

// if (user.isProtected) {
//     if (!follow) {
//         follow = new Follow({ user: receiver });
//     }
//     follow.pendings.push(incommingReq);
// }
// // Handle follow requests
// else {
// }
