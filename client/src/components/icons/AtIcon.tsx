import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AtIcon.module.css';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faAt } from '@fortawesome/free-solid-svg-icons';

const AtIcon: FC<{
    className?: string;
    color?: string;
    size?: SizeProp;
    onClick?: () => void;
}> = ({ className, size, color, onClick }) => {
    return (
        <React.Fragment>
            <FontAwesomeIcon
                icon={faAt}
                className={`${styles.faAt} ${className}`}
                size={size}
                color={color ? color : '#fff'}
                onClick={onClick}
            />
        </React.Fragment>
    );
};

export default AtIcon;
