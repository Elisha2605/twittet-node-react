import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import styles from './ArrowLeft.module.css';

interface ArrowLeftProps {
    className?: string;
}

const ArrowLeft: FC<ArrowLeftProps> = ({ className }) => {
    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faArrowLeft} className={`${styles.faArrowLeft} ${className}`} />
        </React.Fragment>
    );
};

export default ArrowLeft;
