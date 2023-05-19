import React, {
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import Aside from '../../components/aside/Aside';
import Avatar, { Size } from '../../components/ui/Avatar';
import SearchBar from '../../components/ui/SearchBar';
import WhoToFollow from '../../components/ui/WhoToFollow';
import FormTweet from '../../components/form/FormTweet';
import Header from '../../components/header/Header';
import Tweet from '../../components/tweet/Tweet';
import styles from './Home.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import HorizontalNavBar from '../../components/ui/HorizontalNavBar';
import { createTweet, getAllTweets, getFollowTweets } from '../../api/tweet.api';
import { IMAGE_AVATAR_BASE_URL, TWEET_AUDIENCE, TWEET_REPLY } from '../../constants/common.constants';
import { TweetAudienceType, TweetReplyType } from '../../types/tweet.types';
import AuthContext from '../../context/user.context';
import { likeTweet } from '../../api/like.api';
import HomeEditTwitterCirlceModal from './home-modals/HomeEditTwitterCirlceModal';

interface HomeProps {
    value: string;
    onAddTweet: any, 
    onEditTweet: any,
    onDeleteTweet: any,
    
    selectedFile: File | null
    previewImage: string | null

    handleTextAreaOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleCanselPreviewImage: () => void;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clearTweetForm: () => void;
    onClickTweetMenu: Function;
    onClickRetweet?: Function;
}

const Home: React.FC<HomeProps> = ({ 
    value,
    onAddTweet, 
    onEditTweet,
    onDeleteTweet,
    
    selectedFile,
    previewImage,

    handleTextAreaOnChange,
    handleCanselPreviewImage,
    handleImageUpload,
    clearTweetForm,
    onClickTweetMenu,
    onClickRetweet
}) => {

    const [tweets, setTweets] = useState<any[]>([]);
    const [followingTweets, setFollowingTweets] = useState<any[]>([]);
    const [authUser, setAuthUser] = useState<any>(null);
    
    const [isFormFocused, setIsFormFocused] = useState(false);
    const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab-home') || 'for-you');
    const [tweetAudience, setTweetAudience] = useState<TweetAudienceType>(TWEET_AUDIENCE.everyone);
    const [tweetReply, setTweetReply] = useState<TweetReplyType>(TWEET_REPLY.everyone);

    const [likedTweet, setLikedTweet] = useState<any>();

    //new 
    const tweetTextRef = useRef<HTMLTextAreaElement>(null);
    
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        }
        getAuthUser();
    }, []);

    // fetching Tweets
    useEffect(() => {
        const fetchTweets = async () => {
            try {
              if (authUser) {
                const { tweets } = await getAllTweets();
                setTweets(tweets);
              }
            } catch (error) {
              // Handle the error here, e.g., display an error message or set default values for tweets
              console.error('Error fetching tweets:', error);
            }
          };          
        fetchTweets();
    }, [authUser]);
    const memoizedTweets = useMemo(() => tweets, [tweets]);


    useEffect(() => {
        const fetchFollowingTweets = async () => {
            if (authUser) {
                const { tweets } = await getFollowTweets();
                setFollowingTweets(tweets);
            }
        };
        fetchFollowingTweets();
    }, [authUser]);
    const memoizedFollowTweets = useMemo(() => followingTweets, [followingTweets]);

    useEffect(() => {
        const handleNewTweetFromModal = () => {
            // Add new tweet from NavigationTweet to state
            if (authUser?.avatar) {
                console.log(onAddTweet[0]);
                setTweets((prevTweets) => [onAddTweet[0], ...prevTweets]);
            }
        };
        handleNewTweetFromModal();
    }, [onAddTweet]);

    useEffect(() => {
        const handleEditTweetFromModal = () => {
            if (authUser) {
                setTweets((prevTweets: any) => 
                    prevTweets.map((tweet: any) =>
                        tweet?._id === onEditTweet?._id
                            ? { ...tweet, ...onEditTweet }
                            : tweet
                    )
                )

            }
        }
        handleEditTweetFromModal()
    }, [onEditTweet])

    // On delete tweet
    useEffect(() => {
        setTweets((preveState) =>
                preveState.filter((tweet) => tweet._id !== onDeleteTweet._id)
            );
    }, [onDeleteTweet])

    const handleTweetAudienceOptions = (option: string) => {
        if (option === TWEET_AUDIENCE.everyone) {
            setTweetAudience(TWEET_AUDIENCE.everyone);
            setTweetReply(TWEET_REPLY.everyone)
        }
        if (option === TWEET_AUDIENCE.twitterCircle) {
            setTweetAudience(TWEET_AUDIENCE.twitterCircle);
            setTweetReply(TWEET_REPLY.onlyTwitterCircle)
        }
    }

    const handleTweetReyplyOptions = (option: string) => {
        if (option === TWEET_REPLY.everyone) {
            setTweetReply(TWEET_REPLY.everyone);
        }
        if (option === TWEET_REPLY.peopleYouFollow) {
            setTweetReply(TWEET_REPLY.peopleYouFollow);
        }
        if (option === TWEET_REPLY.onlyPeopleYouMention) {
            setTweetReply(TWEET_REPLY.onlyPeopleYouMention);
        }
    }

    const handleSubmitTweet = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = tweetTextRef.current?.value
            ? tweetTextRef.current?.value
            : null;
        const res = await createTweet(text, selectedFile, tweetAudience, tweetReply);
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
        setTweets((prevTweets) => [newTweet, ...prevTweets]);
        setIsFormFocused(false);
        setTweetAudience(TWEET_AUDIENCE.everyone)
        setTweetReply(TWEET_REPLY.everyone)
        clearTweetForm();
    };
    
    useEffect(() => {
        setTweets((prevTweets: any) =>
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
        setFollowingTweets((prevTweets: any) =>
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

    const onClickLike = async (tweet: any) => {
        const res: any = await likeTweet(tweet._id);;
        const { likedTweet } = res;
        console.log(likedTweet);
        setLikedTweet(likedTweet)
    }

    console.log(tweets);
    
    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                    <Header border={true}>
                        <HeaderTitle title={'Home'} className={styles.title} />
                        <HorizontalNavBar className={styles.homeNaveBar}>
                            <div className={activeTab === 'for-you' ? styles.active : ''}
                                onClick={() => setActiveTab('for-you')}>
                                For you
                            </div>
                            <div className={activeTab === "following" ? styles.active : ''}
                                onClick={() => setActiveTab('following')}>
                                Following
                            </div>
                        </HorizontalNavBar>
                    </Header>
                    <div className={styles.formSection}>
                        <Avatar
                            path={authUser?.avatar ? `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}` : undefined}
                            size={Size.small}
                            className={''}
                        />
                        <FormTweet
                            value={value}
                            tweetTextRef={tweetTextRef}
                            imagePreview={previewImage}
                            isFocused={isFormFocused}
                            tweetAudienceValue={tweetAudience}                           
                            tweetReplyValue={tweetReply}
                            setIsFocused={setIsFormFocused}
                            onSubmit={(e: any) => handleSubmitTweet(e)}
                            onImageUpload={handleImageUpload}
                            onCancelImagePreview={handleCanselPreviewImage}
                            onChageTextArea={handleTextAreaOnChange} 
                            onClickAudienceMenu={handleTweetAudienceOptions} 
                            onClickReplyMenu={handleTweetReyplyOptions} 
                        />
                    </div>
                    {/* Twitter Circle Modal */}
                    <>

                        <HomeEditTwitterCirlceModal />
                    
                    </>
                    {activeTab === 'for-you' && (
                        <div className={styles.main}>
                            {memoizedTweets.map((tweet: any) => (
                                <Tweet
                                    key={tweet._id}
                                    tweet={tweet}
                                    onClickMenu={onClickTweetMenu}
                                    onClickLike={onClickLike}
                                    isLiked={tweet?.likes?.includes(authUser?._id)}
                                    onClickRetweet={onClickRetweet}

                                />
                            ))}
                        </div>
                    )}
                    {activeTab === 'following' && (
                        <div className={styles.main}>
                            {memoizedFollowTweets.map((tweet: any) => (
                                <Tweet
                                    key={tweet._id}
                                    tweet={tweet}
                                    onClickMenu={onClickTweetMenu!}
                                    onClickLike={onClickLike}
                                    isLiked={tweet?.likes?.includes(authUser?._id)}
                                    onClickRetweet={onClickRetweet}
                                />
                            ))}
                        </div>
                        
                    )}
                </div>
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

export default Home;
