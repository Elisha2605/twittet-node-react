import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import styles from './NavigationItem.module.css';


interface NavigationProps {
    icon: IconDefinition,
    name: string,
    path: string,
}

const NavigationItem: FC<NavigationProps> = ({ name, icon, path}) => {
    return (
        <React.Fragment>
            <div className={styles.container}>
                <FontAwesomeIcon 
                    icon={icon}
                    color="####"
                />
                <h2>Home</h2>
            <NavLink 
                to={path}
            >
            </NavLink>
            </div>
        </React.Fragment>
    )
}

export default NavigationItem;