import React, { FC, useContext, useEffect, useState } from 'react';
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
import PageUnderConstruction from '../../components/ui/PageUnderConstruction';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_COVER_BASE_URL,
} from '../../constants/common.constants';
import { getMonthName, getYear } from '../../utils/helpers.utils';
import AuthContext from '../../context/user.context';
import { getAuthUserFollows } from '../../api/follow.api';
import { NavLink, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../../api/user.api';
import { getUserTweets } from '../../api/tweet.api';
import FollowButton from '../../components/ui/FollowButton';
import faLockSolid from "../../assets/faLock-solid.svg"
import { getUserLikedTweets, likeTweet } from '../../api/like.api';


interface ProfileProps {
    onAddTweet: any;
    onDeleteTweet: any;
    onEditTweet: any;
    onClickTweetMenu: Function;
}

const Profile: FC<ProfileProps> = ({
    onAddTweet,
    onDeleteTweet,
    onEditTweet,
    onClickTweetMenu,
}) => {
    const { id } = useParams<{ id: string }>();

    const [activeTab, setActiveTab] = useState(
        localStorage.getItem('activeTab-profile') || 'tweets'
    );

    const [authUser, setAuthUser] = useState<any>(null);
    const [user, setUser] = useState<any>();
    const [isFollowing, setIsFollowing] = useState<boolean>();
    const [userTweets, setUserTweets] = useState<any[]>([]);
    const [userTweetsMedia, setUserTweetsMedia] = useState<any[]>([]);
    const [userLikedTweets, setUserLikedTweets] = useState<any[]>([]);

    const [followings, setFollowings] = useState<any[]>([]);
    const [followers, setFollowers] = useState<any[]>([]);

    const [likedTweet, setLikedTweet] = useState<any>();

    const navigate = useNavigate();

    // get Auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
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
    useEffect(() => {
        if (authUser) {
            const getAuthUserFollowStatus = async () => {
                const { followers, followings } = await getAuthUserFollows(id!);
                if (
                    followings &&
                    followings.some(
                        (following: any) => following?.user?._id === id
                    )
                ) {
                    setIsFollowing(true);
                }
                setFollowings(followings);
                setFollowers(followers);
            };
            getAuthUserFollowStatus();
        }
    }, [authUser, id]);

    // Set active tab in local storage
    useEffect(() => {
        localStorage.setItem('activeTab-profile', activeTab);
    }, [activeTab]);

    // fetch user tweets
    useEffect(() => {
        const fetchUserTweets = async () => {
            const res = await getUserTweets(id!);
            const { tweets } = res;

            const medias = tweets
                .filter((tweet: any) => tweet.image !== null)
                .map((tweet: any) => {
                    return tweet;
                });
            setUserTweets(tweets);
            setUserTweetsMedia(medias);
        };
        fetchUserTweets();
    }, []);

    // On create tweet
    useEffect(() => {
        const handleNewTweetFromModal = () => {
            // Add new tweet from NavigationTweet to state
            if (authUser?.avatar) {
                console.log('Inside handleNewTweet');
                setUserTweets((prevTweets) => [onAddTweet[0], ...prevTweets]);
                setUserTweetsMedia((prevTweets) => [
                    onAddTweet[0],
                    ...prevTweets,
                ]);
            }
        };
        handleNewTweetFromModal();
    }, [onAddTweet]);

    // On edit tweet
    useEffect(() => {
        const handleEditTweetFromModal = () => {
            if (authUser?.avatar) {
                setUserTweets((prevTweets) =>
                    prevTweets.map((tweet) =>
                        tweet?._id === onEditTweet?._id
                            ? { ...tweet, ...onEditTweet }
                            : tweet
                    )
                );
                setUserTweetsMedia((prevTweets) =>
                    prevTweets.map((tweet) =>
                        tweet?._id === onEditTweet?._id
                            ? { ...tweet, ...onEditTweet }
                            : tweet
                    )
                );
            }
        };
        handleEditTweetFromModal();
    }, [onEditTweet]);

    // On delete tweet
    useEffect(() => {
        setUserTweets((preveState) =>
            preveState.filter((tweet) => tweet?._id !== onDeleteTweet?._id)
        );
        setUserTweetsMedia((preveState) =>
            preveState.filter((tweet) => tweet?._id !== onDeleteTweet?._id)
        );
    }, [onDeleteTweet]);

    // On like tweet
    const onClickLike = async (tweet: any) => {
        const res: any = await likeTweet(tweet._id);
        const { likedTweet } = res;
        setLikedTweet(likedTweet);
    };

    // get liked tweets
    useEffect(() => {
        const getLikedTweet = async () => {
            const res: any = await getUserLikedTweets(id!);
            const { tweets } = res;
            setUserLikedTweets(tweets);
        };
        getLikedTweet();
    }, []);

    useEffect(() => {
        setUserTweets((prevTweets: any) =>
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
        setUserTweetsMedia((prevTweets: any) =>
            prevTweets.map((tweet: any) =>
                tweet?._id === likedTweet.tweet
                    ? {
                          ...tweet,
                          totalLikes: likedTweet.likesCount,
                          likes: likedTweet?.likes,
                      }
                    : tweet
            )
        );
        setUserLikedTweets((prevTweets: any) =>
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
                                isProtected={user?.isProtected}
                                subTitle={
                                    (activeTab === 'tweets' ||
                                        activeTab === 'replies') &&
                                    userTweets.length === 1
                                        ? userTweets.length + ' tweet'
                                        : (activeTab === 'tweets' ||
                                              activeTab === 'replies') &&
                                          userTweets.length > 1
                                        ? userTweets.length + ' tweets'
                                        : activeTab === 'media'
                                        ? userTweetsMedia.length + ' photos'
                                        : '1 like'
                                }
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
                            {authUser?._id === id! ? (
                                <Button
                                    className={styles.editProfileBtn}
                                    value={'Edit profile'}
                                    type={ButtonType.tietary}
                                    size={ButtonSize.small}
                                    onClick={() => {
                                        console.log('Edit profile clicked');
                                    }}
                                />
                            ) : (
                                <FollowButton
                                    userId={id}
                                    type={ButtonType.secondary}
                                    size={ButtonSize.small}
                                    className={styles.editProfileBtn}
                                />
                            )}
                        </div>
                        <div className={styles.userInfo}>
                            {!user?.isProtected ? (
                                <p className={styles.firstname}>{user?.name}</p>
                            ): (
                                <div className={styles.isProtected}>
                                    <p className={styles.firstname}>{user?.name}</p>
                                    <img src={faLockSolid} alt="" />
                                </div>
                            )}
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
                                        {followings.length}
                                        <span>Following</span>
                                    </p>
                                </NavLink>
                                <NavLink to={`/followers/${id}`}>
                                    <p>
                                        {followers.length}
                                        <span>Followers</span>
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
                        {activeTab === 'tweets' && (
                            <div className={styles.tweets}>
                                {/* tweets - start */}
                                {userTweets.map((tweet: any) => (
                                    <Tweet
                                        key={tweet?._id}
                                        tweet={tweet}
                                        onClickMenu={onClickTweetMenu}
                                        onClickLike={onClickLike}
                                        isLiked={tweet?.likes?.includes(
                                            authUser?._id
                                        )}
                                    />
                                ))}
                                {/* tweets - end */}
                            </div>
                        )}
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
                                {userTweetsMedia.map((tweet: any) => (
                                    <Tweet
                                        key={tweet._id}
                                        tweet={tweet}
                                        onClickMenu={onClickTweetMenu}
                                        onClickLike={onClickLike}
                                        isLiked={tweet?.likes?.includes(
                                            authUser?._id
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                        {/* MEDIA - END */}

                        {/* LIKES - START */}
                        {activeTab === 'likes' && (
                            <div className={styles.main}>
                                {userLikedTweets.map((tweet: any) => (
                                    <Tweet
                                        key={tweet._id}
                                        tweet={tweet}
                                        onClickMenu={onClickTweetMenu}
                                        onClickLike={onClickLike}
                                        isLiked={tweet?.likes?.includes(
                                            authUser?._id
                                        )}
                                    />
                                ))}
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
