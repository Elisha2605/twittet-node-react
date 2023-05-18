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
    onClick?: () => void;
}

const NavigationItem: FC<NavigationProps> = ({ label, icon, path, className, onClick}) => {
    return (
        <React.Fragment>
            <NavLink to={path} className={`${styles.container} ${className}`} >
                <FontAwesomeIcon 
                    icon={icon}
                    color={''}
                    size={'2xl'}
                    style={{ flex: "none", width: "23px" }}
                    onClick={onClick}
                />
                <h2 className={styles.label}>{label}</h2>
            </NavLink>
        </React.Fragment>
    )
}

export default NavigationItem;