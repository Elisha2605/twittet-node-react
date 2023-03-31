import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

export const options= ["Delete", "Edit"];

export const icons = {
   "Delete": <FontAwesomeIcon icon={faTrash} />,
   "Edit": <FontAwesomeIcon icon={faEdit} />
};
