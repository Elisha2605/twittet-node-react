import React, { FC } from "react";
import styles from './ContentNotAvailable.module.css';


const ContentNotAvailable: FC<{ title: string, message: string, }> = ({ title, message }) => {

    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.title}>{title}</div>
                <div className={styles.message}>{message}</div>
            </div>
        </React.Fragment>
    )
}

export default ContentNotAvailable;

