import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowRightFromBracket, faEarthAfrica } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

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
   'Everyone': <FontAwesomeIcon icon={faEarthAfrica} />, 
   'Twitter Circle': <FontAwesomeIcon icon={faHeart} />,
};