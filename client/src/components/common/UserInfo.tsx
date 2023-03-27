import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styles from "./UserInfo.module.css";

interface UserInfoProps {
    avatar: string | undefined;
    firstName: string;
    username: string;
    children?: React.ReactNode;
    link?: string;
    isOption?: boolean;
}

const UserInfo: FC<UserInfoProps> = ({ 
     avatar,
     firstName,
     username,
     children,
     link,
     isOption
}) => {

    return (
        <React.Fragment>
            <div className={`${styles.container}`}>
                <div className={styles.avatar}><a href={link}><img src={avatar} alt="" /></a></div>
                <div className={`${styles.userWrapper}`}>
                    {isOption ? (

                        <div className={styles.userInfoOptionWrapper}>
                            <div className={styles.userInfo}>
                                <a href={link}><p>{firstName}</p></a>
                                <p className={styles.username}>@{username} · {'Mar 26'} </p>
                            </div>
                            <FontAwesomeIcon icon={faEllipsisH} />
                        </div>

                    ): (
                        <>
                            <div className={styles.userInfo}>
                                <a href={link}><p>{firstName}</p></a>
                                <p className={styles.username}>@{username}</p>
                            </div>
                            {children}
                        </>
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export default UserInfo;