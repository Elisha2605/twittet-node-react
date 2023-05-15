import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AtIcon.module.css';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faAt } from '@fortawesome/free-solid-svg-icons';

const AtIcon: FC<{
    className?: string;
    color?: string;
    size?: SizeProp;
    isMedium?: boolean;
    isSmall?: boolean;
    onClick?: () => void;
}> = ({ className, size, color, isSmall, isMedium, onClick }) => {
    return (
        <React.Fragment>
            <FontAwesomeIcon
                icon={faAt}
                className={`${styles.faAt} ${className} ${
                    isSmall ? styles.small : ''
                } ${isMedium ? styles.medium : ''}`}
                size={size}
                color={color ? color : '#fff'}
                onClick={onClick}
            />
        </React.Fragment>
    );
};

export default AtIcon;
