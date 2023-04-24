import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import EarthIcon from '../components/icons/EarthIcon';
import HeartIcon from '../components/icons/HeartIcon';

export const tweetMenuOptions = ['Delete', 'Edit'];
export const tweetMenuIcons = {
   'Delete': <FontAwesomeIcon icon={faTrash} />,
   'Edit': <FontAwesomeIcon icon={faEdit} />
};

export const navUserMenuOptions = ['Logout']
export const navUseMenuIcons = { 
   'Logout': <FontAwesomeIcon icon={faArrowRightFromBracket} /> 
};

export const tweetPrivacyMenuOptions = ['Everyone', 'Twitter Circle']
export const tweetPrivacyMenuIcons = {
   'Everyone': <EarthIcon />, 
   'Twitter Circle': <HeartIcon />,
};