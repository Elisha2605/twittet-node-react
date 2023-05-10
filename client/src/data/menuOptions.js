import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowRightFromBracket, faAt, faGear, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import EarthIcon from '../components/icons/EarthIcon';
import HeartIcon from '../components/icons/HeartIcon';
import { MORE_NAV_OPTION, TWEET_AUDIENCE, TWEET_MENU, TWEET_REPLY } from '../constants/common.constants';
import UserIcon from '../components/icons/UserIcon';
import AtIcon from '../components/icons/AtIcon';
import BookmarkIcon from '../components/icons/BookmarkIcon';

// eslint-disable-next-line no-undef
export const tweetMenuOptions = [TWEET_MENU.delete, TWEET_MENU.edit];
export const tweetMenuIcons = {
   'Delete': <FontAwesomeIcon icon={faTrash} />,
   'Edit': <FontAwesomeIcon icon={faEdit} />
};

export const navUserMenuOptions = ['Logout']
export const navUseMenuIcons = { 
   'Logout': <FontAwesomeIcon icon={faArrowRightFromBracket} /> 
};

export const tweetAudienceMenuOptions = [
   TWEET_AUDIENCE.everyone, 
   TWEET_AUDIENCE.twitterCircle]
export const tweetAudienceMenuIcons = {
   'Everyone': <EarthIcon />, 
   'Twitter Circle': <HeartIcon />,
};

export const tweetReplyOptions = [
   TWEET_REPLY.everyone,
   TWEET_REPLY.peopleYouFollow,
   TWEET_REPLY.onlyPeopleYouMention
]
export const tweetReplyIcons = {
   'Everyone': <EarthIcon />,
   'People you follow': <UserIcon />,
   'Only people you mention': <AtIcon />,
}

export const shareOptions = [
   'Bookmark'
]
export const shareIcon = {
   'Bookmark': <BookmarkIcon />
}

export const moreOptions = [
   MORE_NAV_OPTION.connect,
   MORE_NAV_OPTION.followRequests,
   MORE_NAV_OPTION.settingsAndPrivacy,
   MORE_NAV_OPTION.display
]

export const moreIcons = {
   'Connect': <FontAwesomeIcon icon={faAt} />,
   'Follow requests': <FontAwesomeIcon icon={faUserPlus} />,
   'Settings and privacy': <FontAwesomeIcon icon={faGear} />,
   'Display': <FontAwesomeIcon icon={faEdit} />
}