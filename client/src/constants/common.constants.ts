export const IMAGE_AVATAR_BASE_URL = `http://localhost:4000/avatar`
export const IMAGE_COVER_BASE_URL = `http://localhost:4000/cover`
export const IMAGE_TWEET_BASE_URL = `http://localhost:4000/tweetImage`


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
