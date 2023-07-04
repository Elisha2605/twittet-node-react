import React, { FC, useContext, useEffect, useState } from 'react';
import styles from './UserInfoRetweet.module.css';
import Certified from '../../assets/certified.svg';
import AuthContext from '../../context/user.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import faLockSolid from '../../assets/faLock-solid.svg';
import { IMAGE_AVATAR_BASE_URL, IMAGE_AVATAR_DEFAULT } from '../../constants/common.constants';


interface UserInfoRetweetProps {
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

const UserInfoRetweet: FC<UserInfoRetweetProps> = ({
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

    return (
        <React.Fragment>
            <div className={`${styles.container} ${isOnHover ? styles.onHoverUser : ''}`}>
                {avatar && (
                    <div className={styles.avatar}>
                        <a href={link}>
                            <img src={avatar
                                    ? `${IMAGE_AVATAR_BASE_URL}/${avatar}`
                                    : `${IMAGE_AVATAR_BASE_URL}/${IMAGE_AVATAR_DEFAULT}`} alt="" />
                        </a>
                    </div>
                )}
                <div className={`${styles.userWrapper} ${className}`}>
                    {isOption ? (
                        <div className={styles.userInfoOptionWrapper}>
                            <div className={styles.userInfo}>
                                <p className={styles.name}>
                                    {/* this is for TweetReply */}
                                    {isReply && name.length > 6 ? name.substring(0, 6) + '...' : name}{' '}
                                </p>
                                {tweet?.user?.isProtected && (
                                    <div className={styles.isProtected}>
                                        <img src={faLockSolid} alt="" />
                                    </div>
                                )}
                                <span>
                                {isVerified && (
                                        <img className={styles.certifiedIcon} src={Certified} alt="" />
                                    )}
                                </span>
                                <p className={styles.username} >
                                    @{isReply && username.length > 6 ? username.substring(0, 6) + '...' : username} {time && ` · ${time}`}{' '}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.userInfo}>
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

export default UserInfoRetweet;
