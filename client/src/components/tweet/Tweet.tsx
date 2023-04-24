import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import TweetFooter from '../ui/TweetFooter';
import UserInfo from '../ui/UserInfo';
import styles from './Tweet.module.css';

interface TweetProps {
    tweetId?: string;
    avatar: string | null | undefined;
    firstName: string;
    username: string;
    isVerfied?: boolean;
    time?: string;
    tweet?: string;
    image?: string | null;
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
    avatar,
    firstName,
    username,
    isVerfied,
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
    onClickMenu,
    tweetKey,
}) => {
    return (
        <React.Fragment>
            <div className={`${styles.container}`} key={tweetKey}>
                <UserInfo
                    id={tweetId}
                    avatar={avatar ? avatar : undefined}
                    firstname={firstName}
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
