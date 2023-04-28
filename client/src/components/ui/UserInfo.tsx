import React, { FC, useContext, useEffect, useState } from 'react';
import PopUpMenu from './PopUpMenu';
import styles from './UserInfo.module.css';
import Certified from '../../assets/certified.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/user.context';

interface UserInfoProps {
    itemId?: any;
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

    const navigate = useNavigate();

    const onNavigateToProfile = () => {
            navigate(`/profile/${userId}`)
    }

    return (
        <React.Fragment>
            <div className={`${styles.container}`}>
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
                                    {name}{' '}
                                    {isVerified && (
                                        <img className={styles.certifiedIcon} src={Certified} alt="" />
                                    )}{' '}
                                </p>
                                <p className={styles.username} onClick={onNavigateToProfile}>
                                    @{username} {time && ` · ${time}`}
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
                            <div className={styles.userInfo} onClick={onNavigateToProfile}>
                                <p className={styles.name}>
                                {name}{' '}
                                {isVerified && (
                                        <img className={styles.certifiedIcon} src={Certified} alt="" />
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
