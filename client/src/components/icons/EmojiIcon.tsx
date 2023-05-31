import { faFaceSmileWink } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styles from "./EmojiIcon.module.css";



const EmojiIcon: FC<{ className?: string, onClick?: any }> = ({ className, onClick }) => {

    return (
        <React.Fragment>
            <div onClick={onClick}>
                <FontAwesomeIcon icon={faFaceSmileWink} className={`${styles.faFaceSmileWink} ${className}`} color={'var(--color-primary)'} />
            </div>
        </React.Fragment>
    )
}

export default EmojiIcon;