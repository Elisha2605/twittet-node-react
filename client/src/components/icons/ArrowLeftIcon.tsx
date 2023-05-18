import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import styles from './ArrowLeftIcon.module.css';

interface ArrowLeftIconProps {
    className?: string;
}

const ArrowLeftIcon: FC<ArrowLeftIconProps> = ({ className }) => {
    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faArrowLeft} className={`${styles.faArrowLeft} ${className}`} />
        </React.Fragment>
    );
};

export default ArrowLeftIcon;
