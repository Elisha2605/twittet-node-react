import React, { FC, useContext, useEffect, useState } from 'react';
import PopUpMenu from './PopUpMenu';
import styles from './UserInfo.module.css';
import Certified from '../../assets/certified.svg';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/user.context';

interface UserInfoProps {
    itemId: any;
    userId?: string;
    avatar: string | undefined;
    name: string;
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
    itemId,
    userId,
    avatar,
    name,
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

    const [authUser, setAuthUser] = useState<any>(null);

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        }
        getAuthUser();
    }, []);

    let profileLink: string;
    if (userId === authUser?._id) {
        profileLink = `/profile`;
    } else {
        profileLink = `/user-profile/${userId}`;
    }

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
                                <NavLink to={profileLink}>
                                    <p className={styles.firstname}>
                                        {name}{' '}
                                        {isVerified && (
                                            <img className={styles.certifiedIcon} src={Certified} alt="" />
                                        )}{' '}
                                    </p>
                                </NavLink>
                                <p className={styles.username}>
                                <NavLink to={'/user-profile'}>@{username}</NavLink> {time && ` · ${time}`}
                                </p>
                            </div>
                            <PopUpMenu
                                itemId={itemId}
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
                                <NavLink to={'/user-profile'}>
                                    <p className={styles.firstname}>
                                    {name}
                                    </p>
                                </NavLink>
                                @{username}
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
