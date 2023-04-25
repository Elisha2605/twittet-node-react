import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './UserIcon.module.css';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';

const UserIcon: FC<{
    className?: string;
    color?: string;
    size?: SizeProp;
    onClick?: () => void;
}> = ({ className, size, color, onClick }) => {
    return (
        <React.Fragment>
            <FontAwesomeIcon
                icon={faUserCheck}
                className={`${styles.faUserCheck} ${className}`}
                size={size}
                color={color ? color : '#fff'}
                onClick={onClick}
            />
        </React.Fragment>
    );
};

export default UserIcon;
