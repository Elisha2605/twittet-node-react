import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styles from "./GearIcon.module.css";



const GearIcon: FC<{ className?: string }> = ({ className }) => {

    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faGear} className={`${styles.faGear} ${className}`} size={'lg'} />
        </React.Fragment>
    )
}

export default GearIcon;