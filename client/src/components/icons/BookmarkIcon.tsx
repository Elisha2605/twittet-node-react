import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './BookmarkIcon.module.css';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

const BookmarkIcon: FC<{
    className?: string;
    color?: string;
    size?: SizeProp;
    small?: boolean;
    onClick?: () => void;
}> = ({ className, size, color, small, onClick }) => {
    return (
        <React.Fragment>
            <FontAwesomeIcon
                icon={faBookmark}
                className={`${styles.faBookmark} ${className}`}
                size={size}
                color={color ? color : 'var(--color-black)'}
                onClick={onClick}
            />
        </React.Fragment>
    );
};

export default BookmarkIcon;
