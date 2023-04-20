import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import TweetFooter from '../ui/TweetFooter';
import UserInfo from '../ui/UserInfo';
import styles from './Tweet.module.css';

interface TweetProps {
    avatar: string | undefined;
    firstName: string;
    username: string;
    time?: string;
    tweet?: string;
    image?: string;
    link?: string;
    isOption?: boolean;
    comments: string;
    reposts: string;
    likes: string;
    views: string;
    options: string[];
    icons?: Record<string, React.ReactNode>;
    onClickOption: Function;
    tweetKey?: React.Key;
}

const Tweet: FC<TweetProps> = ({
    avatar,
    firstName,
    username,
    time,
    tweet,
    image,
    link,
    isOption,
    comments,
    reposts,
    likes,
    views,
    options,
    icons,
    onClickOption,
    tweetKey,
}) => {
    
    return (
        <React.Fragment>
                <div className={`${styles.container}`} key={tweetKey}>
                    <UserInfo
                        avatar={avatar}
                        firstname={firstName}
                        username={username}
                        time={time}
                        isOption={isOption}
                        className={styles.userInfo}
                        options={options}
                        icons={icons}
                        onClickOption={onClickOption}
                    />
                    <NavLink to={'/message'}>
                        <div className={styles.body}>
                            <p className={styles.tweet}>{tweet}</p>
                            {image && (
                                <div className={styles.image}>
                                    <img src={image} alt="" />
                                </div>
                            )}
                        </div>
                        <TweetFooter
                            comments={comments}
                            reposts={reposts}
                            likes={likes}
                            views={views}
                        />
                    </NavLink>
                </div>
        </React.Fragment>
    );
};

export default Tweet;
