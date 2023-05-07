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
    IMAGE_COVER_BASE_URL,
    TWEET_MENU,
} from '../../constants/common.constants';
import AuthContext from '../../context/user.context';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../../api/user.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBookmark, faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faArrowUpFromBracket,  faRepeat } from '@fortawesome/free-solid-svg-icons';
import UserInfo from '../../components/ui/UserInfo';
import { getTweetById, getUserTweets } from '../../api/tweet.api';
import { tweetMenuIcons, tweetMenuOptions } from '../../data/menuOptions';
import Avatar, { Size } from '../../components/ui/Avatar';
import FormReply from '../../components/form/FormReply';
import TweetReply from '../../components/tweet/TweetReply';
import { likeTweet } from '../../api/like.api';

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

    const [userTweets, setUserTweets] = useState<any[]>([]);


    const navigate = useNavigate();

    
    // get Auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUserAndTweets = async () => {
          const { user } = ctx.getUserContext();
          setAuthUser(user);
          
          if (user) {
            const res = await getUserTweets(user._id);
            const { tweets } = res;
            setUserTweets(tweets);
          }
        };
        
        getAuthUserAndTweets();
    }, []);

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

    const handleTweetMenuOptionClick = async (option: string, tweetId: string, tweet: any) => {
        if (option === TWEET_MENU.delete) {
           console.log('hello');
        } else if (option === TWEET_MENU.edit) {
          
        } 
    };

    const handleTextAreaOnChangeReply = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target?.value;
        setValue(val);
    }
    const handleImageUploadRepy = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    }

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
                            <HeaderTitle title={'Tweet'} className={styles.title} />
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
                                <p><span>332</span>Retweets</p> <p><span>61</span>Quotes</p> <p><span>{tweet?.totalLikes > 0 ? tweet?.totalLikes : ''}</span>Likes</p> <p><span>332</span>Bookmarks</p>
                            </div>
                            <div className={styles.icons}>
                                <FontAwesomeIcon icon={faComment} className={styles.faComment} />
                                <FontAwesomeIcon icon={faRepeat} className={styles.faRepeat} />
                                <FontAwesomeIcon icon={faHeart} className={styles.faHeart} />
                                <FontAwesomeIcon icon={faBookmark} className={styles.faBookmark} />
                                <FontAwesomeIcon icon={faArrowUpFromBracket} className={styles.faArrowUpFromBracket} />
                            </div>

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
                                    onImageUpload={handleImageUploadRepy}
                                    onCancelImagePreview={handleCanselPreviewImage}
                                    onChageImage={handleTextAreaOnChangeReply} 
                                />
                            </div>
                        </div>
                    </div>
                    {userTweets.map((tweet: any) => (
                        <div className={styles.asideReplySection} key={tweet?._id}>
                            <TweetReply
                                key={tweet._id}
                                tweet={tweet}
                                onClickMenu={() => {}}
                                onClickLike={onClickLike}
                                classNameNoImage={styles.image}
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
