import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import styles from './TweetPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import XmarkIcon from '../../components/icons/XmarkIcon';
import { getTweetById, getUserTweets } from '../../api/tweet.api';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_TWEET_BASE_URL,
    TWEET_MENU,
} from '../../constants/common.constants';
import TweetFooter from '../../components/ui/TweetFooter';
import { likeTweet } from '../../api/like.api';
import UserInfo from '../../components/ui/UserInfo';
import { tweetMenuIcons, tweetMenuOptions } from '../../data/menuOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBookmark,
    faComment,
    faHeart,
} from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import {
    faArrowUpFromBracket,
    faRepeat,
} from '@fortawesome/free-solid-svg-icons';
import Avatar, { Size } from '../../components/ui/Avatar';
import AuthContext from '../../context/user.context';
import FormReply from '../../components/form/FormReply';
import TweetReply from '../../components/tweet/TweetReply';

interface TweetPageProps {}

const TweetPage: FC<TweetPageProps> = ({}) => {
    const [tweet, setTweet] = useState<any>();
    const [likedTweet, setLikedTweet] = useState<any>();
    const [authUser, setAuthUser] = useState<any>(null);
    const [isFormFocused, setIsFormFocused] = useState(false);

    const [value, setValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const tweetTextRef = useRef<HTMLTextAreaElement>(null);

    const [userTweets, setUserTweets] = useState<any[]>([]);

    const previousPath = localStorage.getItem('active-nav');
    const goBack = () => {
        navigate(`/${previousPath}`);
    };

    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    // get Auth user
    const ctx = useContext(AuthContext);
    const getAuthUserAndTweets = async () => {
        const { user } = ctx.getUserContext();
        setAuthUser(user);

        if (user) {
            const res = await getUserTweets(user._id);
            const { tweets } = res;
            setUserTweets(tweets);
        }
    };
    useEffect(() => {
        getAuthUserAndTweets();
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

    // Update Likes state
    useEffect(() => {
        setTweet((prev: any) => ({
            ...prev,
            totalLikes: likedTweet?.likesCount,
            likes: likedTweet?.likes,
        }));
    }, [likedTweet]);

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
        // const res = await createTweet(text, selectedFile, tweetAudience, tweetReply);
        // const { tweet }: any = res;
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
        // setTweets((prevTweets) => [newTweet, ...prevTweets]);
        clearTweetForm();
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
                            tweet?.image &&
                            `${IMAGE_TWEET_BASE_URL}/${tweet?.image}`
                        }
                        alt=""
                    />
                    <div className={styles.footer}>
                        <TweetFooter
                            comments={'123'}
                            reposts={'123'}
                            likesCount={
                                tweet?.totalLikes > 0 ? tweet?.totalLikes : ''
                            }
                            views={'453'}
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
                                )}
                            </div>
                            <div className={styles.bookmarks}>
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
                                        className={styles.faArrowUpFromBracket}
                                    />
                                </div>
                            </div>

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
                                    value={value}
                                    tweetTextRef={tweetTextRef}
                                    imagePreview={previewImage}
                                    isFocused={isFormFocused}
                                    setIsFocused={setIsFormFocused}
                                    onSubmit={handleSubmitTweet}
                                    onImageUpload={handleImageUploadRepy}
                                    onCancelImagePreview={
                                        handleCanselPreviewImage
                                    }
                                    onChageImage={handleTextAreaOnChangeReply}
                                />
                            </div>
                        </div>
                    </div>
                    {userTweets.map((tweet: any) => (
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
