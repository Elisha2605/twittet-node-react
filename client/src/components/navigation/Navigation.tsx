import React from "react";
import { faBook, faHashtag, faHome} from "@fortawesome/free-solid-svg-icons";
import { faBell, faBookmark, faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from './Navigation.module.css';
import NavigationItem from "./NavigationItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Button, { ButtonSize, ButtonType } from "../common/Button";
import NavigationUser from "./NavigationUser";

const Navigation = () => {

    const onTweet = () => {

    }
    
    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <FontAwesomeIcon 
                        icon={faTwitter}
                        color={'var(--color-primary)'}
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
                <Button value={'Tweet'} type={ButtonType.primary} size={ButtonSize.medium} onClick={onTweet} />
                <NavigationUser 
                    avatar={"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"} 
                    firstName={"Alvin"} 
                    username={"@alvin40900"} 
                />
            </div>
        </React.Fragment>
    )
}

export default Navigation;