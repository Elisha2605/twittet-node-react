import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AtIcon.module.css';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faAt } from '@fortawesome/free-solid-svg-icons';

const AtIcon: FC<{
    className?: string;
    color?: string;
    size?: SizeProp;
    small?: boolean;
    onClick?: () => void;
}> = ({ className, size, color, small, onClick }) => {
    return (
        <React.Fragment>
            <FontAwesomeIcon
                icon={faAt}
                className={`${styles.faAt} ${className} ${small ? styles.small : ''}`}
                size={size}
                color={color ? color : '#fff'}
                onClick={onClick}
            />
        </React.Fragment>
    );
};

export default AtIcon;
