import { TWEET_AUDIENCE, TWEET_REPLY } from '../constants/common.constants';

export type TweetAudienceType =
    | TWEET_AUDIENCE.everyone
    | TWEET_AUDIENCE.twitterCircle;

export type TweetReplyType =
    | TWEET_REPLY.everyone
    | TWEET_REPLY.peopleYouFollow
    | TWEET_REPLY.onlyPeopleYouMention
    | TWEET_REPLY.onlyTwitterCircle;
