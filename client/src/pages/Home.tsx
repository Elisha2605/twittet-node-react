import React, {
    useEffect,
    useRef,
    useState,
} from 'react';
import Aside from '../components/aside/Aside';
import Avatar, { Size } from '../components/ui/Avatar';
import SearchBar from '../components/ui/SearchBar';
import WhoToFollow from '../components/ui/WhoToFollow';
import FormTweet from '../components/form/FormTweet';
import Header from '../components/header/Header';
import Tweet from '../components/tweet/Tweet';
import styles from './Home.module.css';
import Layout from '../Layout.module.css';
import HeaderTitle from '../components/header/HeaderTitle';
import HorizontalNavBar from '../components/ui/HorizontalNavBar';
import { tweetMenuOptions, tweetMenuIcons, tweetPrivacyMenuOptions, tweetPrivacyMenuIcons } from '../data/menuOptions';
import useAuthUser from '../hooks/userAuth.hook';
import { createTweet, deleteTweet, getAllTweets } from '../api/tweet.api';
import { getTimeDifference } from '../utils/helpers.utils';
import { IMAGE_AVATAR_BASE_URL, IMAGE_TWEET_BASE_URL } from '../constants/common.constants';

const Home = () => {
    const [tweets, setTweets] = useState<any[]>([]);
    const [value, setValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isFormFocused, setIsFormFocused] = useState(false);

    const tweetTextRef = useRef<HTMLTextAreaElement>(null);
    
    // fetching Tweets
    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const { tweets } = await getAllTweets();
                setTweets(tweets);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTweets();
    }, []);

    // Get auth user
    const authUser: any = useAuthUser();

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

    //// new functions
    const handleImageOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target?.value;
        setValue(val);
    };

    const handleCanselPreviewImage = () => {
        if (previewImage) {
            setPreviewImage(null);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const handleSubmitTweet = async (e: React.FormEvent) => {
        console.log('inside handleSubmitTweet');
        e.preventDefault();
        const text = tweetTextRef.current?.value
            ? tweetTextRef.current?.value
            : null;
        const res = await createTweet(text, selectedFile);
        const { tweet }: any = res;
        const newTweet = {
            _id: tweet._id,
            text: tweet.text,
            user: {
                avatar: authUser?.avatar,
                name: authUser?.name,
                username: authUser?.username,
                isVerified: authUser?.isVerified,
            },
            createdAt: tweet.createdAt,
            image: tweet.image,
            comments: [],
            reposts: [],
            likes: [],
        };
        setSelectedFile(null);
        setPreviewImage(null);
        setValue('');
        setTweets((prevTweets) => [newTweet, ...prevTweets]);
        setIsFormFocused(false);
    };

    const handleTweetPrivacyOptions = (options: string) => {
        if (options === 'Everyone') {
            console.log(options + ': Clicked');
        }
        if (options === 'Twitter Circle') {
            console.log(options + ': Clicked');
        }
    }

    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                    <Header border={true}>
                        <HeaderTitle title={'Home'} className={styles.title} />
                        <HorizontalNavBar className={styles.homeNaveBar}>
                            <div className={styles.active}>For you</div>
                            <div>Following</div>
                        </HorizontalNavBar>
                    </Header>
                    <div className={styles.main}>
                        {/* TweetForm - start */}
                        <div className={styles.formSection}>
                            <Avatar
                                path={authUser?.avatar && `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`}
                                size={Size.small}
                                className={''}
                            />
                            <FormTweet
                                value={value}
                                tweetTextRef={tweetTextRef}
                                imagePreview={previewImage}
                                isFocused={isFormFocused}
                                setIsFocused={setIsFormFocused}
                                onSubmit={handleSubmitTweet}
                                onImageUpload={handleImageUpload}
                                onCancelImagePreview={handleCanselPreviewImage}
                                onChageImage={handleImageOnChange} 
                                tweetPrivacyOptions={tweetPrivacyMenuOptions} 
                                tweetPrivacyIcons={tweetPrivacyMenuIcons} 
                                onClickPrivacyMenu={handleTweetPrivacyOptions}                            
                            />
                        </div>
                        {/* TweetForm - end */}
                        {/* tweets - start */}
                        {tweets.map((tweet: any) => (
                            <Tweet
                                tweetId={tweet._id}
                                key={tweet._id}
                                avatar={
                                    tweet.user.avatar &&
                                    `${IMAGE_AVATAR_BASE_URL}/${tweet.user.avatar}`
                                }
                                firstName={tweet.user.name}
                                username={tweet.user.username}
                                isVerfied={tweet.user.isVerified}
                                time={getTimeDifference(
                                    new Date(tweet.createdAt).getTime()
                                )}
                                tweet={tweet.text}
                                image={tweet.image && `${IMAGE_TWEET_BASE_URL}/${tweet.image}`}
                                isOption={true}
                                comments={'164'}
                                reposts={'924'}
                                likes={'21.3'}
                                views={'446'}
                                options={tweetMenuOptions}
                                icons={tweetMenuIcons}
                                onClickMenu={handleMenuOptionClick}
                            />
                        ))}
                        {/* tweets - end */}
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

export default Home;
