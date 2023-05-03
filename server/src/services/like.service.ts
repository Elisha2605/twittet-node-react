import Like from 'src/model/like.model';
import Tweet from 'src/model/tweet.model';
import User from 'src/model/user.model';
import { ApiResponse, ErrorResponse } from 'src/types/apiResponse.types';
import { CustomError } from 'src/utils/helpers';

export const likeTweet = async (
    tweetId: string,
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        // The the tweet and the user
        const tweet = await Tweet.findById(tweetId);
        const user = await User.findById(userId);

        // check if the tweet and user exists
        if (!tweet) {
            throw CustomError('Tweet not found', 404);
        }
        if (!user) {
            throw CustomError('User not found', 404);
        }

        const tweetToLike = await Like.findOne({ tweet: tweetId });

        // check if the tweet doesn't exist in the Like collection => create a new Doc
        if (!tweetToLike) {
            const LikedTweet = new Like({
                tweet: tweetId,
                likes: [user._id],
            });
            const result = await LikedTweet.save();
            return {
                success: true,
                message: 'Successfuly created a new Like Document, and 1 like!',
                status: 200,
                payload: result,
            };
        }

        // check if the tweet exists and the user id is in the likes array
        if (
            tweetToLike &&
            tweetToLike.likes.some(
                (like: any) => like.toString() === user._id.toString()
            )
        ) {
            tweetToLike.likes = tweetToLike.likes.filter(
                (like: any) => like.toString() !== user._id.toString()
            );
            const result = await tweetToLike.save();
            return {
                success: true,
                message: 'Unliked tweet',
                status: 200,
                payload: result,
            };
        }

        // if tweet in Like collection => just update the likes array.
        tweetToLike.likes.push(user._id);
        const result = await tweetToLike.save();

        return {
            success: true,
            message: 'Liked tweet',
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
