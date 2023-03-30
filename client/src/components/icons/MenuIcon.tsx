import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styles from "./MenuIcon.module.css";



const MenuIcon: FC<{ className?: string, onClick?: Function }> = ({ className, onClick }) => {

    return (
        <React.Fragment>
            <div onClick={(e) =>onClick}>
                <FontAwesomeIcon icon={faEllipsisH} className={`${styles.faEllipsisH} ${className}`} />
            </div>
        </React.Fragment>
    )
}

export default MenuIcon;