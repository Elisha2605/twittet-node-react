import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import EarthIcon from '../components/icons/EarthIcon';
import HeartIcon from '../components/icons/HeartIcon';
import { TWEET_AUDIENCE, TWEET_MENU, TWEET_REPLY } from '../constants/common.constants';
import UserIcon from '../components/icons/UserIcon';
import AtIcon from '../components/icons/AtIcon';

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
