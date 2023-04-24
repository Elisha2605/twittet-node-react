import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './HeartIcon.module.css';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const HeartIcon: FC<{
    className?: string;
    color?: string;
    size?: SizeProp;
    onClick?: () => void;
}> = ({ className, size, color, onClick }) => {
    return (
        <React.Fragment>
            <FontAwesomeIcon
                icon={faHeart}
                className={`${styles.faHeart} ${className}`}
                size={size}
                color={color ? color : '#fff'}
                onClick={onClick}
            />
        </React.Fragment>
    );
};

export default HeartIcon;
