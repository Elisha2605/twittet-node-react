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
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_COVER_BASE_URL,
} from '../../constants/common.constants';
import { getMonthName, getYear } from '../../utils/helpers.utils';
import AuthContext from '../../context/user.context';
import { NavLink, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../../api/user.api';
import { getUserTweetReplies, getUserTweets } from '../../api/tweet.api';
import faLockSolid from '../../assets/faLock-solid.svg';
import { getUserLikedTweets, likeTweet } from '../../api/like.api';
import { ModalContext } from '../../context/modal.context';
import ProfileEditModal from './profile-modals/ProfileEditModal';
import { faLink, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import FollowButton from '../../components/ui/FollowButton';
import ContentNotAvailable from '../../components/ui/ContentNotAvailable';

interface ProfileProps {
    onAddTweet: any;
    onDeleteTweet: any;
    onEditTweet: any;
    onClickTweetMenu: Function;
    onClickRetweet: Function;
}

const Profile: FC<ProfileProps> = ({
    onAddTweet,
    onDeleteTweet,
    onEditTweet,
    onClickTweetMenu,
    onClickRetweet
}) => {
    const { id } = useParams<{ id: string }>();

    const [object, setObject] = useState<any>({ key: 'value' });

    const { openModal } = useContext(ModalContext);

    const [activeTab, setActiveTab] = useState(
        localStorage.getItem('activeTab-profile') || 'tweets'
    );

    const [authUser, setAuthUser] = useState<any>(null);
    const [user, setUser] = useState<any>();
    const [userTweets, setUserTweets] = useState<any[]>([]);
    const [userTweetsMedia, setUserTweetsMedia] = useState<any[]>([]);
    const [userLikedTweets, setUserLikedTweets] = useState<any[]>([]);
    const [userTweetReplies, setUserTweetReplies] = useState<any[]>([]);

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
            const { user } = await getUserById(id!);
            setUser(user);
        };
        userInfo();
    }, [id]);

    // Set active tab in local storage
    useEffect(() => {
        localStorage.setItem('activeTab-profile', activeTab);
    }, [activeTab]);

    // fetch user tweets
    useEffect(() => {
        const fetchUserTweets = async () => {
            const res = await getUserTweets(id as string);
            const { tweets } = res;

            const medias = tweets
                .filter((tweet: any) => tweet?.image !== null)
                .map((tweet: any) => {
                    return tweet;
                });
            setUserTweets(tweets);
            setUserTweetsMedia(medias);
        };
        fetchUserTweets();
    }, [id]);

    // On create tweet
    useEffect(() => {
        const handleNewTweetFromModal = () => {
            // Add new tweet from NavigationTweet to state
            if (authUser?.avatar) {
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
                setUserTweetReplies((prevTweets) =>
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
                setUserLikedTweets((prevTweets) =>
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
        setUserTweetReplies((preveState) =>
            preveState.filter((tweet) => tweet?._id !== onDeleteTweet?._id)
        );
        setUserTweetsMedia((preveState) =>
            preveState.filter((tweet) => tweet?._id !== onDeleteTweet?._id)
        );
        setUserLikedTweets((preveState) =>
            preveState.filter((tweet) => tweet?._id !== onDeleteTweet?._id)
        );
    }, [onDeleteTweet]);

    // On like tweet
    const onClickLike = async (tweet: any) => {
        const { likedTweet } = await likeTweet(tweet._id);
        setLikedTweet(likedTweet);
    };

    // get liked tweets
    useEffect(() => {
        const getLikedTweet = async () => {
            const { tweets } = await getUserLikedTweets(id!);
            const { replies } = await getUserTweetReplies(id!);

            setUserLikedTweets(tweets);
            setUserTweetReplies(replies);
        };
        getLikedTweet();
    }, [id]);

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
        setUserTweetReplies((prevTweets: any) =>
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
                tweet?._id === likedTweet?.tweet
                    ? {
                          ...tweet,
                          totalLikes: likedTweet?.likesCount,
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

    const updateTweetsUserInfoOnProfileEdit = (user: any) => {
        setUserTweets((prevTweets) =>
            prevTweets.map((tweet) => {
                if (tweet?.user?._id === user?._id) {
                    return {
                        ...tweet,
                        user: {
                            ...tweet?.user,
                            name: user?.name,
                            avatar: user?.avatar,
                        },
                    };
                }
                return tweet;
            })
        );
        setUserTweetReplies((prevTweets) =>
            prevTweets.map((tweet) => {
                if (tweet?.user?._id === user?._id) {
                    return {
                        ...tweet,
                        user: {
                            ...tweet?.user,
                            name: user?.name,
                            avatar: user?.avatar,
                        },
                    };
                }
                return tweet;
            })
        );
        setUserTweetsMedia((prevTweets) =>
            prevTweets.map((tweet) => {
                if (tweet?.user?._id === user?._id) {
                    return {
                        ...tweet,
                        user: {
                            ...tweet?.user,
                            name: user?.name,
                            avatar: user?.avatar,
                        },
                    };
                }
                return tweet;
            })
        );
        setUserLikedTweets((prevTweets) =>
            prevTweets.map((tweet) => {
                if (tweet?.user?._id === user?._id) {
                    return {
                        ...tweet,
                        user: {
                            ...tweet?.user,
                            name: user?.name,
                            avatar: user?.avatar,
                        },
                    };
                }
                return tweet;
            })
        );
    };

    const getEditedUser = (editedUser: any) => {
        updateTweetsUserInfoOnProfileEdit(editedUser);
        setObject(editedUser);
        setUser((prevUser: any) => ({ ...prevUser, ...editedUser }));
    };

    const onFollowCallback = (followStatus: any) => {
        if (followStatus.message === 'Following') {
            setUser((prevUser: any) =>
                prevUser?._id === followStatus.response[0].user
                    ? {
                          ...prevUser,
                          followerCount: prevUser.followerCount + 1,
                      }
                    : prevUser
            );
        } else if (followStatus.message === 'Unfollow') {
            setUser((prevUser: any) =>
                prevUser?._id === followStatus.response[0].user
                    ? {
                          ...prevUser,
                          followerCount: prevUser.followerCount - 1,
                      }
                    : prevUser
            );
        }
    };

    const isAuthUser = authUser?._id === id;

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
                                    activeTab === 'tweets' ||
                                    activeTab === 'replies'
                                        ? userTweets.length + ' tweet'
                                        : activeTab === 'tweets' ||
                                          activeTab === 'replies'
                                        ? userTweets.length + ' tweets'
                                        : activeTab === 'media'
                                        ? userTweetsMedia.length + ' photos'
                                        : userLikedTweets.length + ' like'
                                }
                            />
                        </div>
                    </Header>
                    {/* *** HEADER - END *** */}
                    <div className={styles.main}>
                        {/* *** MAIN - START *** */}
                        {user && (
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
                                            openModal('profile-edit-modal');
                                        }}
                                    />
                                ) : (
                                    <>
                                        <FollowButton
                                            userId={user?._id}
                                            user={user}
                                            type={ButtonType.secondary}
                                            size={ButtonSize.small}
                                            className={styles.editProfileBtn}
                                            onFollowCallback={onFollowCallback}
                                        />
                                    </>
                                )}
                                <ProfileEditModal
                                    user={user}
                                    editedObject={object}
                                    onCallBackEdit={getEditedUser}
                                />
                            </div>
                        )}
                        <div className={styles.userInfo}>
                            {!user?.isProtected ? (
                                <p className={styles.firstname}>{user?.name}</p>
                            ) : (
                                <div className={styles.isProtected}>
                                    <p className={styles.firstname}>
                                        {user?.name}
                                    </p>
                                    <img src={faLockSolid} alt="" />
                                </div>
                            )}
                            <p className={styles.username}>@{user?.username}</p>
                            <p className={styles.bio}>{user?.bio}</p>

                            <div className={styles.metaInfo}>
                                {user?.location && (
                                    <div className={styles.location}>
                                        <FontAwesomeIcon icon={faLocationDot} />
                                        <p>{user?.location}</p>
                                    </div>
                                )}
                                {user?.website && (
                                    <div className={styles.website}>
                                        <FontAwesomeIcon icon={faLink} />
                                        <a
                                            href={
                                                user?.website?.startsWith(
                                                    'https://'
                                                )
                                                    ? user.website.replace(
                                                          'http://',
                                                          'https://'
                                                      )
                                                    : user?.website
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {user?.website &&
                                                (() => {
                                                    const url = new URL(
                                                        user?.website.includes(
                                                            '://'
                                                        )
                                                            ? user?.website
                                                            : `https://${user?.website}`
                                                    );
                                                    return url.hostname.replace(
                                                        'www.',
                                                        ''
                                                    );
                                                })()}
                                        </a>
                                    </div>
                                )}
                                <div className={styles.joinedAt}>
                                    <FontAwesomeIcon icon={faCalendarDays} />
                                    <p>
                                        Joined {getMonthName(user?.createdAt)}{' '}
                                        {getYear(user?.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className={styles.followStatus}>
                                <NavLink to={`/follow-status/following/${id}`}>
                                    <p>
                                        {user?.followingCount
                                            ? user?.followingCount
                                            : 0}
                                        <span>Following</span>
                                    </p>
                                </NavLink>
                                <NavLink to={`/follow-status/followers/${id}`}>
                                    <p>
                                        {user?.followerCount
                                            ? user?.followerCount
                                            : 0}
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
                                {userTweets.length > 0 ? (
                                    <>
                                        {userTweets.map((tweet: any) => (
                                            <Tweet
                                                key={
                                                    tweet?._id +
                                                    tweet?.createdAt
                                                }
                                                tweet={tweet}
                                                onClickMenu={onClickTweetMenu}
                                                onClickLike={onClickLike}
                                                isLiked={tweet?.likes?.includes(
                                                    authUser?._id
                                                )}
                                                onClickRetweet={onClickRetweet}
                                                isRetweet={tweet?.retweets?.includes(authUser?._id)}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <ContentNotAvailable
                                        title={
                                            isAuthUser
                                                ? "You haven't posted any tweet yet"
                                                : `@${user?.username} hasn’t poseted any Tweet yet`
                                        }
                                        message={
                                            isAuthUser
                                                ? 'Once you do, you will find all our tweets here'
                                                : 'Once they do, those Tweets will show up here.'
                                        }
                                    />
                                )}
                            </div>
                        )}
                        {/* REPLIES - START */}
                        {activeTab === 'replies' && (
                            <div className={styles.main}>
                                {userTweetReplies.length > 0 ? (
                                    <>
                                        {userTweetReplies.map((tweet: any) => (
                                            <Tweet
                                                key={
                                                    tweet?._id +
                                                    tweet?.createdAt
                                                }
                                                tweet={tweet}
                                                onClickMenu={onClickTweetMenu}
                                                onClickLike={onClickLike}
                                                isLiked={tweet?.likes?.includes(
                                                    authUser?._id
                                                )}
                                                onClickRetweet={onClickRetweet}
                                                isRetweet={tweet?.retweets?.includes(authUser?._id)}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <ContentNotAvailable
                                        title={
                                            isAuthUser
                                                ? "You haven't replyed to any tweet"
                                                : `@${user?.username} hasn’t reply to any tweet`
                                        }
                                        message={
                                            isAuthUser
                                                ? 'All your replies will show displayed here'
                                                : 'Once they do, those Replies will show up here.'
                                        }
                                    />
                                )}
                            </div>
                        )}
                        {/* REPLIES - END */}
                        {/* MEDIA - START */}
                        {activeTab === 'media' && (
                            <div className={styles.main}>
                                {userTweetsMedia.length > 0 ? (
                                    <>
                                        {userTweetsMedia.map((tweet: any) => (
                                            <Tweet
                                                key={
                                                    tweet._id + tweet?.createdAt
                                                }
                                                tweet={tweet}
                                                onClickMenu={onClickTweetMenu}
                                                onClickLike={onClickLike}
                                                isLiked={tweet?.likes?.includes(
                                                    authUser?._id
                                                )}
                                                onClickRetweet={onClickRetweet}
                                                isRetweet={tweet?.retweets?.includes(authUser?._id)}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <ContentNotAvailable
                                        title={
                                            isAuthUser
                                                ? 'You don’t have any tweet with an image'
                                                : `@${user?.username} hasn’t Tweeted media`
                                        }
                                        message={
                                            isAuthUser
                                                ? 'All your tweets which have images will be displayed here'
                                                : 'Once they do, those Tweets will show up here.'
                                        }
                                    />
                                )}
                            </div>
                        )}
                        {/* MEDIA - END */}

                        {/* LIKES - START */}
                        {activeTab === 'likes' && (
                            <div className={styles.main}>
                                {userLikedTweets.length > 0 ? (
                                    <>
                                        {userLikedTweets.map((tweet: any) => (
                                            <Tweet
                                                key={
                                                    tweet._id + tweet?.createdAt
                                                }
                                                tweet={tweet}
                                                onClickMenu={onClickTweetMenu}
                                                onClickLike={onClickLike}
                                                isLiked={tweet?.likes?.includes(
                                                    authUser?._id
                                                )}
                                                onClickRetweet={onClickRetweet}
                                                isRetweet={tweet?.retweets?.includes(authUser?._id)}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <ContentNotAvailable
                                        title={
                                            isAuthUser
                                                ? 'You don’t have any likes yet'
                                                : `@${user?.username} hasn’t liked any Tweets`
                                        }
                                        message={
                                            isAuthUser
                                                ? 'Tap the heart on any Tweet to show it some love. When you do, it’ll show up here.'
                                                : 'When they do, those Tweets will show up here.'
                                        }
                                    />
                                )}
                            </div>
                        )}
                        {/* LIKES - END */}

                        {/* *** MAIN - END *** */}
                    </div>
                </div>
                {/* Home page - start */}
                <div className={Layout.aside}>
                    <Aside className={styles.aside}>
                        <Header border={false}>
                            <SearchBar />
                        </Header>
                        <WhoToFollow />
                    </Aside>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Profile;
