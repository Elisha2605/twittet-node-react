import React, { useContext, useEffect, useState } from 'react';
import {
    faBell,
    faBookmark,
    faEnvelope,
    faUser,
} from '@fortawesome/free-regular-svg-icons';
import {
    faBell as faBellSolid,
    faBookmark as faBookmarkSolid,
    faEnvelope as faEnvelopeSolid,
    faUser as faUserSolid,
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from './Navigation.module.css';
import NavigationItem from './NavigationItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import NavigationUserInfo from './NavigationUserInfo';
import { logout } from '../../api/auth.api';
import {
    moreIcons,
    moreOptions,
    navUseMenuIcons,
    navUserMenuOptions,
} from '../../data/menuOptions';
import {
    IMAGE_AVATAR_BASE_URL,
    MORE_NAV_OPTION,
} from '../../constants/common.constants';
import { ModalContext } from '../../context/modal.context';
import AuthContext from '../../context/user.context';
import FaCircleEllipsis from '../../assets/faCircleEllipsis-regular.svg';
import faHashTagRegular from '../../assets/faHashTag-regular.svg';
import faHashTagSolid from '../../assets/faHashTag-solid.svg';
import faHomeRegular from '../../assets/faHome-regular.svg';
import faHomeSolid from '../../assets/faHome-solid.svg';
import PopUpMenu from '../ui/PopUpMenu';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = ({}) => {
    const [authUser, setAuthUser] = useState<any>(null);
    const [activeNav, setActiveNav] = useState('home');

    const navigate = useNavigate();

    useEffect(() => {
        const setNavActive = () => {
            const path = window.location.pathname;
            const activeNav = path.split('/')[1] || 'home';
            setActiveNav(activeNav);
        };

        // set active nav on component mount
        setNavActive();

        // add popstate event listener to set active nav on back/forward navigation
        window.addEventListener('popstate', setNavActive);

        // cleanup function to remove popstate event listener
        return () => {
            window.removeEventListener('popstate', setNavActive);
        };
    }, []);

    // update the auth user when the context changes in local storage.
    const contextStr = localStorage.getItem('context');
    useEffect(() => {
        if (contextStr) {
            const context = JSON.parse(contextStr);
            const user = context?.user;
            setAuthUser((prevUser: any) => ({ ...prevUser, ...user }));
        }
    }, [contextStr]);

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

    const handleMoreOptions = (option: string) => {
        if (option === MORE_NAV_OPTION.followRequests) {
            navigate('/follower-requests');
        }
        if (option === MORE_NAV_OPTION.settingsAndPrivacy) {
            console.log(option);
        }
        if (option === MORE_NAV_OPTION.display) {
            console.log(option);
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
                        className={` ${styles.faHome} ${
                            activeNav === 'home' ? styles.active : ''
                        }`}
                        onClick={() => {
                            navigate('/');
                            setActiveNav('home');
                        }}
                    >
                        <img
                            src={
                                activeNav === 'home'
                                    ? faHomeSolid
                                    : faHomeRegular
                            }
                            alt=""
                        />
                        <h2>Home</h2>
                    </div>

                    <div
                        className={` ${styles.faHashTag} ${
                            activeNav === 'explore' ? styles.active : ''
                        }`}
                        onClick={() => {
                            navigate('/explore');
                            setActiveNav('explore');
                        }}
                    >
                        <img
                            src={
                                activeNav === 'explore'
                                    ? faHashTagSolid
                                    : faHashTagRegular
                            }
                            alt=""
                        />
                        <h2>Explore</h2>
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
                            icon={
                                activeNav === 'notification'
                                    ? faBellSolid
                                    : faBell
                            }
                            label={'Notifications'}
                            path="/notification"
                        />
                    </div>

                    <div
                        onClick={() => {
                            setActiveNav('message');
                        }}
                        className={activeNav === 'message' ? styles.active : ''}
                    >
                        <NavigationItem
                            icon={
                                activeNav === 'message'
                                    ? faEnvelopeSolid
                                    : faEnvelope
                            }
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
                            icon={
                                activeNav === 'bookmarks'
                                    ? faBookmarkSolid
                                    : faBookmark
                            }
                            label={'Bookmarks'}
                            path="/bookmarks"
                            className={styles.bookmarks}
                        />
                    </div>

                    {authUser && authUser._id && (
                        <div
                            onClick={() => {
                                setActiveNav('profile');
                            }}
                            className={
                                activeNav === 'profile' ? styles.active : ''
                            }
                        >
                            <NavigationItem
                                icon={
                                    activeNav === 'profile'
                                        ? faUserSolid
                                        : faUser
                                }
                                label={'Profile'}
                                path={`/profile/${authUser._id}`}
                            />
                        </div>
                    )}

                    <PopUpMenu
                        options={moreOptions}
                        icons={moreIcons}
                        isMenuIcon={false}
                        isDisable={false}
                        onClick={handleMoreOptions}
                        className={styles.moreOptions}
                    >
                        <div
                            className={styles.faCircleEllipsis}
                            onClick={() => {
                                setActiveNav('more');
                            }}
                        >
                            <img src={FaCircleEllipsis} alt="" />
                            <h2>More</h2>
                        </div>
                    </PopUpMenu>
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
