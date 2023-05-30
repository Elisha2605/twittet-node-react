import React, { FC } from "react";
import styles from './ContentNotAvailable.module.css';


const ContentNotAvailable: FC<{ title: string, message: string, classNameContainer?: string }> = ({ title, message, classNameContainer }) => {

    return (
        <React.Fragment>
            <div className={`${styles.container} ${classNameContainer}`}>
                <div className={styles.title}>{title}</div>
                <div className={styles.message}>{message}</div>
            </div>
        </React.Fragment>
    )
}

export default ContentNotAvailable;

