import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styles from "./NavigationUser.module.css";

interface NavigationUserProps {
    avatar: string | undefined;
    firstName: string;
    username: string;
}

const NavigationUser: FC<NavigationUserProps> = ({ 
     avatar,
     firstName,
     username
}) => {

    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.avatar}><img src={avatar} alt="" /></div>
                <div className={styles.userWrapper}>
                    <div className={styles.userInfo}>
                        <p>{firstName}</p>
                        <p className={styles.username}>{username}</p>
                    </div>
                    <FontAwesomeIcon 
                        icon={faEllipsis}
                    />
                </div>
                </div>
        </React.Fragment>
    )
}

export default NavigationUser;