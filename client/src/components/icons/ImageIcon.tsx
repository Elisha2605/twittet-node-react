import { faImage } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import styles from './ImageIcon.module.css';

const ImageIcon: FC<{
    className?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ className, onChange }) => {
    return (
        <React.Fragment>
            <label htmlFor="imageInput">
                <FontAwesomeIcon
                    icon={faImage}
                    className={`${styles.faImage} ${className}`}
                    color={'var(--color-primary)'}
                />
            </label>
            <input
                type="file"
                id="imageInput"
                className={styles.hiddenInput}
                name="tweetImage"
                onChange={onChange}
            />
        </React.Fragment>
    );
};

export default ImageIcon;
