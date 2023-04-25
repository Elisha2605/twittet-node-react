import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import TweetFooter from '../ui/TweetFooter';
import UserInfo from '../ui/UserInfo';
import styles from './Tweet.module.css';

interface TweetProps {
    tweetId?: string;
    userId?: string;
    avatar: string | null | undefined;
    name: string;
    username: string;
    isVerfied?: boolean;
    time?: string;
    tweetText?: string;
    tweetImage?: string | null;
    link?: string;
    isOption?: boolean;
    comments: string;
    reposts: string;
    likes: string;
    views: string;
    options: string[];
    icons?: Record<string, React.ReactNode>;
    onClickMenu: Function;
    tweetKey?: React.Key;
}

const Tweet: FC<TweetProps> = ({
    tweetId,
    userId,
    avatar,
    name,
    username,
    isVerfied,
    time,
    tweetText,
    tweetImage,
    link,
    isOption,
    comments,
    reposts,
    likes,
    views,
    options,
    icons,
    onClickMenu,
    tweetKey,
}) => {

    return (
        <React.Fragment>
            <div className={`${styles.container}`} key={tweetKey}>
                <UserInfo
                    itemId={tweetId}
                    userId={userId}
                    avatar={avatar ? avatar : undefined}
                    name={name}
                    username={username}
                    isVerified={isVerfied}
                    time={time}
                    isOption={isOption}
                    className={styles.userInfo}
                    options={options}
                    icons={icons}
                    onClickOption={onClickMenu}
                />
                <NavLink to={'/message'}>
                    <div className={styles.body}>
                        <p className={styles.tweet}>{tweetText}</p>
                        {tweetImage && (
                            <div className={styles.image}>
                                <img src={tweetImage} alt="" />
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
