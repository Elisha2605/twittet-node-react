import React, { FC } from 'react';
import PopUpMenu from './PopUpMenu';
import styles from './UserInfo.module.css';
import Certified from '../../assets/certified.svg';

interface UserInfoProps {
    id: any;
    avatar: string | undefined;
    firstname: string;
    username: string;
    isVerified?: boolean;
    children?: React.ReactNode;
    link?: string;
    className?: string;
    isOption?: boolean;
    options?: string[];
    icons?: Record<string, React.ReactNode>;
    time?: string;
    onClickOption?: Function;
}

const UserInfo: FC<UserInfoProps> = ({
    id,
    avatar,
    firstname,
    username,
    isVerified = false,
    children,
    link,
    className,
    isOption,
    options,
    icons,
    time,
    onClickOption,
}) => {

    return (
        <React.Fragment>
            <div className={`${styles.container}`}>
                {avatar && (
                    <div className={styles.avatar}>
                        <a href={link}>
                            <img src={avatar} alt="" />
                        </a>
                    </div>
                )}
                <div className={`${styles.userWrapper} ${className}`}>
                    {isOption ? (
                        <div className={styles.userInfoOptionWrapper}>
                            <div className={styles.userInfo}>
                                <a href={link}>
                                    <p className={styles.firstname}>
                                        {firstname}{' '}
                                        {isVerified && (
                                            <img className={styles.certifiedIcon} src={Certified} alt="" />
                                        )}{' '}
                                    </p>
                                </a>
                                <p className={styles.username}>
                                    @{username} {time && ` · ${time}`}
                                </p>
                            </div>
                            <PopUpMenu
                                id={id}
                                options={options!}
                                icons={icons}
                                onClick={(option, id) =>
                                    onClickOption!(option, id)
                                }
                            />
                        </div>
                    ) : (
                        <>
                            <div className={styles.userInfo}>
                                <a href={link}>
                                    <p className={styles.firstname}>
                                        {firstname}
                                    </p>
                                </a>
                                <p className={styles.username}>@{username}</p>
                            </div>
                            {children}
                        </>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default UserInfo;
