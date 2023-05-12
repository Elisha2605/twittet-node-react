export const IMAGE_AVATAR_BASE_URL = `http://localhost:4000/avatar`
export const IMAGE_COVER_BASE_URL = `http://localhost:4000/cover`
export const IMAGE_TWEET_BASE_URL = `http://localhost:4000/tweetImage`
export const IMAGE_TWEET_REPLY_BASE_URL = `http://localhost:4000/replyImage`


export enum TWEET_MENU {
    delete = 'Delete',
    edit = 'Edit',
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
    connect = 'Connect',
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