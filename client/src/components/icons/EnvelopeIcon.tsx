import React, { FC } from "react";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./EnvelopeIcon.module.css";



const EnvelopeIcon: FC<{ className?: string }> = ({ className }) => {

    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faEnvelope} className={`${styles.faEnvelope} ${className}`} size={'lg'} />
        </React.Fragment>
    )
}

export default EnvelopeIcon;