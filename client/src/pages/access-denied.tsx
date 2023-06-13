import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './access-denied.module.css';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

const AccessDenied = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <FontAwesomeIcon
                    icon={faTwitter}
                    color={'var(--color-primary)'}
                    size={'2xl'}
                />
                <p>Access denined!</p>
            </div>
        </div>
    );
};

export default AccessDenied;
