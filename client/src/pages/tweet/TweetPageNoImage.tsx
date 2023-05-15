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
    TWEET_AUDIENCE,
    TWEET_MENU,
    TWEET_REPLY,
} from '../../constants/common.constants';
import AuthContext from '../../context/user.context';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBookmark,
    faComment,
    faHeart,
} from '@fortawesome/free-regular-svg-icons';
import {
    faArrowUpFromBracket,
    faRepeat,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import UserInfo from '../../components/ui/UserInfo';
import { getTweetById, getUserTweets } from '../../api/tweet.api';
import { tweetMenuIcons, tweetMenuOptions } from '../../data/menuOptions';
import Avatar, { Size } from '../../components/ui/Avatar';
import FormReply from '../../components/form/FormReplyTweet';
import TweetReply from '../../components/tweet/TweetReply';
import { likeTweet } from '../../api/like.api';
import { createTweetReply, getAllTweetReplies } from '../../api/reply.api';
import { getAuthUserFollows } from '../../api/follow.api';
import UserIcon from '../../components/icons/UserIcon';
import AtIcon from '../../components/icons/AtIcon';

interface TweetPageNoImageProps {}

const TweetPageNoImage: FC<TweetPageNoImageProps> = ({}) => {
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
        setLikedTweet(likedTweet);
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
        e.preventDefault();
        const text = tweetTextRef.current?.value
            ? tweetTextRef.current?.value
            : null;

        console.log(text);
        console.log(selectedFile);
        const res = await createTweetReply(id!, text!, selectedFile);
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
            comments: [],
            reposts: [],
            likes: [],
        };
        setTweetReplies((prevTweets) => [newTweet, ...prevTweets]);
        clearTweetForm();
    };

    // Update Likes state
    useEffect(() => {
        setTweet((prev: any) => ({
            ...prev,
            totalLikes: likedTweet?.likesCount,
            likes: likedTweet?.likes,
        }));
    }, [likedTweet]);

    const isTwitterCircle = (userId: string): boolean => {
        console.log(userId);
        if (
            authUser && tweet &&
            tweet?.user?._id !== authUser?._id &&
            tweet?.audience === TWEET_AUDIENCE.twitterCircle &&
            !followers.some(
                (follower: any) => follower?.user?._id === userId
            )
        ) {
            return false;
        }
        return true;
    };

    useEffect(() => {
        const fetchAuthUserData = async () => {
            const { followers } = await getAuthUserFollows();
            setFollowers(followers);

        };
        fetchAuthUserData();
    }, []);

    const isOnlyPeopleYouFollow = (userId: string): boolean => {
        if (
            tweet?.user?._id !== authUser?._id &&
            tweet?.reply === TWEET_REPLY.peopleYouFollow &&
            !followers.some((following: any) => following?.user?._id === userId)
        ) {
            return false;
        }
        return true;
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
                                    onClickOption={handleTweetMenuOptionClick}
                                />
                                <div className={styles.asideContent}>
                                    <div className={styles.text}>
                                        {tweet?.text}
                                    </div>
                                    <div className={styles.info}>
                                        <span>9:15 PM</span> ·{' '}
                                        <span>May 5, 2023</span> ·{' '}
                                        <p>
                                            <span>1.2M </span>Views
                                        </p>
                                    </div>
                                    <div className={styles.stats}>
                                        <p>
                                            <span>332</span>Retweets
                                        </p>{' '}
                                        <p>
                                            <span>61</span>Quotes
                                        </p>{' '}
                                        {tweet?.totalLikes > 0 && (
                                            <p>
                                                <span>
                                                    {tweet?.totalLikes > 0
                                                        ? tweet?.totalLikes
                                                        : ''}
                                                </span>
                                                Likes
                                            </p>
                                        )}{' '}
                                        <p>
                                            <span>332</span>Bookmarks
                                        </p>
                                    </div>
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
                                        <div>
                                            <FontAwesomeIcon
                                                icon={faBookmark}
                                                className={styles.faBookmark}
                                            />
                                        </div>
                                        <div>
                                            <FontAwesomeIcon
                                                icon={faArrowUpFromBracket}
                                                className={
                                                    styles.faArrowUpFromBracket
                                                }
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
                                                            People @
                                                            {tweet?.user?.username}{' '} 
                                                            follow in the Twitter Circle can reply
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

export default TweetPageNoImage;
