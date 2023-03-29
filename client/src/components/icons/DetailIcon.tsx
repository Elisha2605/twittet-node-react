import React, { FC } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./DetailIcon.module.css";



const DetailIcon: FC<{ className?: string }> = ({ className }) => {

    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faCircleExclamation} className={`${styles.faCircleExclamation} ${className}`} />
        </React.Fragment>
    )
}

export default DetailIcon;