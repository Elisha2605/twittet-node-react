import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './EarthIcon.module.css';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faEarthAfrica } from '@fortawesome/free-solid-svg-icons';

const EarthIcon: FC<{
    className?: string;
    color?: string;
    size?: SizeProp;
    onClick?: () => void;
}> = ({ className, size, color, onClick }) => {
    return (
        <React.Fragment>
            <FontAwesomeIcon
                icon={faEarthAfrica}
                className={`${styles.faEarthAfrica} ${className}`}
                size={size}
                color={color ? color : '#fff'}
                onClick={onClick}
            />
        </React.Fragment>
    );
};

export default EarthIcon;
