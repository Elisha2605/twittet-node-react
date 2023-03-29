import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styles from "./MenuIcon.module.css";



const MenuIcon: FC<{ className?: string }> = ({ className }) => {

    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faEllipsisH} className={`${styles.faEllipsisH} ${className}`} />
        </React.Fragment>
    )
}

export default MenuIcon;