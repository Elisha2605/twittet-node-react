import { faDigging, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styles from './PageUnderConstruction.module.css';


const PageUnderConstruction: FC<{ message?: string }> = ({ message }) => {

    return (
        <React.Fragment>
            <div className={styles.container}>
                <FontAwesomeIcon icon={faDigging} size={'2xl'} />
                <div className={styles.title}>Page under construction</div>
                <div className={styles.message}>{message}</div>
            </div>
        </React.Fragment>
    )
}

export default PageUnderConstruction;

