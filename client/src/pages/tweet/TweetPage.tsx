import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import styles from './TweetPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import XmarkIcon from '../../components/icons/XmarkIcon';
import { reply, getTweetById, getTweetReplies } from '../../api/tweet.api';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_TWEET_BASE_URL,
    MAX_TWEET_CHARACTERS,
    TWEET_AUDIENCE,
    TWEET_REPLY,
} from '../../constants/common.constants';
import TweetFooter from '../../components/ui/TweetFooter';
import { likeTweet } from '../../api/like.api';
import UserInfo from '../../components/ui/UserInfo';
import { tweetMenuIcons, tweetMenuOptions } from '../../data/menuOptions';
import AuthContext from '../../context/user.context';
import FormReply from '../../components/form/FormReplyTweet';
import TweetReply from '../../components/tweet/TweetReply';
import { getAuthUserFollows } from '../../api/follow.api';
import {
    getUserSavedTweets,
    saveTweetToBookmark,
} from '../../api/bookmark.api';
import { useMessage } from '../../context/successMessage.context';
import {
    getMonth,
    getMonthName,
    getTimeAMPM,
    getYear,
} from '../../utils/helpers.utils';
import TweetFooterPage from '../../components/ui/TweetFooterPage';
import TweetReplyFormSection from '../../components/tweet/TweetReplyFormSection';

interface TweetPageProps {
    onDeleteTweet: any;
    onClickTweetMenu: Function;
    onEditTweet: any;
    onClickRetweet: Function;
    handleTextAreaOnChange?: (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => void;
}

const TweetPage: FC<TweetPageProps> = ({
    onClickTweetMenu,
    onClickRetweet,
    onEditTweet,
    onDeleteTweet,
}) => {
    const [tweet, setTweet] = useState<any>();
    const [authUser, setAuthUser] = useState<any>(null);
    const [isFormFocused, setIsFormFocused] = useState(false);
    const [value, setValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const tweetTextRef = useRef<HTMLTextAreaElement>(null);
    const [isOnSubmitLoading, setIsOnSubmitLoading] = useState<boolean>(false);
    const [tweetReplies, setTweetReplies] = useState<any[]>([]);
    const [followers, setFollowers] = useState<any>([]);
    const [followings, setFollowings] = useState<any>([]);
    const [savedTweets, setSavedTweets] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const previousPath = localStorage.getItem('active-nav');
    const goBack = () => {
        navigate(`/${previousPath}`);
    };
    const [likedTweet, setLikedTweet] = useState<any>();

    const { id } = useParams<{ id: string }>();

    const { showMessage } = useMessage();

    const navigate = useNavigate();

    // get Auth user
    const ctx = useContext(AuthContext);
    const fetchTweetReplies = async () => {
        const { user } = ctx.getUserContext();
        setAuthUser(user);
        if (user) {
            const res = await getTweetReplies(id!);
            const { tweets } = res;
            setTweetReplies(tweets);
        }
    };

    useEffect(() => {
        fetchTweetReplies();
    }, [id]);

    // get Tweet by ID
    useEffect(() => {
        const getTweet = async () => {
            const { tweet } = await getTweetById(id!);
            setTweet(tweet[0]);
        };
        getTweet();
    }, [id]);

    useEffect(() => {
        const fetchAuthUserFollowStatus = async () => {
            setIsLoading(true);
            const { followers, followings } = await getAuthUserFollows();
            setFollowers(followers);
            setFollowings(followings);
            setIsLoading(false);
        };
        fetchAuthUserFollowStatus();
    }, []);

    // On like tweet
    const onClickLike = async () => {
        const res: any = await likeTweet(tweet?._id);
        const { likedTweet } = res;
        setTweet((prev: any) => ({
            ...prev,
            totalLikes: likedTweet?.likesCount,
            likes: likedTweet?.likes,
        }));
    };

    const onClickReplyLike = async (replyId: any) => {
        const res: any = await likeTweet(replyId?._id);
        const { likedTweet } = res;
        setLikedTweet(likedTweet);
    };

    useEffect(() => {
        setTweetReplies((prevTweets: any) =>
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

    const handleTextAreaOnChangeReply = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const val = e.target?.value;
        setValue(val);
    };
    const handleImageUploadRepy = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
            let imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const handleCanselPreviewImage = () => {
        setPreviewImage('');
        setSelectedFile(null);
    };

    const clearTweetForm = () => {
        setValue('');
        setPreviewImage('');
        setSelectedFile(null);
    };

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsOnSubmitLoading(true);
        const text = tweetTextRef.current?.value
            ? tweetTextRef.current?.value
            : null;
        const res = await reply(id!, text!, selectedFile);
        
        if (text?.length! > MAX_TWEET_CHARACTERS) {
            showMessage('Could not send your tweet', 'error');
            setIsOnSubmitLoading(false);
            return;
        }

        if (res.success) {
            showMessage('Your tweet was sent', 'success')
        }

        const { tweet }: any = res;
        const newTweet = {
            _id: tweet._id,
            text: tweet.text,
            user: {
                _id: authUser._id,
                avatar: authUser.avatar,
                name: authUser.name,
                username: authUser.username,
                isVerified: authUser.isVerified,
            },
            audience: tweet.audience,
            reply: tweet.reply,
            createdAt: tweet.createdAt,
            image: tweet?.image,
            comments: [],
            reposts: [],
            likes: [],
        };
        setTweet((prev: any) => ({
            ...prev,
            replyCount: tweet?.replyCount + 1,
        }));
        setTweetReplies((prevTweets) => [newTweet, ...prevTweets]);
        setIsFormFocused(false);
        clearTweetForm();
        setIsOnSubmitLoading(false);
    };

    // bookmark
    useEffect(() => {
        const getUserBookmarkList = async () => {
            const { tweets }: any = await getUserSavedTweets();
            setSavedTweets(tweets);
        };
        getUserBookmarkList();
    }, [tweet]);

    const onClickSaveAndUnsaveTweet = async () => {
        const res = await saveTweetToBookmark(tweet._id);
        if (res.message === 'Added') {
            showMessage('Tweet added to your Bookmarks', 'success');
        } else if (res.message === 'Removed') {
            showMessage('Tweet removed from Bookmarks', 'success');
        }
        const bookmarkCount = res.tweet.bookmarkCount;
        if (bookmarkCount === undefined) {
            setTweet((prevTweet: any) => ({
                ...prevTweet,
                bookmarkCount: prevTweet.bookmarkCount - 1,
            }));
        } else {
            setTweet((prevTweet: any) => ({
                ...prevTweet,
                bookmarkCount: bookmarkCount + 1,
            }));
        }

        const updatedSavedTweets = isSaved()
            ? savedTweets.filter((t: any) => t._id !== tweet._id)
            : [...savedTweets, tweet];
        setSavedTweets(updatedSavedTweets);
    };
    const isSaved = (): boolean => {
        return tweet && savedTweets.some((t: any) => t._id === tweet._id);
    };

    useEffect(() => {
        const handleEditReply = () => {
            if (authUser) {
                setTweetReplies((prevTweets: any) =>
                    prevTweets.map((tweet: any) =>
                        tweet?._id === onEditTweet?._id
                            ? { ...tweet, ...onEditTweet }
                            : tweet
                    )
                );
            }
        };
        handleEditReply();
    }, [onEditTweet]);

    useEffect(() => {
        setTweetReplies((preveState) =>
            preveState.filter((tweet) => tweet._id !== onDeleteTweet._id)
        );
    }, [onDeleteTweet]);

    const isOnlyPeopleYouFollow = (userId: string): boolean => {
        return (
            (followers && tweet && tweet?.user?._id === authUser?._id) ||
            (followers &&
                tweet &&
                tweet?.reply === TWEET_REPLY.peopleYouFollow &&
                followers.some(
                    (following: any) => following?.user?._id === userId
                ))
        );
    };

    const isMention = (userId: string): boolean => {
        if (
            tweet &&
            tweet?.mentions &&
            tweet?.user?._id !== authUser?._id &&
            !tweet?.mentions.includes(userId)
        ) {
            return false;
        }
        return true;
    };

    const isTwitterCircle = (userId: string): boolean => {
        if (
            authUser &&
            tweet &&
            tweet?.user?._id !== authUser?._id &&
            tweet?.audience === TWEET_AUDIENCE.twitterCircle &&
            !followings.some((follower: any) => follower?.user?._id === userId)
        ) {
            return false;
        }
        return true;
    };

    return (
        <React.Fragment>
            <div className={styles.container}>
                <div
                    className={styles.overlay}
                    onClick={() => {
                        goBack();
                        clearTweetForm();
                    }}
                ></div>
                <XmarkIcon
                    className={styles.canselBtn}
                    size={'xl'}
                    onClick={() => {
                        goBack();
                        clearTweetForm();
                    }}
                />
                <div className={styles.image}>
                    <img
                        src={
                            tweet?.image
                                ? `${IMAGE_TWEET_BASE_URL}/${tweet?.image}`
                                : undefined
                        }
                        alt=""
                    />
                    <div className={styles.footer}>
                        <TweetFooter
                            tweet={tweet}
                            replies={
                                tweet?.replyCount === 0 ? '' : tweet?.replyCount
                            }
                            reTweets={
                                tweet?.retweetCount === 0
                                    ? ''
                                    : tweet?.retweetCount
                            }
                            likes={
                                tweet?.totalLikes > 0 ? tweet?.totalLikes : ''
                            }
                            views={tweet?.viewCount > 0 ? tweet?.viewCount : ''}
                            onClickRetweet={onClickRetweet}
                            onClick={onClickLike}
                            isRetweet={tweet?.retweets?.includes(authUser?._id)}
                            isLiked={tweet?.likes?.includes(authUser?._id)}
                        />
                    </div>
                </div>
                <div className={styles.aside}>
                    <div className={styles.asideUpperSectionWrapper}>
                        <UserInfo
                            userId={tweet?.user?._id}
                            tweet={tweet}
                            avatar={
                                tweet?.user?.avatar
                                    ? `${IMAGE_AVATAR_BASE_URL}/${tweet?.user?.avatar}`
                                    : undefined
                            }
                            name={tweet?.user?.name}
                            username={tweet?.user?.username}
                            isVerified={tweet?.user?.isVerified}
                            className={styles.userInfo}
                            options={tweetMenuOptions}
                            icons={tweetMenuIcons}
                        />
                        <div className={styles.asideContent}>
                            <div className={styles.text}>{tweet?.text}</div>
                            <div className={styles.info}>
                                <span>{getTimeAMPM(tweet?.createdAt)}</span> ·{' '}
                                <span>
                                    {getMonthName(tweet?.createdAt)}{' '}
                                    {getMonth(tweet?.createdAt)},{' '}
                                    {getYear(tweet?.createdAt)}
                                </span>{' '}
                                ·
                                {tweet?.viewCount > 0 && (
                                    <p>
                                        <span>{tweet?.viewCount}</span> Views
                                    </p>
                                )}{' '}
                            </div>
                            <div className={styles.stats}>
                                {tweet?.retweetCount > 0 && (
                                    <p>
                                        <span>{tweet?.retweetCount}</span>
                                        Retweets
                                    </p>
                                )}{' '}
                                {tweet && (
                                    <p>
                                        <span>{tweet?.totalLikes}</span>
                                        Likes
                                    </p>
                                )}
                                {tweet?.bookmarkCount > 0 && (
                                    <p>
                                        <span>{tweet?.bookmarkCount}</span>
                                        Bookmarks
                                    </p>
                                )}
                            </div>
                            <div className={styles.tweetFooterSide}>
                                <TweetFooterPage
                                    tweet={tweet}
                                    replies={
                                        tweet?.replyCount === 0
                                            ? ''
                                            : tweet?.replyCount
                                    }
                                    reTweets={
                                        tweet?.retweetCount === 0
                                            ? ''
                                            : tweet?.retweetCount
                                    }
                                    likes={
                                        tweet?.totalLikes > 0
                                            ? tweet?.totalLikes
                                            : ''
                                    }
                                    views={
                                        tweet?.viewCount > 0
                                            ? tweet?.viewCount
                                            : ''
                                    }
                                    onClickRetweet={onClickRetweet}
                                    onClick={onClickLike}
                                    isRetweet={tweet?.retweets?.includes(
                                        authUser?._id
                                    )}
                                    isLiked={tweet?.likes?.includes(
                                        authUser?._id
                                    )}
                                    isSaved={isSaved}
                                    onClickBookmark={onClickSaveAndUnsaveTweet}
                                />
                            </div>
                            {/* Form Section  */}
                            <TweetReplyFormSection
                                tweet={tweet}
                                authUser={authUser}
                                isOnlyPeopleYouFollow={isOnlyPeopleYouFollow}
                                isMention={isMention}
                                isTwitterCircle={isTwitterCircle}
                                isLoading={isLoading}
                            >
                                <FormReply
                                    tweet={tweet}
                                    value={value}
                                    tweetTextRef={tweetTextRef}
                                    imagePreview={previewImage}
                                    isFocused={isFormFocused}
                                    setIsFocused={setIsFormFocused}
                                    onSubmit={handleSubmitReply}
                                    onImageUpload={handleImageUploadRepy}
                                    onCancelImagePreview={handleCanselPreviewImage}
                                    onChageReplyTextArea={handleTextAreaOnChangeReply}
                                    isLoading={isOnSubmitLoading}
                                />
                            </TweetReplyFormSection>
                        </div>
                    </div>
                    {tweetReplies.map((tweet: any) => (
                        <div
                            className={styles.asideReplySection}
                            key={tweet?._id}
                        >
                            <TweetReply
                                key={tweet?._id}
                                tweet={tweet}
                                onClickMenu={onClickTweetMenu}
                                onClickLike={onClickReplyLike}
                                isReply={true}
                                isLiked={tweet?.likes?.includes(authUser?._id)}
                                onClickRetweet={onClickRetweet}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};

export default TweetPage;
