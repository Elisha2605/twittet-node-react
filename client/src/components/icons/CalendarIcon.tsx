import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styles from "./CalendarIcon.module.css";



const CalendarIcon: FC<{ className?: string }> = ({ className }) => {

    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faCalendar} className={`${styles.faCalendar} ${className}`} color={'var(--color-primary)'} />
        </React.Fragment>
    )
}

export default CalendarIcon;