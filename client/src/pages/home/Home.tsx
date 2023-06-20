import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Aside from '../../components/aside/Aside';
import Avatar, { Size } from '../../components/ui/Avatar';
import SearchBar from '../../components/ui/SearchBar';
import WhoToFollow from '../../components/ui/WhoToFollow';
import Header from '../../components/header/Header';
import Tweet from '../../components/tweet/Tweet';
import styles from './Home.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import HorizontalNavBar from '../../components/ui/HorizontalNavBar';
import {
    createTweet,
    getAllTweets,
    getFollowTweets,
} from '../../api/tweet.api';
import {
    IMAGE_AVATAR_BASE_URL,
    MAX_TWEET_CHARACTERS,
    TWEET_AUDIENCE,
    TWEET_REPLY,
    TWEET_TYPE,
} from '../../constants/common.constants';
import { TweetAudienceType, TweetReplyType } from '../../types/tweet.types';
import AuthContext from '../../context/user.context';
import { likeTweet } from '../../api/like.api';
import FormTweet from '../../components/form/FormTweet';
import LoadingRing from '../../components/ui/LoadingRing';
import { useMessage } from '../../context/successMessage.context';

interface HomeProps {
    socket: any;

    value: string;
    onAddTweet: any;
    onEditTweet: any;
    onDeleteTweet: any;

    selectedFile: File | null;
    previewImage: string | null;

    handleTextAreaOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleCanselPreviewImage: () => void;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clearTweetForm: () => void;
    onClickTweetMenu: Function;
    onClickRetweet?: Function;
}

const Home: React.FC<HomeProps> = ({
    socket,

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
    onClickRetweet,
}) => {
    const [tweets, setTweets] = useState<any[]>([]);
    const [followingTweets, setFollowingTweets] = useState<any[]>([]);
    const [authUser, setAuthUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<any>(null);
    const [isOnSubmitLoading, setIsOnSubmitLoading] = useState<boolean>(false);

    const [isFormFocused, setIsFormFocused] = useState(false);
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem('activeTab-home') || 'for-you'
    );
    const [tweetAudience, setTweetAudience] = useState<TweetAudienceType>(
        TWEET_AUDIENCE.everyone
    );
    const [tweetReply, setTweetReply] = useState<TweetReplyType>(
        TWEET_REPLY.everyone
    );

    const { showMessage } = useMessage();
    
    const [likedTweet, setLikedTweet] = useState<any>();

    //new
    const tweetTextRef = useRef<HTMLTextAreaElement>(null);

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
        getAuthUser();
    }, []);

    // fetching Tweets
    useEffect(() => {
        const fetchTweets = async () => {
            setIsLoading(true);
            if (tweets.length > 0) {
                setIsLoading(false);
                return;
            }
            try {
                if (authUser) {
                    const { tweets } = await getAllTweets();
                    setTweets(tweets);
                    setIsLoading(false);
                }
            } catch (error) {
                // Handle the error here, e.g., display an error message or set default values for tweets
                console.error('Error fetching tweets:', error);
                setIsLoading(false);
            }
        };
        fetchTweets();
    }, [authUser, tweets.length]);
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
    const memoizedFollowTweets = useMemo(
        () => followingTweets,
        [followingTweets]
    );

    useEffect(() => {
        // Add new tweet from NavigationTweet to state
        if (authUser?.avatar) {
            setTweets((prevTweets) => [onAddTweet[0], ...prevTweets]);
        }
        // update retweetCount
        setTweets((preveTweet: any) =>
            preveTweet.map(
                (tweet: any) =>
                    (tweet?._id === onAddTweet[0]?.retweet?.tweet?._id
                        ? {
                            ...tweet,
                            retweetCount:
                                onAddTweet[0]?.retweet?.tweet?.retweetCount, 
                        }
                        : tweet)
            )
        );
    }, [onAddTweet]);

    useEffect(() => {
        
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
                );
            }
        };
        handleEditTweetFromModal();
    }, [onEditTweet]);

    // On delete tweet
    useEffect(() => {
        setTweets((preveState) =>
            preveState.filter((tweet) => tweet._id !== onDeleteTweet._id)
        );
    }, [onDeleteTweet]);

    const handleTweetAudienceOptions = (option: string) => {
        if (option === TWEET_AUDIENCE.everyone) {
            setTweetAudience(TWEET_AUDIENCE.everyone);
            setTweetReply(TWEET_REPLY.everyone);
        }
        if (option === TWEET_AUDIENCE.twitterCircle) {
            setTweetAudience(TWEET_AUDIENCE.twitterCircle);
            setTweetReply(TWEET_REPLY.onlyTwitterCircle);
        }
    };

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
    };

    const handleSubmitTweet = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsOnSubmitLoading(true);
        const text = tweetTextRef.current?.value
            ? tweetTextRef.current?.value
            : null;

        if (text?.length! > MAX_TWEET_CHARACTERS) {
            showMessage('Could not send your tweet', 'error');
            setIsOnSubmitLoading(false);
            return;
        }
        
        const res = await createTweet(
            text,
            selectedFile,
            tweetAudience,
            tweetReply
        );
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
        if (res.status) {
            showMessage('Your tweet was sent', 'success');
        }
        setTweets((prevTweets) => [newTweet, ...prevTweets]);
        setIsFormFocused(false);
        setTweetAudience(TWEET_AUDIENCE.everyone);
        setTweetReply(TWEET_REPLY.everyone);
        clearTweetForm();
        setIsOnSubmitLoading(false);
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
        const res: any = await likeTweet(tweet?._id);
        const { likedTweet } = res;
        setLikedTweet(likedTweet);

        // sending notification with socket.io
        if (res.message === 'Liked' && 
            authUser?._id !== tweet?.user?._id
        ) {
            socket.emit('sendNotification', {
                sender: authUser?._id,
                receiver: tweet?.user?._id,
                type: 'Like'
            });
        }
    };

    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                    <Header border={true}>
                        <HeaderTitle title={'Home'} className={styles.title} />
                        <HorizontalNavBar className={styles.homeNaveBar}>
                            <div
                                className={
                                    activeTab === 'for-you' ? styles.active : ''
                                }
                                onClick={() => setActiveTab('for-you')}
                            >
                                For you
                            </div>
                            <div
                                className={
                                    activeTab === 'following'
                                        ? styles.active
                                        : ''
                                }
                                onClick={() => setActiveTab('following')}
                            >
                                Following
                            </div>
                        </HorizontalNavBar>
                    </Header>
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
                            isLoading={isOnSubmitLoading}
                        />
                    </div>
                    {/* Twitter Circle Modal */}
                    {activeTab === 'for-you' && (   
                        <div className={styles.main}>
                            {!isLoading && memoizedTweets.map((tweet: any) => (
                                <Tweet
                                    key={tweet._id}
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
                            {isLoading && tweets.length >= 24 ? <LoadingRing size={'small'} />: null}
                        </div>
                    )}
                    {activeTab === 'following' && (
                        <div className={styles.main}>
                            {memoizedFollowTweets.map((tweet: any) => (
                                <Tweet
                                    socket={socket}

                                    key={tweet?._id}
                                    tweet={tweet}
                                    onClickMenu={onClickTweetMenu!}
                                    onClickLike={onClickLike}
                                    isLiked={tweet?.likes?.includes(
                                        authUser?._id
                                    )}
                                    onClickRetweet={onClickRetweet}
                                />
                            ))}
                        </div>
                    )}
                </div>
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

export default Home;