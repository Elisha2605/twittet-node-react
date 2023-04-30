import React, { useContext, useEffect, useState } from 'react';
import Aside from '../../components/aside/Aside';
import SearchBar from '../../components/ui/SearchBar';
import WhoToFollow from '../../components/ui/WhoToFollow';
import Header from '../../components/header/Header';
import Tweet from '../../components/tweet/Tweet';
import styles from './Profile.module.css';
import Layout from '../../Layout.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import Button, { ButtonSize, ButtonType } from '../../components/ui/Button';
import HeaderTitle from '../../components/header/HeaderTitle';
import HorizontalNavBar from '../../components/ui/HorizontalNavBar';
import { tweetMenuOptions } from '../../data/menuOptions';
import PageUnderConstruction from '../../components/ui/PageUnderConstruction';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_COVER_BASE_URL,
} from '../../constants/common.constants';
import { getMonthName, getYear } from '../../utils/helpers.utils';
import AuthContext from '../../context/user.context';
import { getAuthUserFollows, sendFollowRequest } from '../../api/follow.api';
import { NavLink, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../../api/user.api';

const Profile = () => {
    const { id } = useParams<{ id: string }>();

    const [activeTab, setActiveTab] = useState(
        localStorage.getItem('activeTab-profile') || 'tweets'
    );

    const [followers, setFollowers] = useState<any[]>([]);
    const [followings, setFollowings] = useState<any[]>([]);
    const [authUser, setAuthUser] = useState<any>(null);
    const [user, setUser] = useState<any>();
    const [isFollowing, setIsFollowing] = useState<boolean>();

    const navigate = useNavigate();



    // get Auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        }
        getAuthUser();
    }, []);

    // get User by Id
    useEffect(() => {
        const userInfo = async () => {
            const res = await getUserById(id!);
            const { user } = res;
            setUser(user);
        };
        userInfo();
    }, [id]);

    // get Follow status (consider putting this in the userContext)
    const getAuthUserFollowStatus = async () => {
        const { followers, followings } = await getAuthUserFollows(authUser?._id);
        if (followings && followings.some((following: any) => following.user._id === id)) {
            setIsFollowing(true);
        }
        setFollowers(followers);
        setFollowings(followings);
    };

    useEffect(() => {
        if (authUser) {
            getAuthUserFollowStatus();
        }
    }, [authUser, id]);

    // Set active tab in local storage
    useEffect(() => {
        localStorage.setItem('activeTab-profile', activeTab);
    }, [activeTab]);

     // send follow request
     const handleFollowRequest = async () => {
        const res = await sendFollowRequest(authUser?._id, id!);
        console.log(res);

        setIsFollowing(!isFollowing);
    }

    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* *** HEADER - START *** */}
                    <Header border={true}>
                        <div className={styles.headerItems}>
                            <ArrowLeftIcon
                                onClick={() => {
                                    navigate(-1);
                                }}
                            />
                            <HeaderTitle
                                title={user?.name}
                                subTitle={'1 Tweet'}
                            />
                        </div>
                    </Header>
                    {/* *** HEADER - END *** */}

                    <div className={styles.main}>
                        {/* *** MAIN - START *** */}
                        <div className={styles.imageWrapper}>
                            <div className={styles.coverImage}>
                                <img
                                    src={
                                        user?.coverImage
                                            ? `${IMAGE_COVER_BASE_URL}/${user?.coverImage}`
                                            : undefined
                                    }
                                    alt=""
                                />
                            </div>
                            <div className={styles.profileImage}>
                                <img
                                    src={
                                        user?.avatar
                                            ? `${IMAGE_AVATAR_BASE_URL}/${user?.avatar}`
                                            : undefined
                                    }
                                    alt=""
                                />
                            </div>
                            {authUser?._id === id ? (
                                <Button
                                    className={styles.editProfileBtn}
                                    value={'Edit profile'}
                                    type={ButtonType.tietary}
                                    size={ButtonSize.small}
                                    onClick={() => {
                                        console.log('Edit profile clicked');
                                    }}
                                />
                            ): (
                                <Button
                                    className={styles.editProfileBtn}
                                    value={isFollowing ? 'Following' : 'Follow'}
                                    type={isFollowing ? ButtonType.tietary : ButtonType.secondary}
                                    size={ButtonSize.small}
                                    onClick={handleFollowRequest}
                                />
                            )}
                        </div>
                        <div className={styles.userInfo}>
                            <p className={styles.firstname}>{user?.name}</p>
                            <p className={styles.username}>@{user?.username}</p>
                            <p className={styles.bio}>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Maxime mollitia,
                            </p>
                            <div className={styles.joined}>
                                <FontAwesomeIcon icon={faCalendarDays} />
                                <p>
                                    Joined {getMonthName(user?.createdAt)}{' '}
                                    {getYear(user?.createdAt)}
                                </p>
                            </div>
                            <div className={styles.followStatus}>
                                <NavLink to={`/following/${id}`}>
                                    <p>
                                        2<span>Following</span>
                                    </p>
                                </NavLink>
                                <NavLink to={`/followers/${id}`}>
                                    <p>
                                        1<span>Follower</span>
                                    </p>
                                </NavLink>
                            </div>
                        </div>

                        <HorizontalNavBar className={styles.profileNav}>
                            <div
                                className={
                                    activeTab === 'tweets' ? styles.active : ''
                                }
                                onClick={() => setActiveTab('tweets')}
                            >
                                Tweets
                            </div>
                            <div
                                className={
                                    activeTab === 'replies' ? styles.active : ''
                                }
                                onClick={() => setActiveTab('replies')}
                            >
                                Replies
                            </div>
                            <div
                                className={
                                    activeTab === 'media' ? styles.active : ''
                                }
                                onClick={() => setActiveTab('media')}
                            >
                                Media
                            </div>
                            <div
                                className={
                                    activeTab === 'likes' ? styles.active : ''
                                }
                                onClick={() => setActiveTab('likes')}
                            >
                                Likes
                            </div>
                        </HorizontalNavBar>
                        {/* TWEETS - START */}
                        {/* {activeTab === 'tweets' && (
                            <Tweet 
                                avatar={'https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=723&q=80'} 
                                name={'Luis Suárez'} 
                                username={'LuisSuarez9'} 
                                tweetText={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,molestiae quas vel sint commodi repudiandae consequuntur'}
                                tweetImage={'https://images.unsplash.com/photo-1534083264897-aeabfc7daf8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'}
                                isOption={true}
                                comments={'164'} 
                                reposts={'924'} 
                                likes={'21.3'} 
                                views={'446'} 
                                options={tweetMenuOptions}
                                onClickMenu={handleOptionClick}
                            />
                        )} */}
                        {/* TWEETS - END */}

                        {/* REPLIES - START */}
                        {activeTab === 'replies' && (
                            <div className={styles.main}>
                                <PageUnderConstruction
                                    message={'Will display - all tweet replies'}
                                />
                            </div>
                        )}
                        {/* REPLIES - END */}

                        {/* MEDIA - START */}
                        {activeTab === 'media' && (
                            <div className={styles.main}>
                                <PageUnderConstruction
                                    message={'Will display - all tweet images'}
                                />
                            </div>
                        )}
                        {/* MEDIA - END */}

                        {/* LIKES - START */}
                        {activeTab === 'likes' && (
                            <div className={styles.main}>
                                <PageUnderConstruction
                                    message={'Will display - all tweet likes'}
                                />
                            </div>
                        )}
                        {/* LIKES - END */}

                        {/* *** MAIN - END *** */}
                    </div>
                </div>
                {/* Home page - start */}
                <div>
                    <Header border={false}>
                        <SearchBar width={74} />
                    </Header>
                    <Aside className={styles.aside}>
                        <WhoToFollow />
                    </Aside>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Profile;
