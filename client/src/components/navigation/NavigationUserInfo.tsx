import React, { FC } from 'react';
import styles from './NavigationUserInfo.module.css';
import PopUpMenu from '../ui/PopUpMenu';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_AVATAR_DEFAULT,
} from '../../constants/common.constants';
import faLockSolid from '../../assets/faLock-solid.svg';
import Certified from '../../assets/certified.svg';

interface NavigationUserInfoProps {
    user: any;
    menuOptions: string[];
    menuIcons?: Record<string, React.ReactNode>;
    onClickOption: Function;
}

const NavigationUserInfo: FC<NavigationUserInfoProps> = ({
    user,
    menuOptions,
    menuIcons,
    onClickOption,
}) => {
    return (
        <React.Fragment>
            <PopUpMenu
                itemId={user?._id}
                options={menuOptions!}
                icons={menuIcons!}
                isMenuIcon={false}
                onClick={(menuOptions, id) => onClickOption!(menuOptions, id)}
                className={styles.menuOption}
            >
                <div className={`${styles.container}`}>
                    <div className={styles.avatar}>
                        <img
                            src={
                                user?.avatar
                                    ? `${IMAGE_AVATAR_BASE_URL}/${user?.avatar}`
                                    : `${IMAGE_AVATAR_BASE_URL}/${IMAGE_AVATAR_DEFAULT}`
                            }
                            alt=""
                        />
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.name}>
                            <p className={styles.firstname}>{user?.name}</p>
                            {user?.isProtected && (
                                <div className={styles.isProtected}>
                                    <img src={faLockSolid} alt="" />
                                </div>
                            )}
                            <span>
                                {user?.isVerified && (
                                    <img
                                        className={styles.certifiedIcon}
                                        src={Certified}
                                        alt=""
                                    />
                                )}
                            </span>
                        </div>
                        <p className={styles.username}>@{user?.username}</p>
                    </div>

                    <div className={styles.threeDots}>···</div>
                </div>
            </PopUpMenu>
        </React.Fragment>
    );
};

export default NavigationUserInfo;
