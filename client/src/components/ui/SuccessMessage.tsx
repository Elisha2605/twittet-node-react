import React from 'react';
import styles from './SuccessMessage.module.css'

interface successMessageProps {
    message: string; 
    type: 'success' | 'error'
}

const SuccessMessage: React.FC<successMessageProps> = ({ message, type }) => {
  return <div className={`${styles.message} ${type === 'success' ? styles.success : styles.error}`}>{message}</div>;
};

export default SuccessMessage;
