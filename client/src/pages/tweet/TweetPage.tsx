import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import styles from './TweetPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import XmarkIcon from '../../components/icons/XmarkIcon';
import { getTweetById } from '../../api/tweet.api';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_TWEET_BASE_URL,
    TWEET_AUDIENCE,
    TWEET_MENU,
    TWEET_REPLY,
} from '../../constants/common.constants';
import TweetFooter from '../../components/ui/TweetFooter';
import { likeTweet } from '../../api/like.api';
import UserInfo from '../../components/ui/UserInfo';
import { tweetMenuIcons, tweetMenuOptions } from '../../data/menuOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBookmark as faBookmarkRegular,
    faComment,
    faHeart,
} from '@fortawesome/free-regular-svg-icons';
import {
    faBookmark as faBookmarkSolid,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import {
    faArrowUpFromBracket,
    faRepeat,
} from '@fortawesome/free-solid-svg-icons';
import Avatar, { Size } from '../../components/ui/Avatar';
import AuthContext from '../../context/user.context';
import FormReply from '../../components/form/FormReplyTweet';
import TweetReply from '../../components/tweet/TweetReply';
import { createTweetReply, getAllTweetReplies } from '../../api/reply.api';
import { getAuthUserFollows } from '../../api/follow.api';
import AtIcon from '../../components/icons/AtIcon';
import UserIcon from '../../components/icons/UserIcon';
import { getUserSavedTweets, saveTweetToBookmark } from '../../api/bookmark.api';

interface TweetPageProps {}

const TweetPage: FC<TweetPageProps> = ({}) => {
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

    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    // get Auth user
    const ctx = useContext(AuthContext);
    const getTweetReplies = async () => {
        const { user } = ctx.getUserContext();
        setAuthUser(user);

        if (user) {
            const res = await getAllTweetReplies(id!);
            const { tweets } = res;
            setTweetReplies(tweets);
        }
    };

    useEffect(() => {
        getTweetReplies();
    }, [id]);

    // get Tweet by ID
    useEffect(() => {
        const getTweet = async () => {
            const { tweet } = await getTweetById(id!);
            setTweet(tweet[0]);
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

    const handleTweetMenuOptionClick = async (
        option: string,
        tweetId: string,
        tweet: any
    ) => {
        if (option === TWEET_MENU.delete) {
            console.log('hello');
        } else if (option === TWEET_MENU.edit) {
        }
    };

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
        setIsLoading(true);
        e.preventDefault();
        const text = tweetTextRef.current?.value
            ? tweetTextRef.current?.value
            : null;

        console.log(text);
        console.log(selectedFile);
        const res = await createTweetReply(id!, text!, selectedFile);
        const { tweet }: any = res;
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
        setIsLoading(false);
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
            console.log(tweets);
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
                            tweet?.image ?
                            `${IMAGE_TWEET_BASE_URL}/${tweet?.image}` :
                            undefined
                        }
                        alt=""
                    />
                    <div className={styles.footer}>
                        <TweetFooter
                            replies={tweet?.replyCount === 0 ? '' : tweet?.replyCount}
                            retTweets={''}
                            likes={
                                tweet?.totalLikes > 0 ? tweet?.totalLikes : ''
                            }
                            views={''}
                            onClick={onClickLike}
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
                            onClickOption={handleTweetMenuOptionClick}
                        />
                        <div className={styles.asideContent}>
                            <div className={styles.text}>{tweet?.text}</div>
                            <div className={styles.info}>
                                <span>9:15 PM</span> · <span>May 5, 2023</span>{' '}
                                ·{' '}
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
                                <p>
                                    <span>61</span>Quotes
                                </p>{' '}
                                {tweet?.totalLikes > 0 && (
                                    <p>
                                        <span>
                                            {tweet?.totalLikes}
                                        </span>
                                        Likes
                                    </p>
                                )}
                            </div>
                            {tweet?.bookmarkCount > 0 && (
                                <div className={styles.bookmarks}>
                                    <p>
                                        <span>{tweet?.bookmarkCount}</span>Bookmarks
                                    </p>
                                </div>
                            )}
                            <div className={styles.icons}>
                                <div>
                                    <FontAwesomeIcon
                                        icon={faComment}
                                        className={styles.faComment}
                                    />
                                </div>
                                <FontAwesomeIcon
                                    icon={faRepeat}
                                    className={styles.faRepeat}
                                />
                                <div onClick={onClickLike}>
                                    <FontAwesomeIcon
                                        icon={
                                            tweet?.likes?.includes(
                                                authUser?._id
                                            )
                                                ? faHeartSolid
                                                : faHeart
                                        }
                                        className={styles.faHeart}
                                        color={
                                            tweet?.likes?.includes(
                                                authUser?._id
                                            )
                                                ? 'var(--color-pink)'
                                                : ''
                                        }
                                    />
                                </div>
                                <div onClick={onClickSaveAndUnsaveTweet}>
                                    <FontAwesomeIcon
                                        icon={isSaved() ? faBookmarkSolid : faBookmarkRegular}
                                        color={isSaved() ? 'var(--color-primary)': ''}
                                        className={`${styles.faBookmark}`}
                                    />
                                </div>
                                <div>
                                    <FontAwesomeIcon
                                        icon={faArrowUpFromBracket}
                                        className={styles.faArrowUpFromBracket}
                                    />
                                </div>
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
                                            onChageImage={
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
                                            onChageImage={
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
                                            onChageImage={
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
                            ) : !isTwitterCircle(tweet && tweet?.user?._id) &&
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
                                            onChageImage={
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
                                onClickMenu={() => {}}
                                onClickLike={onClickLike}
                                isReply={true}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};

export default TweetPage;