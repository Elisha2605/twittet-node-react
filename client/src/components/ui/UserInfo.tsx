import React, { FC, useContext, useEffect, useState } from 'react';
import PopUpMenu from './PopUpMenu';
import styles from './UserInfo.module.css';
import Certified from '../../assets/certified.svg';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/user.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

interface UserInfoProps {
    tweet?: any;
    userId?: string;
    avatar: string | undefined;
    name: string;
    username: string;
    isVerified?: boolean;
    isProtected?: boolean;
    children?: React.ReactNode;
    link?: string;
    className?: string;
    isOption?: boolean;
    options?: string[];
    icons?: Record<string, React.ReactNode>;
    time?: string;
    onClickOption?: Function;
    isReply?: boolean;
    isOnHover?: boolean;
    isNavigate?: boolean;
}

const UserInfo: FC<UserInfoProps> = ({
    tweet,
    userId,
    avatar,
    name,
    username,
    isVerified = false,
    isProtected = false,
    children,
    link,
    className,
    isOption,
    options,
    icons,
    time,
    onClickOption,
    isReply = false,
    isOnHover = false,
    isNavigate = false,
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

    const navigate = useNavigate();

    const onNavigateToProfile = () => {
        if (isNavigate) {
            navigate(`/profile/${userId}`)
        }
    }
    

    return (
        <React.Fragment>
            <div className={`${styles.container} ${isOnHover ? styles.onHoverUser : ''}`}>
                {avatar && (
                    <div className={styles.avatar} onClick={onNavigateToProfile}>
                        <a href={link}>
                            <img src={avatar} alt="" />
                        </a>
                    </div>
                )}
                <div className={`${styles.userWrapper} ${className}`}>
                    {isOption ? (
                        <div className={styles.userInfoOptionWrapper}>
                            <div className={styles.userInfo}>
                                <p className={styles.name} onClick={onNavigateToProfile}>
                                    {/* this is for TweetReply */}
                                    {isReply && name.length > 6 ? name.substring(0, 6) + '...' : name}{' '}
                                    {isVerified && (
                                        <img className={styles.certifiedIcon} src={Certified} alt="" />
                                    )}
                                </p>
                                <p className={styles.username} onClick={onNavigateToProfile}>
                                    @{isReply && username.length > 6 ? username.substring(0, 6) + '...' : username} {time && ` · ${time}`}{' '}
                                </p>
                            </div>
                            {authUser?._id === tweet.user._id && (
                                <PopUpMenu
                                    itemId={tweet._id}
                                    options={options!}
                                    value={tweet}
                                    icons={icons}
                                    onClick={(option, id, tweet) =>
                                        onClickOption!(option, id, tweet)
                                    }
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            <div className={styles.userInfo} onClick={onNavigateToProfile}>
                                <p className={styles.name}>
                                {name}{' '}
                                {isVerified && (
                                        <img className={styles.certifiedIcon} src={Certified} alt="" />
                                )}{' '}
                                {isProtected && (
                                    <FontAwesomeIcon icon={faLock} />
                                )}{' '}
                                </p>
                                <p className={styles.username}>
                                    @{username}
                                </p>
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
