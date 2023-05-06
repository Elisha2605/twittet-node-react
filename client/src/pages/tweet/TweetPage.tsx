import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import styles from './TweetPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import XmarkIcon from '../../components/icons/XmarkIcon';
import { getTweetById } from '../../api/tweet.api';
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
import { faBookmark, faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faArrowUpFromBracket, faRepeat } from '@fortawesome/free-solid-svg-icons';
import Avatar, { Size } from '../../components/ui/Avatar';
import AuthContext from '../../context/user.context';
import FormReply from '../../components/form/FormReply';

interface TweetPageProps {
    value: string; 
    
    selectedFile: File | null
    previewImage: string | null

    handleTextAreaOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleCanselPreviewImage: () => void;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clearTweetForm: () => void;
    onClickTweetMenu: Function;
}

const TweetPage: FC<TweetPageProps> = ({
    value,
    
    selectedFile,
    previewImage,

    handleTextAreaOnChange,
    handleCanselPreviewImage,
    handleImageUpload,
    clearTweetForm,
    onClickTweetMenu,
}) => {
    const [tweet, setTweet] = useState<any>();
    const [likedTweet, setLikedTweet] = useState<any>();
    const [authUser, setAuthUser] = useState<any>(null);

    const [isFormFocused, setIsFormFocused] = useState(false);



    const { id } = useParams<{ id: string }>();

    const tweetTextRef = useRef<HTMLTextAreaElement>(null);


    // get Auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
        getAuthUser();
    }, []);

    useEffect(() => {
        const getTweet = async () => {
            const { tweet } = await getTweetById(id!);
            setTweet(tweet[0]);
        };
        getTweet();
    }, []);

    const navigate = useNavigate();

    // On like tweet
    const onClickLike = async () => {
        const res: any = await likeTweet(tweet?._id);
        const { likedTweet } = res;
        setLikedTweet(likedTweet);
    };

    useEffect(() => {
        setTweet((prev: any) => ({
            ...prev,
            totalLikes: likedTweet?.likesCount,
        }));
    }, [likedTweet]);

    const handleTweetMenuOptionClick = async (option: string, tweetId: string, tweet: any) => {
        if (option === TWEET_MENU.delete) {
           console.log('hello');
        } else if (option === TWEET_MENU.edit) {
          
        } 
    };


    const handleSubmitTweet = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = tweetTextRef.current?.value
            ? tweetTextRef.current?.value
            : null;
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
        // setIsFormFocused(false);
        // setTweetAudience(TWEET_AUDIENCE.everyone)
        // setTweetReply(TWEET_REPLY.everyone)
        clearTweetForm();
    };


    return (
        <React.Fragment>
            <div className={styles.container}>
                <div
                    className={styles.overlay}
                    onClick={() => {
                        navigate(-1);
                    }}
                ></div>
                <XmarkIcon
                    className={styles.canselBtn}
                    size={'xl'}
                    onClick={() => {
                        navigate(-1);
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
                            likes={
                                tweet?.totalLikes > 0 ? tweet?.totalLikes : ''
                            }
                            views={'453'}
                            onClick={onClickLike}
                        />
                    </div>
                </div>
                <div className={styles.aside}>
                    <UserInfo
                        userId={tweet?.user?._id}
                        tweet={tweet}
                        avatar={tweet?.user?.avatar ? `${IMAGE_AVATAR_BASE_URL}/${tweet?.user?.avatar}` : undefined}
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
                            <span>9:15 PM</span> · <span>May 5, 2023</span> · <p><span>1.2M </span>Views</p>  
                        </div>
                        <div className={styles.stats}>
                            <p><span>332</span>Retweets</p> <p><span>61</span>Quotes</p> <p><span>{tweet?.totalLikes > 0 ? tweet?.totalLikes : ''}</span>Likes</p>
                        </div>
                        <div className={styles.bookmarks}>
                            <p><span>332</span>Bookmarks</p>
                        </div>
                        <div className={styles.icons}>
                            <FontAwesomeIcon icon={faComment} className={styles.faComment} />
                            <FontAwesomeIcon icon={faRepeat} className={styles.faRepeat} />
                            <FontAwesomeIcon icon={faHeart} className={styles.faHeart} />
                            <FontAwesomeIcon icon={faBookmark} className={styles.faBookmark} />
                            <FontAwesomeIcon icon={faArrowUpFromBracket} className={styles.faArrowUpFromBracket} />
                        </div>
                        <form className={styles.form}>
                        <div className={styles.formSection}>
                            <Avatar
                                path={authUser?.avatar ? `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}` : undefined}
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
                                onImageUpload={handleImageUpload}
                                onCancelImagePreview={handleCanselPreviewImage}
                                onChageImage={handleTextAreaOnChange} 
                                isReplay={true}
                            />
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default TweetPage;
