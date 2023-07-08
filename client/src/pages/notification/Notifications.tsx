import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import styles from './Notifications.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import GearIcon from '../../components/icons/GearIcon';
import HorizontalNavBar from '../../components/ui/HorizontalNavBar';
import SearchBar from '../../components/ui/SearchBar';
import Aside from '../../components/aside/Aside';
import WhoToFollow from '../../components/ui/WhoToFollow';
import {
    getAllNotifications, updateNotificationsState,
} from '../../api/notification.api';
import { NOTIFICATION_TYPE } from '../../constants/common.constants';
import NotificationsLike from './NotificationsLike';
import Tweet from '../../components/tweet/Tweet';
import AuthContext from '../../context/user.context';
import { likeTweet } from '../../api/like.api';
import ContentNotAvailable from '../../components/ui/ContentNotAvailable';
import { useLocation } from 'react-router-dom';

const Notification = () => {
    const [authUser, setAuthUser] = useState<any>(null);

    const [activeTab, setActiveTab] = useState(
        localStorage.getItem('activeTab-notification') || 'all'
    );
    const [likedTweet, setLikedTweet] = useState<any>();
    const [allNotifications, setAllNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<any>(null);

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
        getAuthUser();
    }, []);

    // Set active tab in local storage
    useEffect(() => {
        localStorage.setItem('activeTab-notification', activeTab);
    }, [activeTab]);

    useEffect(() => {
        const fetchAllNotifications = async () => {
            setIsLoading(true);
            const { notifications } = await getAllNotifications();

            await updateNotificationsState();

            setAllNotifications(notifications);
            setIsLoading(false);
        };

        fetchAllNotifications();
    }, []);

    // On like tweet
    const onClickLike = async (tweet: any) => {
        const res: any = await likeTweet(tweet._id);
        const { likedTweet } = res;
        console.log(likedTweet);
        setLikedTweet(likedTweet);
    };

    useEffect(() => {
        setAllNotifications((prevTweets: any) =>
            prevTweets.map((tweet: any) =>
                tweet?._id === likedTweet?.tweet
                    ? {
                          ...tweet,
                          totalLikes: likedTweet?.likesCount,
                          likes: likedTweet?.likes,
                      }
                    : tweet
            )
        );
    }, [likedTweet]);

    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                    <Header border={true}>
                        <div className={styles.headerWrapper}>
                            <HeaderTitle title={'Notifications'} />
                            <GearIcon />
                        </div>
                        <HorizontalNavBar className={styles.NotificationNav}>
                            <div
                                className={
                                    activeTab === 'all' ? styles.active : ''
                                }
                                onClick={() => setActiveTab('all')}
                            >
                                All
                            </div>
                            <div
                                className={
                                    activeTab === 'mentions'
                                        ? styles.active
                                        : ''
                                }
                                onClick={() => setActiveTab('mentions')}
                            >
                                Mentions
                            </div>
                        </HorizontalNavBar>
                    </Header>
                    {/* Home page - start */}
                    {activeTab === 'all' && (
                        <div className={styles.main}>
                            {!isLoading &&
                                allNotifications.length > 0 &&
                                allNotifications.map((notification: any) => (
                                    <div key={notification?._id + Math.random()}>
                                        {notification.type ===
                                        NOTIFICATION_TYPE.tweet ? (
                                            <NotificationsLike
                                                like={notification}
                                            />
                                        ) : notification.type ===
                                        NOTIFICATION_TYPE.reply ? (
                                            <NotificationsLike
                                                like={notification}
                                            />
                                        ) : notification.type ===
                                          NOTIFICATION_TYPE.mention ? (
                                            <Tweet
                                                key={notification?._id + Math.random()}
                                                tweet={notification}
                                                onClickLike={onClickLike}
                                                isLiked={notification?.likes?.includes(
                                                    authUser?._id
                                                )}
                                            />
                                        ) : null}
                                    </div>
                                ))}
                            {!isLoading &&  allNotifications.length === 0 && (
                                <ContentNotAvailable
                                    title={
                                        "You don't have notificaitons - yet!"
                                    }
                                    message={
                                        'All your notifications will be shown here!'
                                    }
                                />
                            )}
                        </div>
                    )}
                    {activeTab === 'mentions' && (
                        <div className={styles.main}>
                            {!isLoading &&  allNotifications.length < 1 && (
                                <ContentNotAvailable
                                    title={"You haven't been metioned - yet!"}
                                    message={
                                        'Here you will find all tweets in which people mentioned you!'
                                    }
                                />
                            )}
                            {!isLoading &&
                                allNotifications.length > 0 &&
                                allNotifications.map((notification: any) => (
                                    <div key={notification._id + Math.random()}>
                                        {notification.type ===
                                        NOTIFICATION_TYPE.mention ? (
                                            <Tweet
                                                key={notification?._id}
                                                tweet={notification}
                                                onClickMenu={() => {}}
                                                onClickLike={() => {}}
                                                isLiked={notification?.likes?.includes(
                                                    authUser?._id
                                                )}
                                            />
                                        ) : null}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
                {/* Home page - start */}
                <div className={Layout.aside}>
                    <Aside className={styles.aside}>
                        <Header border={false}>
                            <SearchBar isNavigate={true} />
                        </Header>
                        <WhoToFollow />
                    </Aside>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Notification;
