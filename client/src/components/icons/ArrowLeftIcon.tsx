import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import styles from './ArrowLeftIcon.module.css';

interface ArrowLeftIconProps {
    className?: string;
    onClick?: () => void;
}

const ArrowLeftIcon: FC<ArrowLeftIconProps> = ({ className, onClick }) => {
    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faArrowLeft} className={`${styles.faArrowLeft} ${className}`} onClick={onClick} />
        </React.Fragment>
    );
};

export default ArrowLeftIcon;
