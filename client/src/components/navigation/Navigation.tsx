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
import { MORE_NAV_OPTION } from '../../constants/common.constants';
import { ModalContext } from '../../context/modal.context';
import AuthContext from '../../context/user.context';
import FaCircleEllipsis from '../../assets/faCircleEllipsis-regular.svg';
import faHashTagRegular from '../../assets/faHashTag-regular.svg';
import faHashTagSolid from '../../assets/faHashTag-solid.svg';
import faHomeRegular from '../../assets/faHome-regular.svg';
import faHomeSolid from '../../assets/faHome-solid.svg';
import PopUpMenu from '../ui/PopUpMenu';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllNotifications, getMessageNotification, removeMessageNotification } from '../../api/notification.api';
import { updateMessageStatus } from '../../api/message.api';

interface NavigationProps {
    socket: any;
}

const Navigation: React.FC<NavigationProps> = ({ socket }) => {
    const [authUser, setAuthUser] = useState<any>(null);
    const [activeNav, setActiveNav] = useState('home');
    const [isNotificationOpened, setIsNotificationOpened] =
        useState<boolean>(true);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isRead, setIsRead] = useState<boolean>(false);
    const [messageNotification, setMessageNotification] = useState<number | null>();
    const [isMessageVisited, setIsMessageVisited] = useState<boolean>(true);
    const [newMessage, setNewMessage] = useState<any>();


    const navigate = useNavigate();


    /////////// notifications //////////////

    useEffect(() => {
        const fetchAllNotifications = async () => {
            setIsRead(false);
            const { notifications } = await getAllNotifications();
            const { msgNotification } = await getMessageNotification();
            notifications.map((notif: any) => {
                if (
                    notif?.read === false &&
                    authUser?._id === notifications?.user?._id
                ) {
                    setIsRead(true);
                }
            });
            if (msgNotification.length > 0)  {
                setMessageNotification(msgNotification?.length)
            }
        };
        fetchAllNotifications();
    }, []);


    /////////// notifications //////////////

    ////// Socket.io - START ////////
   
    useEffect(() => {
        socket?.on('getNotification', (data: any) => {
            setNotifications((preveState) => [...preveState, data]);
            setIsNotificationOpened(true);
        });
        return () => {
            socket?.off('getNotification');
            // socket?.off('getMessage');
        };
    }, [socket]);

    const location = useLocation();
    const currentPath = location.pathname;
   
    useEffect(() => {
        socket?.on('getMessageNotification', async (obj: any) => {
            const { msgNotification } = await getMessageNotification();
            setMessageNotification(msgNotification?.length)
            setIsMessageVisited(false);
            setNewMessage(obj);
        });
    }, [socket]);

    useEffect(() => {
        const messageNotification = async () => {
            if (currentPath === `/message/${newMessage?.sender?._id}`) {
                await updateMessageStatus(newMessage?.sender?._id); // set read = true
                await removeMessageNotification(); // set isVisited = true
                setIsMessageVisited(true);
                setMessageNotification(null);
                socket?.emit('sendMessageStatus', {
                    messageId: newMessage?.message?._id,
                    receiver: newMessage?.sender?._id,
                    isMessageRead: true,
                })
            }
        }
        messageNotification()
    }, [currentPath, newMessage])
    ////// Socket.io - END ////////

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
            navigate('/settings/account');
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
                            setIsNotificationOpened(false);
                            setIsRead(false);
                        }}
                        className={`${styles.navItem} ${styles.notification} ${
                            activeNav === 'notification' ? styles.active : ''
                        }`}
                    >
                        {isNotificationOpened && notifications.length > 0 && (
                            <div className={styles.dot}></div>
                        )}
                        {isRead && <div className={styles.dot}></div>}
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
                        onClick={async () => {
                            setActiveNav('message');
                            await removeMessageNotification();
                            setIsMessageVisited(true);
                            setMessageNotification(null);
                        }}
                        className={`${styles.navItem} ${styles.message} ${
                            activeNav === 'message' ? styles.active : ''
                        }`}
                    >
                        {!isMessageVisited && (
                            <div className={styles.dot}>{messageNotification}</div>
                        )}
                        {messageNotification && messageNotification > 0 && (
                            <div className={styles.dot}>{messageNotification}</div>
                        )}
                        <NavigationItem
                            icon={
                                activeNav === 'message'
                                    ? faEnvelopeSolid
                                    : faEnvelope
                            }
                            label={'Message'}
                            path={'/message'}
                        />
                    </div>

                    <div
                        onClick={() => {
                            setActiveNav('bookmarks');
                        }}
                        className={`${styles.navItem} ${
                            activeNav === 'bookmarks' ? styles.active : ''
                        }`}
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

                    {authUser && authUser?._id && (
                        <div
                            onClick={() => {
                                setActiveNav('profile');
                            }}
                            className={`${styles.navItem} ${
                                activeNav === 'profile' ? styles.active : ''
                            }`}
                        >
                            <NavigationItem
                                icon={
                                    activeNav === 'profile'
                                        ? faUserSolid
                                        : faUser
                                }
                                label={'Profile'}
                                path={`/profile/${authUser?._id}`}
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

                <div className={styles.navigationUser}>
                    <NavigationUserInfo
                        user={authUser}
                        menuOptions={navUserMenuOptions}
                        menuIcons={navUseMenuIcons}
                        onClickOption={handleMenuOptionClick}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Navigation;