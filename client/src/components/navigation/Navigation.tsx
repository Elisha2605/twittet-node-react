import React, { useContext, useEffect, useState } from 'react';
import { faHashtag, faHome } from '@fortawesome/free-solid-svg-icons';
import {
    faBell,
    faBookmark,
    faEnvelope,
    faUser,
} from '@fortawesome/free-regular-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from './Navigation.module.css';
import NavigationItem from './NavigationItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import NavigationUserInfo from './NavigationUserInfo';
import { logout } from '../../api/auth.api';
import { navUseMenuIcons, navUserMenuOptions } from '../../data/menuOptions';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import { ModalContext } from '../../context/modal.context';
import AuthContext from '../../context/user.context';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = ({}) => {
    const [authUser, setAuthUser] = useState<any>(null);
    const [activeNav, setActiveNav] = useState(
        localStorage.getItem('active-nav') || 'home'
    );

    useEffect(() => {
        localStorage.setItem('active-nav', activeNav);
    }, [activeNav]);

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
        getAuthUser();
    }, []);

    const { openModal } = useContext(ModalContext);

    // Logout
    const handleMenuOptionClick = async (options: string) => {
        if (options === 'Logout') {
            await logout();
        }
    };

    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <FontAwesomeIcon
                        icon={faTwitter}
                        color={'var(--color-primary)'}
                        size={'2xl'}
                    />
                </div>
                <div className={styles.naviItems}>
                    <div
                        onClick={() => {
                            setActiveNav('home');
                        }}
                        className={
                            activeNav === 'home' ? styles.active : ''
                        }
                    >
                        <NavigationItem icon={faHome} label={'Home'} path="/" />
                    </div>

                    <div
                        onClick={() => {
                            setActiveNav('explore');
                        }}
                        className={
                            activeNav === 'explore' ? styles.active : ''
                        }
                    >
                        <NavigationItem
                            icon={faHashtag}
                            label={'Explore'}
                            path="/explore"
                        />
                    </div>

                    <div
                        onClick={() => {
                            setActiveNav('notification');
                        }}
                        className={
                            activeNav === 'notification' ? styles.active : ''
                        }
                    >
                        <NavigationItem
                            icon={faBell}
                            label={'Notifications'}
                            path="/notification"
                        />
                    </div>

                    <div
                        onClick={() => {
                            setActiveNav('message');
                        }}
                        className={
                            activeNav === 'message' ? styles.active : ''
                        }
                    >
                        <NavigationItem
                            icon={faEnvelope}
                            label={'Message'}
                            path="/message"
                        />
                    </div>

                    <div
                        onClick={() => {
                            setActiveNav('bookmarks');
                        }}
                        className={
                            activeNav === 'bookmarks' ? styles.active : ''
                        }
                    >
                        <NavigationItem
                            icon={faBookmark}
                            label={'Bookmarks'}
                            path="/bookmarks"
                            className={styles.bookmarks}
                        />
                    </div>

                    <div
                        onClick={() => {
                            setActiveNav('profile');
                        }}
                        className={
                            activeNav === 'profile' ? styles.active : ''
                        }
                    >
                        <NavigationItem
                            icon={faUser}
                            label={'Profile'}
                            path={`/profile/${authUser?._id}`}
                        />
                    </div>

                    <div
                        onClick={() => {
                            setActiveNav('#');
                        }}
                        className={
                            activeNav === '#' ? styles.active : ''
                        }
                    >
                        <NavigationItem
                            icon={faEllipsisH}
                            label={'More'}
                            path="#"
                            className={styles.ellipsis}
                        />
                    </div>
                    
                </div>
                <Button
                    value={'Tweet'}
                    type={ButtonType.primary}
                    size={ButtonSize.medium}
                    onClick={() => openModal('main-tweet-modal')}
                />

                <NavigationUserInfo
                    id={authUser?.id}
                    menuOptions={navUserMenuOptions}
                    menuIcons={navUseMenuIcons}
                    onClickOption={handleMenuOptionClick}
                    avatar={
                        authUser?.avatar &&
                        `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`
                    }
                    name={authUser?.name}
                    username={authUser?.username}
                />
            </div>
        </React.Fragment>
    );
};

export default Navigation;
