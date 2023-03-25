import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import styles from './NavigationItem.module.css';


interface NavigationProps {
    icon: IconDefinition,
    label: string,
    path: string,
}

const NavigationItem: FC<NavigationProps> = ({ label, icon, path}) => {
    return (
        <React.Fragment>
            <div className={styles.container}>
                <FontAwesomeIcon 
                    icon={icon}
                    color={''}
                    fill={'none'}
                    size={'2xl'}
                    // border={true}
                    style={{ width: "30px" }}
                />
                <h2>{label}</h2>
                <NavLink 
                    to={path}
                >
                </NavLink>
            </div>
        </React.Fragment>
    )
}

export default NavigationItem;