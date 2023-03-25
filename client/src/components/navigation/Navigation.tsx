import React from "react";
import { faHashtag, faHome} from "@fortawesome/free-solid-svg-icons";
import { faBell, faBookmark, faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from './Navigation.module.css';
import NavigationItem from "./NavigationItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
    
    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <FontAwesomeIcon 
                        icon={faTwitter}
                        color={'#1DA1F2'}
                        size={'2xl'}
                    />
                </div>
                <div className={styles.naviItems}>
                    <NavigationItem
                        icon={faHome} 
                        label={"Home"} 
                        path='/' 
                    />
                    <NavigationItem
                        icon={faHashtag} 
                        label={"Explore"} 
                        path='/' 
                    />
                    <NavigationItem
                        icon={faBell} 
                        label={"Notifications"} 
                        path='/' 
                    />
                    <NavigationItem
                        icon={faEnvelope} 
                        label={"Message"} 
                        path='/' 
                    />
                    <NavigationItem
                        icon={faBookmark} 
                        label={"Bookmarks"} 
                        path='/' 
                    />
                    <NavigationItem
                        icon={faUser} 
                        label={"Profile"} 
                        path='/' 
                    />
                    <NavigationItem
                        icon={faEllipsisH} 
                        label={"More"} 
                        path='/' 
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

export default Navigation;