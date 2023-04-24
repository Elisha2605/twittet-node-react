import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import EarthIcon from '../components/icons/EarthIcon';
import HeartIcon from '../components/icons/HeartIcon';
import { TWEET_AUDIENCE, TWEET_MENU } from '../constants/common.constants';

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

export const tweetPrivacyMenuOptions = [TWEET_AUDIENCE.everyone, TWEET_AUDIENCE.twitterCircle]
export const tweetPrivacyMenuIcons = {
   'Everyone': <EarthIcon />, 
   'Twitter Circle': <HeartIcon />,
};