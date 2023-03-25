import React from "react";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import styles from './Navigation.module.css';
import NavigationItem from "./NavigationItem";

const Navigation = () => {
    
    return (
        <React.Fragment>
            <div className={styles.container}>
                <NavigationItem
                    icon={faHome} 
                    name={"Home"} 
                    path='/' 
                />
            </div>
        </React.Fragment>
    )
}

export default Navigation;