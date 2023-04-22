import React, { FC } from 'react';
import styles from './NavigationUserInfo.module.css';
import PopUpMenu from '../ui/PopUpMenu';

interface NavigationUserInfoProps {
    id: string;
    avatar: string | undefined;
    name: string;
    username: string;
    menuOptions: string[];
    menuIcons?: Record<string, React.ReactNode>;
    onClickOption: Function;
}

const NavigationUserInfo: FC<NavigationUserInfoProps> = ({
    id,
    avatar,
    name,
    username,
    menuOptions,
    menuIcons,
    onClickOption
}) => {
    return (
        <React.Fragment>
            <div className={`${styles.container}`}>
                <div className={styles.avatar}>
                    <img src={avatar} alt="" />
                </div>
                <div className={`${styles.userWrapper}`}>
                    <div className={styles.userInfo}>
                        <p className={styles.firstname}>{name}</p>
                        <p className={styles.username}>@{username}</p>
                    </div>
                    <PopUpMenu 
                        id={id}
                        options={menuOptions!}
                        icons={menuIcons!}
                        onClick={(menuOptions, id) => 
                            onClickOption!(menuOptions, id)
                        }
                        className={styles.menuOption}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default NavigationUserInfo;
