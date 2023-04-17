import React, { FC } from "react";
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./EnvelopeIcon.module.css";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";



const TwitterIcon: FC<{ className?: string, color?: string, size?: SizeProp }> = ({ className, size, color }) => {

    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faTwitter} className={`${styles.faTwitter} ${className}`} size={size} color={color} />
        </React.Fragment>
    )
}

export default TwitterIcon;