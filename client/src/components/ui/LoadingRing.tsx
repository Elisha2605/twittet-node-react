import React from 'react';
import styles from './LoadingRing.module.css';

const LoadingRing: React.FC<{ size: string, className?: string }> = ({ size, className }) => {
    return (
        <div className={`${styles.ring} ${styles[size]} ${className}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default LoadingRing;
