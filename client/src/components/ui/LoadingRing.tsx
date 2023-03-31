import React from 'react';
import styles from './LoadingRing.module.css';

const LoadingRing: React.FC<{ size: string }> = ({ size }) => {
    return (
        <div className={`${styles.ring} ${styles[size]}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default LoadingRing;
