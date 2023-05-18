import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './UserIcon.module.css';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';

const UserIcon: FC<{
    className?: string;
    color?: string;
    size?: SizeProp;
    isSmall?: boolean;
    isMedium?: boolean;
    onClick?: () => void;
}> = ({ className, size, color, isSmall, isMedium, onClick }) => {
    return (
        <React.Fragment>
            <FontAwesomeIcon
                icon={faUserCheck}
                className={`${styles.faUserCheck} ${className} ${
                    isSmall ? styles.small : ''
                } ${isMedium ? styles.medium : ''}`}
                size={size}
                color={color ? color : '#fff'}
                onClick={onClick}
            />
        </React.Fragment>
    );
};

export default UserIcon;
