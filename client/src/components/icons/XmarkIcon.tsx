import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./XmarkIcon.module.css";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";



const XmarkIcon: FC<{ className?: string, color?: string, size?: SizeProp }> = ({ className, size, color }) => {

    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faXmark} className={`${styles.faXmark} ${className}`} size={size} color={color ? color : '#000'} />
        </React.Fragment>
    )
}

export default XmarkIcon;