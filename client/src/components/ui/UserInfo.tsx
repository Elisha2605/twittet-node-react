import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import PopUpMenu from "./PopUpMenu";
import styles from "./UserInfo.module.css";

interface UserInfoProps {
    avatar: string | undefined;
    firstname: string;
    username: string;
    children?: React.ReactNode;
    link?: string;
    className?: string;
    isOption?: boolean;
    options?: string[];
    onClickOption?: Function;
}

const UserInfo: FC<UserInfoProps> = ({ 
     avatar,
     firstname,
     username,
     children,
     link,
     className,
     isOption,
     options,
     onClickOption
}) => {

    return (
        <React.Fragment>
            <div className={`${styles.container}`}>
                {avatar && (
                    <div className={styles.avatar}><a href={link}><img src={avatar} alt="" /></a></div>
                )}
                <div className={`${styles.userWrapper} ${className}`}>
                    {isOption ? (

                        <div className={styles.userInfoOptionWrapper}>
                            <div className={styles.userInfo}>
                                <a href={link}><p className={styles.firstname}>{firstname} <FontAwesomeIcon icon={faCheckCircle} color={'var(--color-primary)'} /></p></a>
                                <p className={styles.username}>@{username} · {'Mar 26'} </p>
                            </div>
                            {/* <MenuIcon /> */}
                            <PopUpMenu options={options!} onClick={(option) => onClickOption!(option)} />
                        </div>

                    ) : (
                        <>
                            <div className={styles.userInfo}>
                                <a href={link}><p className={styles.firstname}>{firstname}</p></a>
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