import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import Aside from '../../components/aside/Aside';
import SearchBar from '../../components/ui/SearchBar';
import WhoToFollow from '../../components/ui/WhoToFollow';
import Header from '../../components/header/Header';
import styles from './TweetPageNoImage.module.css';
import Layout from '../../Layout.module.css';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import HeaderTitle from '../../components/header/HeaderTitle';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_TWEET_BASE_URL,
    TWEET_AUDIENCE,
    TWEET_REPLY,
} from '../../constants/common.constants';
import AuthContext from '../../context/user.context';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserInfo from '../../components/ui/UserInfo';
import { reply, getTweetById, getTweetReplies } from '../../api/tweet.api';
import { tweetMenuIcons, tweetMenuOptions } from '../../data/menuOptions';
import FormReply from '../../components/form/FormReplyTweet';
import { likeTweet } from '../../api/like.api';
import { getAuthUserFollows } from '../../api/follow.api';
import Tweet from '../../components/tweet/Tweet';
import { getUserSavedTweets, saveTweetToBookmark } from '../../api/bookmark.api';
import { getMonth, getMonthName, getTimeAMPM, getYear } from '../../utils/helpers.utils';
import TweetFooterPage from '../../components/ui/TweetFooterPage';
import TweetReplyFormSection from '../../components/tweet/TweetReplyFormSection';

interface TweetPageNoImageProps {
    onClickTweetMenu: Function;
    onEditTweet: any;
    onDeleteTweet: any;
    onClickRetweet: Function;
}

const TweetPageNoImage: FC<TweetPageNoImageProps> = ({
    onClickTweetMenu, 
    onEditTweet, 
    onDeleteTweet, 
    onClickRetweet
}) => {
    const { id } = useParams<{ id: string }>();

    const [tweet, setTweet] = useState<any>();
    const [likedTweet, setLikedTweet] = useState<any>();
    const [authUser, setAuthUser] = useState<any>(null);
    const [isFormFocused, setIsFormFocused] = useState(false);

    const [value, setValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const tweetTextRef = useRef<HTMLTextAreaElement>(null);

    const [tweetReplies, setTweetReplies] = useState<any[]>([]);

    const [followers, setFollowers] = useState<any>([]);
    const [followings, setFollowings] = useState<any>([]);

    const [savedTweets, setSavedTweets] = useState<any>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOnSubmitLoading, setIsOnSubmitLoading] = useState<boolean>(false);

    const imgRef = useRef<HTMLImageElement>(null);

    const navigate = useNavigate();

     // get Auth user
     const ctx = useContext(AuthContext);

     useEffect(() => {
     const fetchTweetAndReplies = async () => {
        setIsLoading(true);
        const { user } = ctx.getUserContext();
        const { tweet } = await getTweetById(id!);
        setTweet(tweet[0]);
        setAuthUser(user);
        setIsLoading(false);
        if (user) {
            const res = await getTweetReplies(id!);
            const { tweets } = res;
            setTweetReplies(tweets);
        }

     };
        fetchTweetAndReplies();
     }, [id]);

    const handleImageLoad = () => {
        if (imgRef.current) {
          // Check if the image height exceeds the threshold
          if (imgRef.current.offsetHeight > 200) { // Set your desired threshold here
            // Add the 'imageFixedHeight' class to limit the image height
            const parentElement = imgRef.current.parentNode as HTMLElement;
            parentElement.classList.add(styles.imageFixedHeight);
          }
        }
    };

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
            image: tweet.image,
            bookmarkCount: tweet.boomarkCount,
            comments: [],
            reposts: [],
            likes: [],
        };
        setTweetReplies((prevTweets) => [newTweet, ...prevTweets]);
        setIsFormFocused(false);
        clearTweetForm();
        setIsOnSubmitLoading(false);
    };

    useEffect(() => {
        const fetchAuthUserFollowStatus = async () => {
            const { followers, followings } = await getAuthUserFollows();
            setFollowers(followers);
            setFollowings(followings)
        };
        fetchAuthUserFollowStatus();
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

    return (
        <React.Fragment>
            {!isLoading && (

                <div className={Layout.mainSectionContainer}>
                    <div className={Layout.mainSection}>
                        {/* *** HEADER - START *** */}
                        <Header border={true}>
                            <div className={styles.headerItems}>
                                <ArrowLeftIcon
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                    className={styles.arrowLeftIcon}
                                />
                                <HeaderTitle
                                    title={'Tweet'}
                                    className={styles.title}
                                />
                            </div>
                        </Header>
                        {/* *** HEADER - END *** */}

                        <div className={styles.main}>
                            {/* *** MAIN - START *** */}
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
                                        <div className={styles.text}>
                                            {tweet?.text}
                                        </div>
                                        {tweet?.image && (
                                            <div 
                                                className={styles.image}
                                                onClick={(e: any) => {
                                                    e.stopPropagation();
                                                    navigate(`/tweet/image/${tweet._id}`);
                                                }
                                            }>
                                                <img
                                                    ref={imgRef}
                                                    src={
                                                        tweet?.image
                                                            ? `${IMAGE_TWEET_BASE_URL}/${tweet?.image}`
                                                            : undefined
                                                    }
                                                    alt=""
                                                    onLoad={handleImageLoad}
                                                />
                                            </div>
                                        )}
                                        <div className={styles.info}>
                                            <span>{getTimeAMPM(tweet?.createdAt)}</span> ·{' '}
                                            <span>{getTimeAMPM(tweet?.createdAt)}</span> · <span>
                                                {getMonthName(tweet?.createdAt)}{' '} 
                                                {getMonth(tweet?.createdAt)}, {' '} 
                                                {getYear(tweet?.createdAt)}
                                            </span> {' '}
                                        </div>
                                        <div className={styles.stats}>
                                            {tweet?.retweetCount > 0 && (    
                                                <p>
                                                    <span>{tweet?.retweetCount}</span>Retweets
                                                </p>
                                            )}{' '}
                                            {tweet?.viewCount > 0 && (
                                                    <p>
                                                        <span>{tweet?.viewCount}</span> Views
                                                    </p>
                                            )}{' '}
                                            {tweet?.totalLikes > 0 && (
                                                <p>
                                                    <span>
                                                        {tweet?.totalLikes}
                                                    </span>
                                                    Likes
                                                </p>
                                            )}{' '}
                                            {tweet?.bookmarkCount > 0 && (
                                                <p>
                                                    <span>{tweet?.bookmarkCount}</span>Bookmarks
                                                </p>
                                            )}
                                        </div>
                                        <div className={styles.tweetFooter}>
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
                                                ClassNameShowUserMentions={styles.showUserMentions}
                                            />
                                        </TweetReplyFormSection>
                                        {/*  */}
                                    </div>
                                </div>
                                {tweetReplies.map((tweet: any) => (
                                    <div
                                        className={styles.asideReplySection}
                                        key={tweet?._id}
                                    >
                                        <Tweet
                                            key={tweet?._id}
                                            tweet={tweet}
                                            onClickMenu={onClickTweetMenu}
                                            onClickLike={onClickReplyLike}
                                            isLiked={tweet?.likes?.includes(
                                                authUser?._id
                                            )}
                                            onClickRetweet={onClickRetweet}
                                            isRetweet={tweet?.retweets?.includes(authUser?._id)}
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* *** MAIN - END *** */}
                        </div>
                    </div>
                    {/* Home page - start */}
                    <div className={Layout.aside}>
                        <Aside className={styles.aside}>
                        <Header border={false}>
                            <SearchBar width={74} />
                        </Header>
                            <WhoToFollow />
                        </Aside>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default TweetPageNoImage;
