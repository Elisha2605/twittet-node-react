import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import styles from './Notifications.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import GearIcon from '../../components/icons/GearIcon';
import HorizontalNavBar from '../../components/ui/HorizontalNavBar';
import PageUnderConstruction from '../../components/ui/PageUnderConstruction';
import SearchBar from '../../components/ui/SearchBar';
import Aside from '../../components/aside/Aside';
import WhoToFollow from '../../components/ui/WhoToFollow';
import { getLikesNotification, getMentionsNotification } from '../../api/notification.api';
import UserInfo from '../../components/ui/UserInfo';
import { useNavigate } from 'react-router-dom';
import { IMAGE_AVATAR_BASE_URL, NOTIFICATION_TYPE } from '../../constants/common.constants';
import NotificationsLike from './NotificationsLike';
import NotificationsMention from './NotificationsMention';
import Tweet from '../../components/tweet/Tweet';
import AuthContext from '../../context/user.context';
import { likeTweet } from '../../api/like.api';

const Notification = () => {

    const [authUser, setAuthUser] = useState<any>(null);
    
    const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab-notification') || 'all');
    const [likesNotification, setLikesNotification] = useState<any[]>([]);
    const [mentionsNotification, setMentionsNotification] = useState<any[]>([]);
    const [likedTweet, setLikedTweet] = useState<any>();
    const [allNotifications, setAllNotifications] = useState<any[]>([]);


    
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        }
        getAuthUser();
    }, []);


     // Set active tab in local storage
    useEffect(() => {
        localStorage.setItem('activeTab-notification', activeTab);
    }, [activeTab]);

    useEffect(() => {
        const getAllNotifications = async () => {
          const likes = await getLikesNotification();
          const mentions = await getMentionsNotification();
      
          // combining likes and mentions into a single array
          const allNotifications = [...likes.notifications, ...mentions.notifications];
      
          // sorting the combined array based on timestamp in descending order
          allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
          setAllNotifications(allNotifications);
        };
      
        getAllNotifications();
      }, []);
      
      useEffect(() => {
        console.log(allNotifications);
      }, [allNotifications])

       // On like tweet
    const onClickLike = async (tweet: any) => {
        const res: any = await likeTweet(tweet._id);;
        const { likedTweet } = res;
        console.log(likedTweet);
        setLikedTweet(likedTweet)
    }

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
                                <div className={activeTab === 'all' ? styles.active : ''}
                                    onClick={() => setActiveTab('all')}
                                >
                                    All
                                </div>
                                <div className={activeTab === 'mentions' ? styles.active : ''}
                                    onClick={() => setActiveTab('mentions')}
                                >
                                    Mentions
                                </div>
                            </HorizontalNavBar>
                        </Header>
                    {/* Home page - start */}
                    {activeTab === 'all' && (
                        <div className={styles.main}>
                        {allNotifications.map((notification: any) => 
                            <div key={notification._id}>
                                {notification.type === NOTIFICATION_TYPE.like ? (
                                     <NotificationsLike likes={notification} />
                                ): (notification.type === NOTIFICATION_TYPE.mention) ? (
                                    <Tweet
                                        key={notification?._id}
                                        tweet={notification}
                                        onClickMenu={() => {}}
                                        onClickLike={onClickLike}
                                        isLiked={notification?.likes?.includes(authUser?._id)}
                                />
                                ): null } 
                            </div>
                        )}
                      </div>
                      
                    )}
                    {activeTab === 'mentions' && (
                        <div className={styles.main}>
                            {allNotifications.map((notification: any) => 
                            <div key={notification._id}>
                                {notification.type === NOTIFICATION_TYPE.mention ? (
                                    <Tweet
                                        key={notification?._id}
                                        tweet={notification}
                                        onClickMenu={() => {}}
                                        onClickLike={() => {}}
                                        isLiked={notification?.likes?.includes(authUser?._id)}
                                />
                                ): null }
                            </div>
                        )}
                        </div>
                    )}
                </div>
                    {/* Home page - start */}
                <div>
                    <Header border={false}>
                        <SearchBar width={74}/>
                    </Header>
                    <Aside className={styles.aside}>
                        <WhoToFollow />
                    </Aside>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Notification;
