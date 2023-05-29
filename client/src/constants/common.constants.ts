// export const IMAGE_AVATAR_BASE_URL = `http://localhost:4000/avatar`
// export const IMAGE_COVER_BASE_URL = `http://localhost:4000/cover`
// export const IMAGE_TWEET_BASE_URL = `http://localhost:4000/tweetImage`
// export const IMAGE_TWEET_REPLY_BASE_URL = `http://localhost:4000/replyImage`
export const IMAGE_AVATAR_BASE_URL = `https://fake-twitter-uploads.s3.amazonaws.com/avatar`
export const IMAGE_COVER_BASE_URL = `https://fake-twitter-uploads.s3.amazonaws.com/cover`
export const IMAGE_TWEET_BASE_URL = `https://fake-twitter-uploads.s3.amazonaws.com/tweetImage`
export const IMAGE_TWEET_REPLY_BASE_URL = `https://fake-twitter-uploads.s3.amazonaws.com/replyImage`

export const IMAGE_AVATAR_DEFAULT = `https://fake-twitter-uploads.s3.amazonaws.com/avatar/default-avatar.jpg`
export const IMAGE_COVER_DEFAULT = `https://fake-twitter-uploads.s3.amazonaws.com/avatar/default-cover.jpg`

export enum TWEET_TYPE {
    regular = 'Regular',
    reTweet = 'Retweet',
}

export enum TWEET_MENU {
    delete = 'Delete',
    edit = 'Edit',
    retweet = 'Retweet',
    quoteTweet = 'Quote Tweet',
}

export enum TWEET_AUDIENCE {
    everyone = 'Everyone',
    twitterCircle = 'Twitter Circle',
}

export enum TWEET_REPLY {
    everyone = 'Everyone',
    peopleYouFollow = 'People you follow',
    onlyPeopleYouMention = 'Only people you mention',
    onlyTwitterCircle = 'Only twitter circle',
}

export enum MORE_NAV_OPTION {
    followRequests = 'Follow requests',
    settingsAndPrivacy = 'Settings and privacy',
    display = 'Display',
}

export enum NOTIFICATION_TYPE {
    mention = 'Mention',
    like = 'Like',
}

export enum NOTIFICATION_MESSAGE {
    mention = 'has mentioned you',
    like = 'liked your tweet',
}