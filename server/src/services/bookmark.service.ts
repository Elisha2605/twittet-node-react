import { fetchUserSavedTweets } from 'src/aggregations/bookmark/fetchUserSavedTweets.aggregation';
import Bookmark from 'src/model/bookmark.model';
import Tweet from 'src/model/tweet.model';
import { ApiResponse, ErrorResponse } from 'src/types/apiResponse.types';
import { CustomError } from 'src/utils/helpers';

export const getUserSavedTweets = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const savedTweets = await fetchUserSavedTweets(userId);

        return {
            success: true,
            message: 'Saved tweets',
            status: 200,
            payload: savedTweets,
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

export const saveTweetToBookmark = async (
    userId: string,
    tweetId: string
): Promise<ApiResponse<any>> => {
    try {
        const tweet = await Tweet.findOne({
            _id: tweetId,
        });

        if (!tweet) {
            throw CustomError('Tweet not found', 404);
        }

        const aleardySavedTweet: any = await Bookmark.findOne({
            tweet: tweetId,
            user: userId,
        });

        if (aleardySavedTweet) {
            await aleardySavedTweet.deleteOne();
            return {
                success: true,
                message: 'Unsaved tweet!',
                status: 200,
                payload: {},
            };
        }

        const newSaveTweet = new Bookmark({
            tweet: tweet._id,
            user: userId,
        });
        const savedTweet = await newSaveTweet.save();

        if (!savedTweet) {
            throw CustomError('Could not save tweet to bookmark', 500);
        }

        return {
            success: true,
            message: 'Saved tweet',
            status: 200,
            payload: savedTweet,
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
