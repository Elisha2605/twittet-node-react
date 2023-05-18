import React, { FC, useContext, useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import styles from './Bookmarks.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import SearchBar from '../../components/ui/SearchBar';
import Aside from '../../components/aside/Aside';
import WhoToFollow from '../../components/ui/WhoToFollow';
import PopUpMenu from '../../components/ui/PopUpMenu';
import { tweetMenuOptions, tweetMenuIcons } from '../../data/menuOptions';
import { getUserSavedTweets } from '../../api/bookmark.api';
import Tweet from '../../components/tweet/Tweet';
import { likeTweet } from '../../api/like.api';
import AuthContext from '../../context/user.context';

interface BookmarkProps {
    onClickTweetMenu: Function;
}

const Bookmarks: FC<BookmarkProps> = ({ onClickTweetMenu }) => {
    const [authUser, setAuthUser] = useState<any>(null);
    const [savedTweets, setSavedTweets] = useState<any[]>([]);
    const [likedTweet, setLikedTweet] = useState<any>();

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
        getAuthUser();
    }, []);

    useEffect(() => {
        const getSavedTweets = async () => {
            const { tweets } = await getUserSavedTweets();
            setSavedTweets(tweets);
        };
        getSavedTweets();
    }, []);


    // On like tweet
   const onClickLike = async (tweet: any) => {
        const res: any = await likeTweet(tweet._id);;
        const { likedTweet } = res;
        console.log(likedTweet);
        setLikedTweet(likedTweet)
    }

    useEffect(() => {
        setSavedTweets((prevTweets: any) =>
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

    const handleOptionClick = (option: string) => {
        // TODO: handle menu option clickes
        if (option === 'Option 1') {
            console.log('one');
            // Insert your code to handle when Option 1 is clicked here
        } else {
            console.log(`${option} was clicked!`);
            // Insert your code to handle when an option other than Option 1 is clicked here
        }
    };

    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                    <Header>
                        <div className={styles.headerWrapper}>
                            <HeaderTitle
                                title={'Bookmarks'}
                                subTitle={'@Alvin44943'}
                            />
                            <PopUpMenu
                                options={tweetMenuOptions}
                                onClick={handleOptionClick}
                                icons={tweetMenuIcons}
                                itemId={''}
                            />
                        </div>
                    </Header>
                    {/* Home page - start */}
                    <div className={styles.main}>
                        {savedTweets.length === 0 && (
                            <div className={styles.emptyBookmarksWrapper}>
                                <div className={styles.emptyBookmarksImage}>
                                    <img
                                        src={
                                            'https://abs.twimg.com/responsive-web/client-web/book-in-bird-cage-800x400.v1.71804389.png'
                                        }
                                        alt=""
                                    />
                                    <div
                                        className={styles.emptyBookmarksMessage}
                                    >
                                        <p className={styles.messageTitle}>
                                            Save Tweets for later
                                        </p>
                                        <p className={styles.messageBody}>
                                            Don’t let the good ones fly away!
                                            Bookmark Tweets to easily find them
                                            again in the future.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* tweets - start */}
                        {savedTweets.map((tweet: any) => (
                            <Tweet
                                key={tweet?._id}
                                tweet={tweet}
                                onClickMenu={onClickTweetMenu}
                                onClickLike={onClickLike}
                                isLiked={tweet?.likes?.includes(authUser?._id)}
                            />
                        ))}
                        {/* tweets - end */}
                    </div>
                </div>
                {/* Home page - start */}
                <div>
                    {/* Aside - start */}
                    <Header border={false}>
                        <SearchBar width={74} />
                    </Header>
                    <Aside className={styles.aside}>
                        <WhoToFollow />
                    </Aside>
                    {/* Aside - end */}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Bookmarks;
