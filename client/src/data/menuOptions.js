import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export const tweetMenuOptions = ['Delete', 'Edit'];
export const tweetMenuIcons = {
   'Delete': <FontAwesomeIcon icon={faTrash} />,
   'Edit': <FontAwesomeIcon icon={faEdit} />
};

export const navUserMenuOptions = ['Logout']
export const navUseMenuIcons = { 
   'Logout': <FontAwesomeIcon icon={faArrowRightFromBracket} /> 
}