import TwitterCircle from 'src/model/twitterCircle.model';
import User from 'src/model/user.model';
import { ApiResponse, ErrorResponse } from 'src/types/apiResponse.types';
import { CustomError } from 'src/utils/helpers';

export const addUserToTwitterCircle = async (
    userId: string,
    addId: string
): Promise<ApiResponse<any>> => {
    try {
        const owner = await User.findById(userId);
        const member = await User.findById(addId);

        if (!owner) {
            throw CustomError('Owner not found', 404);
        }
        if (!member) {
            throw CustomError('Member not found', 404);
        }

        const existingOwner = await TwitterCircle.findOne({ user: userId });

        if (!existingOwner) {
            const memberToAdd = new TwitterCircle({
                user: owner._id,
                members: [member._id],
                count: 1,
            });
            const membersList = await memberToAdd.save();
            return {
                success: true,
                message: 'Added a new member in your Twitter Circle',
                status: 200,
                payload: membersList,
            };
        }

        if (
            existingOwner &&
            existingOwner.members.some(
                (memberId: string) =>
                    memberId.toString() === member._id.toString()
            )
        ) {
            existingOwner.members = existingOwner.members.filter(
                (memberId: string) =>
                    memberId.toString() !== member._id.toString()
            );
            existingOwner.count = existingOwner.members.length;
            const membersList = await existingOwner.save();
            return {
                success: true,
                message: 'Removed member from Twitter Circle',
                status: 200,
                payload: membersList,
            };
        }

        existingOwner.members.push(member._id);
        existingOwner.count = existingOwner.members.length;

        const membersList = await existingOwner.save();

        return {
            success: true,
            message: 'Added a new member in your Twitter Circle',
            status: 200,
            payload: membersList,
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
