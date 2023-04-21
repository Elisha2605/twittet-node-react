import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import { options, icons } from '../data/menuOptions';
import useAuthUser from '../hooks/userAuth.hook';
import { getAllTweets } from '../api/tweet.api';
import { getTimeDifference } from '../utils/helpers.utils';

const Home = () => {
    const [tweets, setTweets] = useState([]);

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
    if (!authUser) {
        return null;
    }
    const avatar = require(`../uploads/avatar/${authUser.avatar}`);

    const handleOptionClick = (option: string, tweetId: string) => {
        // TODO: handle menu option clickes
        
        if (option === 'Delete') {
            console.log(option);
            console.log(tweetId);
        } else if (option === 'Edit') {
            console.log(option);
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
                            <div className={styles.active}>For you</div>
                            <div>Following</div>
                        </HorizontalNavBar>
                    </Header>
                    <div className={styles.main}>
                        {/* TweetForm - start */}
                        <div className={styles.formSection}>
                            <Avatar
                                path={avatar}
                                size={Size.small}
                                className={''}
                            />
                            <FormTweet />
                        </div>
                        {/* TweetForm - end */}
                        
                        {/* tweets - start */}
                        {tweets.map((tweet: any) => (
                            <Tweet
                            tweetId={tweet._id}
                            key={tweet._id}
                            avatar={require(`../uploads/avatar/${tweet.user.avatar}`)}
                            firstName={tweet.user.name}
                            username={tweet.user.username}
                            time={getTimeDifference(new Date(tweet.createdAt).getTime())}
                            tweet={tweet.text}
                            image={tweet.image && require(`../uploads/tweetImage/${tweet.image}`)}
                            isOption={true}
                            comments={'164'}
                            reposts={'924'}
                            likes={'21.3'}
                            views={'446'}
                            options={options}
                            icons={icons}
                            onClickOption={handleOptionClick}
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
