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
import { 
    tweetMenuOptions, 
    tweetMenuIcons, 
    tweetAudienceMenuOptions, 
    tweetAudienceMenuIcons,
    tweetReplyOptions,
    tweetReplyIcons 
} from '../../data/menuOptions';
import { createTweet, deleteTweet, getAllTweets } from '../../api/tweet.api';
import { IMAGE_AVATAR_BASE_URL, TWEET_AUDIENCE, TWEET_REPLY } from '../../constants/common.constants';
import PageUnderConstruction from '../../components/ui/PageUnderConstruction';
import { TweetAudienceType, TweetReplyType } from '../../types/tweet.types';
import AuthContext from '../../context/user.context';

interface HomeProps {
    value: string;
    onAddTweet: any, 
    
    selectedFile: File | null
    previewImage: string | null

    handleTextAreaOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleCanselPreviewImage: () => void;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clearTweetForm: () => void;
}

const Home: React.FC<HomeProps> = ({ 
    value,
    onAddTweet, 
    
    selectedFile,
    previewImage,
    
    handleTextAreaOnChange,
    handleCanselPreviewImage,
    handleImageUpload,
    clearTweetForm,
}) => {

    const [tweets, setTweets] = useState<any[]>([]);
    const [authUser, setAuthUser] = useState<any>(null);
    
    const [isFormFocused, setIsFormFocused] = useState(false);
    const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab-home') || 'for-you');
    const [tweetAudience, setTweetAudience] = useState<TweetAudienceType>(TWEET_AUDIENCE.everyone);
    const [tweetReply, setTweetReply] = useState<TweetReplyType>(TWEET_REPLY.everyone);



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
    const fetchTweets = async () => {
        const { tweets } = await getAllTweets();
        setTweets(tweets);
    };
    const memoizedTweets = useMemo(() => tweets, [tweets]);
    useEffect(() => {
        fetchTweets();
    }, []);

    // Set active tab in local storage
    useEffect(() => {
        localStorage.setItem('activeTab-home', activeTab);
    }, [activeTab]);

    // TWEET menu popup
    const handleMenuOptionClick = async (option: string, tweetId: string) => {
        if (option === 'Delete') {
            const res = await deleteTweet(tweetId);
            setTweets((preveState) =>
                preveState.filter((tweet) => tweet._id !== tweetId)
            );
            console.log(res);
        } else if (option === 'Edit') {
            console.log(option);
        }
    };
    
    
    useEffect(() => {
        const handleNewTweetFromModal = () => {
            // Add new tweet from NavigationTweet to state
            if (authUser?.avatar) {
                console.log('Inside handleNewTweet');
                setTweets((prevTweets) => [onAddTweet[0], ...prevTweets]);
            }
        };
        handleNewTweetFromModal();
    }, [onAddTweet]);

    const handleTweetAudienceOptions = (options: string) => {
        if (options === TWEET_AUDIENCE.everyone) {
            setTweetAudience(TWEET_AUDIENCE.everyone);
            setTweetReply(TWEET_REPLY.everyone)
        }
        if (options === TWEET_AUDIENCE.twitterCircle) {
            setTweetAudience(TWEET_AUDIENCE.twitterCircle);
            setTweetReply(TWEET_REPLY.onlyTwitterCircle)
        }
    }

    const handleTweetReyplyOptions = (options: string) => {
        if (options === TWEET_REPLY.everyone) {
            console.log(TWEET_REPLY.everyone);
            setTweetReply(TWEET_REPLY.everyone);
        }
        if (options === TWEET_REPLY.peopleYouFollow) {
            console.log(TWEET_REPLY.peopleYouFollow);
            setTweetReply(TWEET_REPLY.peopleYouFollow);
        }
        if (options === TWEET_REPLY.onlyPeopleYouMention) {
            console.log(TWEET_REPLY.onlyPeopleYouMention);
            setTweetReply(TWEET_REPLY.onlyPeopleYouMention);
        }
    }


    const handleSubmitTweet = async (e: React.FormEvent) => {
        console.log('inside handleSubmitTweet');
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

                    {/* TweetForm - start */}
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
                            tweetAudienceOptions={tweetAudienceMenuOptions} 
                            tweetAudienceIcons={tweetAudienceMenuIcons}
                            tweetAudienceValue={tweetAudience}                           
                            tweetReplyOptions={tweetReplyOptions}
                            tweetReplyIcons={tweetReplyIcons}
                            tweetReplyValue={tweetReply}
                            setIsFocused={setIsFormFocused}
                            onSubmit={handleSubmitTweet}
                            onImageUpload={handleImageUpload}
                            onCancelImagePreview={handleCanselPreviewImage}
                            onChageImage={handleTextAreaOnChange} 
                            onClickAudienceMenu={handleTweetAudienceOptions} 
                            onClickReplyMenu={handleTweetReyplyOptions} 
                        />
                    </div>
                    {/* TweetForm - end */}   
                    
                    {/* FOR YOU - START */}
                    {activeTab === 'for-you' && (
                        <div className={styles.main}>
                            {/* tweets - start */}
                            {memoizedTweets.map((tweet: any) => (
                                <Tweet
                                    key={tweet._id}
                                    comments={'164'}
                                    reposts={'924'}
                                    likes={'21.3'}
                                    views={'446'}
                                    tweet={tweet}
                                    options={tweetMenuOptions}
                                    icons={tweetMenuIcons}
                                    onClickMenu={handleMenuOptionClick}
                                />
                            ))}
                            {/* tweets - end */}
                            {/* FOR YOU - START */}
                        </div>
                    )}
                    {/* FOLLOWING - START */}
                    {activeTab === 'following' && (
                        <div className={styles.main}>
                            <PageUnderConstruction />
                        </div>
                        
                    )}
                    {/* FOLLOWING - START */}
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

export default Home;
