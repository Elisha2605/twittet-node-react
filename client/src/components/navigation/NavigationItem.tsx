import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import styles from './NavigationItem.module.css';


interface NavigationProps {
    icon: IconDefinition;
    label: string;
    path: string;
    className?: string;
}

const NavigationItem: FC<NavigationProps> = ({ label, icon, path, className}) => {
    return (
        <React.Fragment>
            <div className={`${styles.container} ${className}`}>
                <FontAwesomeIcon 
                    icon={icon}
                    color={''}
                    size={'2xl'}
                    // border={true}
                    style={{ flex: "none", width: "23px" }}
                />
                <h2 className={styles.label}>{label}</h2>
                <NavLink 
                    to={path}
                >
                </NavLink>
            </div>
        </React.Fragment>
    )
}

export default NavigationItem;