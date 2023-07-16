import React, { FC } from "react";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./EnvelopeIcon.module.css";
import { faMessage } from "@fortawesome/free-regular-svg-icons";



const MessageIcon: FC<{ className?: string }> = ({ className }) => {

    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faMessage} className={`${styles.faMessage} ${className}`} />
        </React.Fragment>
    )
}

export default MessageIcon;