import { fetchUserSavedTweets } from '../../src/aggregations/bookmark/fetchUserSavedTweets.aggregation';
import Bookmark from '../../src/models/bookmark.model';
import Tweet from '../../src/models/tweet.model';
import { ApiResponse, ErrorResponse } from '../../src/types/apiResponse.types';
import { CustomError } from '../../src/utils/helpers';

export const getUserSavedTweets = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const savedTweets = await fetchUserSavedTweets(userId);

        if (!savedTweets) {
            return {
                success: false,
                message: 'Saved tweets not found',
                status: 404,
                payload: {},
            };
        }

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

        const alreadySavedTweet: any = await Bookmark.findOneAndDelete({
            tweet: tweetId,
            user: userId,
        });

        if (alreadySavedTweet) {
            await tweet.updateOne({ $inc: { bookmarkCount: -1 } });

            return {
                success: true,
                message: 'Removed',
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

        await tweet.updateOne({ $inc: { bookmarkCount: 1 } });

        return {
            success: true,
            message: 'Added',
            status: 200,
            payload: tweet,
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
