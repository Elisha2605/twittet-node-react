import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import styles from './TweetPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import XmarkIcon from '../../components/icons/XmarkIcon';
import { createReply, getTweetById, getTweetReplies } from '../../api/tweet.api';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_TWEET_BASE_URL,
    TWEET_AUDIENCE,
    TWEET_REPLY,
} from '../../constants/common.constants';
import TweetFooter from '../../components/ui/TweetFooter';
import { likeTweet } from '../../api/like.api';
import UserInfo from '../../components/ui/UserInfo';
import { tweetMenuIcons, tweetMenuOptions } from '../../data/menuOptions';
import Avatar, { Size } from '../../components/ui/Avatar';
import AuthContext from '../../context/user.context';
import FormReply from '../../components/form/FormReplyTweet';
import TweetReply from '../../components/tweet/TweetReply';
import { getAuthUserFollows } from '../../api/follow.api';
import AtIcon from '../../components/icons/AtIcon';
import UserIcon from '../../components/icons/UserIcon';
import { getUserSavedTweets, saveTweetToBookmark } from '../../api/bookmark.api';
import { useMessage } from '../../context/successMessage.context';
import { getMonth, getMonthName, getTimeAMPM, getYear } from '../../utils/helpers.utils';
import TweetFooterPage from '../../components/ui/TweetFooterPage';

interface TweetPageProps {
    onDeleteTweet: any,
    onClickTweetMenu: Function;
    onEditTweet: any;
    onClickRetweet: Function;
    isRetweet?: boolean;
    handleTextAreaOnChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TweetPage: FC<TweetPageProps> = ({ 
    onClickTweetMenu, 
    onClickRetweet, 
    onEditTweet, 
    onDeleteTweet, 
    isRetweet 
}) => {
    const [tweet, setTweet] = useState<any>();
    const [authUser, setAuthUser] = useState<any>(null);
    const [isFormFocused, setIsFormFocused] = useState(false);

    const [value, setValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const tweetTextRef = useRef<HTMLTextAreaElement>(null);
    
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
            setIsLoading(true);
            const { tweet } = await getTweetById(id!);
            setTweet(tweet[0]);
            setIsLoading(false);
        };
        getTweet();
    }, [id]);

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

    const handleSubmitTweet = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = tweetTextRef.current?.value
            ? tweetTextRef.current?.value
            : null;

        console.log(text);
        console.log(selectedFile);
        const res = await createReply(id!, text!, selectedFile);
        const { tweet }: any = res;
        console.log(tweet);
        console.log(tweet);
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
            replyCount: tweet?.replyCount +1,
        }));
        setTweetReplies((prevTweets) => [newTweet, ...prevTweets]);
        clearTweetForm();
    };

    useEffect(() => {
        const fetchAuthUserData = async () => {
            const { followers, followings } = await getAuthUserFollows();
            setFollowers(followers);
            setFollowings(followings)
        };
        fetchAuthUserData();
    }, []);

    const isTwitterCircle = (userId: string): boolean => {
        if (
            authUser && tweet &&
            tweet?.user?._id !== authUser?._id &&
            tweet?.audience === TWEET_AUDIENCE.twitterCircle &&
            !followings.some(
                (follower: any) => follower?.user?._id === userId
            )
        ) {
            return false;
        }
        return true;
    };

    const isOnlyPeopleYouFollow = (userId: string): boolean => {
        if (followers &&
            tweet?.user?._id !== authUser?._id &&
            tweet?.reply === TWEET_REPLY.peopleYouFollow &&
            followers.some((following: any) => following?.user?._id === userId)
        ) {
            return true;
        }
        return false;
    };

    const isMention = (userId: string): boolean => {
        if (
            tweet &&
            tweet.mentions &&
            tweet?.user?._id !== authUser?._id &&
            !tweet.mentions.includes(userId)
        ) {
            return false;
        }
        return true;
    };

    // bookmark
    useEffect(() => {
        const getUserBookmarkList = async () => {
            const { tweets }: any = await getUserSavedTweets();
            setSavedTweets(tweets)
        };
        getUserBookmarkList();
    }, [tweet])

    const onClickSaveAndUnsaveTweet = async () => {
        const res = await saveTweetToBookmark(tweet._id);
        if (res.message === 'Added') {
            showMessage('Tweet added to your Bookmarks', 'success');
        } else if (res.message === 'Removed') {
            showMessage('Tweet removed from Bookmarks', 'success');
        }
        const bookmarkCount = res.tweet.bookmarkCount
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

          const updatedSavedTweets = isSaved() ? savedTweets.filter((t: any) => t._id !== tweet._id) : [...savedTweets, tweet];
          setSavedTweets(updatedSavedTweets);
    }
    const isSaved = (): boolean => {
        return tweet && savedTweets.some((t: any) => t._id === tweet._id)
    }

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
   
    useEffect(() => {
        console.log(tweetReplies);
    }, [tweetReplies])

    return (
        <React.Fragment>
            {!isLoading && (
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
                                tweet?.image ?
                                `${IMAGE_TWEET_BASE_URL}/${tweet?.image}` :
                                undefined
                            }
                            alt=""
                        />
                        <div className={styles.footer}>
                            <TweetFooter
                                tweet={tweet}
                                replies={tweet?.replyCount === 0 ? '' : tweet?.replyCount}
                                reTweets={tweet?.retweetCount === 0 ? '' : tweet?.retweetCount}
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
                                    <span>{getTimeAMPM(tweet?.createdAt)}</span> · <span>
                                        {getMonthName(tweet?.createdAt)}{' '} 
                                        {getMonth(tweet?.createdAt)}, {' '} 
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
                                            <span>{tweet?.retweetCount}</span>Retweets
                                        </p>
                                    )}{' '}
                                    {tweet?.totalLikes > 0 && (
                                        <p>
                                            <span>
                                                {tweet?.totalLikes}
                                            </span>
                                            Likes
                                        </p>
                                    )}
                                    {tweet?.bookmarkCount > 0 && (
                                            <p>
                                                <span>{tweet?.bookmarkCount}</span>Bookmarks
                                            </p>
                                    )}
                                </div>
                                <div className={styles.tweetFooterSide}>
                                <TweetFooterPage
                                    tweet={tweet}
                                    replies={tweet?.replyCount === 0 ? '' : tweet?.replyCount}
                                    reTweets={tweet?.retweetCount === 0 ? '' : tweet?.retweetCount}
                                    likes={
                                        tweet?.totalLikes > 0 ? tweet?.totalLikes : ''
                                    }
                                    views={tweet?.viewCount > 0 ? tweet?.viewCount : ''}
                                    onClickRetweet={onClickRetweet}
                                    onClick={onClickLike}
                                    isRetweet={tweet?.retweets?.includes(authUser?._id)}
                                    isLiked={tweet?.likes?.includes(authUser?._id)}
                                    isSaved={isSaved}
                                    onClickBookmark={onClickSaveAndUnsaveTweet}
                                />
                                </div>
                                {isOnlyPeopleYouFollow(tweet?.user?._id) &&
                                tweet?.reply === TWEET_REPLY.peopleYouFollow ? (
                                    <>
                                        <div className={styles.formSection}>
                                            <Avatar
                                                path={
                                                    authUser?.avatar
                                                        ? `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`
                                                        : undefined
                                                }
                                                size={Size.small}
                                                className={''}
                                            />
                                            <FormReply
                                                tweet={tweet}
                                                value={value}
                                                tweetTextRef={tweetTextRef}
                                                imagePreview={previewImage}
                                                isFocused={isFormFocused}
                                                setIsFocused={setIsFormFocused}
                                                onSubmit={handleSubmitTweet}
                                                onImageUpload={
                                                    handleImageUploadRepy
                                                }
                                                onCancelImagePreview={
                                                    handleCanselPreviewImage
                                                }
                                                onChageReplyTextArea={
                                                    handleTextAreaOnChangeReply
                                                }
                                                isLoading={isLoading}
                                            />
                                        </div>
                                    </>
                                ) : isMention(tweet && authUser?._id) &&
                                tweet?.reply ===
                                    TWEET_REPLY.onlyPeopleYouMention ? (
                                    <>
                                        <div className={styles.formSection}>
                                            <Avatar
                                                path={
                                                    authUser?.avatar
                                                        ? `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`
                                                        : undefined
                                                }
                                                size={Size.small}
                                                className={''}
                                            />
                                            <FormReply
                                                tweet={tweet}
                                                value={value}
                                                tweetTextRef={tweetTextRef}
                                                imagePreview={previewImage}
                                                isFocused={isFormFocused}
                                                setIsFocused={setIsFormFocused}
                                                onSubmit={handleSubmitTweet}
                                                onImageUpload={
                                                    handleImageUploadRepy
                                                }
                                                onCancelImagePreview={
                                                    handleCanselPreviewImage
                                                }
                                                onChageReplyTextArea={
                                                    handleTextAreaOnChangeReply
                                                }
                                                isLoading={isLoading}
                                            />
                                        </div>
                                    </>
                                ) : isTwitterCircle(tweet && tweet?.user?._id) &&
                                tweet?.audience ===
                                    TWEET_AUDIENCE.twitterCircle ? (
                                    <>
                                        <div className={styles.formSection}>
                                            <Avatar
                                                path={
                                                    authUser?.avatar
                                                        ? `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`
                                                        : undefined
                                                }
                                                size={Size.small}
                                                className={''}
                                            />
                                            <FormReply
                                                tweet={tweet}
                                                value={value}
                                                tweetTextRef={tweetTextRef}
                                                imagePreview={previewImage}
                                                isFocused={isFormFocused}
                                                setIsFocused={setIsFormFocused}
                                                onSubmit={handleSubmitTweet}
                                                onImageUpload={
                                                    handleImageUploadRepy
                                                }
                                                onCancelImagePreview={
                                                    handleCanselPreviewImage
                                                }
                                                onChageReplyTextArea={
                                                    handleTextAreaOnChangeReply
                                                }
                                                isLoading={isLoading}
                                            />
                                        </div>
                                    </>
                                ) : !isOnlyPeopleYouFollow(tweet?.user?._id) &&
                                tweet?.reply === TWEET_REPLY.peopleYouFollow ? (
                                    <>
                                        <div className={styles.whoCanReply}>
                                            <div className={styles.replyMsgWrapper}>
                                                <UserIcon isMedium={true} />
                                                <div className={styles.replyMsg}>
                                                    <h4>Who can reply?</h4>
                                                    <p>
                                                        People @
                                                        {tweet?.user?.username}{' '}
                                                        follows can reply
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : !isMention(tweet && authUser?._id) &&
                                tweet?.reply ===
                                    TWEET_REPLY.onlyPeopleYouMention ? (
                                    <>
                                        <div className={styles.whoCanReply}>
                                            <div className={styles.replyMsgWrapper}>
                                                <AtIcon isMedium={true} />
                                                <div className={styles.replyMsg}>
                                                    <h4>Who can reply?</h4>
                                                    <p>
                                                        People @
                                                        {tweet?.user?.username}{' '}
                                                        mentioned can reply
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : isLoading && !isTwitterCircle(tweet && tweet?.user?._id) &&
                                tweet?.audience ===
                                    TWEET_AUDIENCE.twitterCircle ? (
                                    <>
                                        <div className={styles.whoCanReply}>
                                            <div className={styles.replyMsgWrapper}>
                                                <AtIcon isMedium={true} />
                                                <div className={styles.replyMsg}>
                                                    <h4>Who can reply?</h4>
                                                    <p>
                                                        People in Twitter Circle who follow @
                                                        {tweet?.user?.username}{' '} 
                                                        can reply
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.formSection}>
                                            <Avatar
                                                path={
                                                    authUser?.avatar
                                                        ? `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`
                                                        : undefined
                                                }
                                                size={Size.small}
                                                className={''}
                                            />
                                            <FormReply
                                                tweet={tweet}
                                                value={value}
                                                tweetTextRef={tweetTextRef}
                                                imagePreview={previewImage}
                                                isFocused={isFormFocused}
                                                setIsFocused={setIsFormFocused}
                                                onSubmit={handleSubmitTweet}
                                                onImageUpload={
                                                    handleImageUploadRepy
                                                }
                                                onCancelImagePreview={
                                                    handleCanselPreviewImage
                                                }
                                                onChageReplyTextArea={
                                                    handleTextAreaOnChangeReply
                                                }
                                                isLoading={isLoading}
                                            />
                                        </div>
                                    </>
                                )}
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
                                    isLiked={tweet?.likes?.includes(
                                        authUser?._id
                                    )}
                                    onClickRetweet={onClickRetweet}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default TweetPage;