import Tweet from 'src/model/tweet.model';
import { ApiResponse, ErrorResponse } from 'src/types/apiResponse.types';
import { CustomError } from 'src/utils/helpers';

export const getAllTweets = async (): Promise<ApiResponse<any>> => {
    try {
        const tweets = await Tweet.find({})
            .populate({
                path: 'user',
                select: 'name username avatar coverImage isVerified isProtected',
                model: 'User',
            })
            .sort({ createdAt: -1 })
            .exec();
        if (tweets.length === 0) {
            return { success: false, message: 'No tweet found!', status: 200 };
        }
        return {
            success: true,
            message: 'Successfully fetched tweets',
            status: 200,
            payload: tweets,
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

export const createTweet = async (
    userId: string,
    text: string,
    image: string
): Promise<ApiResponse<any>> => {
    try {
        const newTweet = new Tweet({
            user: userId,
            text: text,
            image: image,
        });
        newTweet.save();
        if (!newTweet) {
            throw CustomError('Could not create tweet', 500);
        }

        return {
            success: true,
            message: 'Successfully created tweet',
            status: 200,
            payload: newTweet,
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

export const deleteTweet = async (
    tweetId: string
): Promise<ApiResponse<any>> => {
    try {
        const deletedTweet: any = await Tweet.findById(tweetId);
        if (!deletedTweet) {
            return {
                success: true,
                message: 'Tweet not found!',
                status: 204,
                payload: {},
            };
        }
        await deletedTweet.deleteOne();
        return {
            success: true,
            message: 'Successfully created tweet',
            status: 200,
            payload: deletedTweet,
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
