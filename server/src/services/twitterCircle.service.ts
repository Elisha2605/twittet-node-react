import TwitterCircle, {
    ITwitterCircle,
} from '../../src/models/twitterCircle.model';
import User from '../../src/models/user.model';
import { ApiResponse, ErrorResponse } from '../../src/types/apiResponse.types';
import { CustomError } from '../../src/utils/helpers';

export const getUserTwitterCircleMembers = async (
    userId: string
): Promise<ApiResponse<ITwitterCircle>> => {
    try {
        const userTwitterCircleMembers = await TwitterCircle.findOne({
            user: userId,
        })
            .populate({
                path: 'user',
                select: 'name username avatar isVerified isProtected',
            })
            .populate({
                path: 'members',
                select: 'name username avatar isVerified isProtected',
            })
            .exec();

        if (!userTwitterCircleMembers) {
            return {
                success: true,
                message: 'No members yet',
                status: 404,
            };
        }

        console.log(userTwitterCircleMembers);

        return {
            success: true,
            message: 'Twitter Circle members',
            status: 200,
            payload: userTwitterCircleMembers,
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

export const addUserToTwitterCircle = async (
    userId: string,
    addId: string
): Promise<ApiResponse<ITwitterCircle>> => {
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
            owner.twitterCircleCount = 1;
            await owner.save();
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
            owner.twitterCircleCount = existingOwner.members.length;
            await owner.save();
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
        owner.twitterCircleCount = existingOwner.members.length;
        await owner.save();

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
