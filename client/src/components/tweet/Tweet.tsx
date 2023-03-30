import React, { FC } from 'react';
import TweetFooter from '../common/TweetFooter';
import UserInfo from '../common/UserInfo';
import styles from './Tweet.module.css';

interface TweetProps {
    avatar: string | undefined;
    firstName: string;
    username: string;
    tweet?: string;
    image?: string;
    link?: string;
    isOption?: boolean;
    comments: string;
    reposts: string;
    likes: string;
    views: string;
}

const Tweet: FC<TweetProps> = ({
    avatar,
    firstName,
    username,
    tweet,
    image,
    link,
    isOption,
    comments,
    reposts,
    likes,
    views,
}) => {
    return (
        <React.Fragment>
            <div className={styles.container}>
                <UserInfo
                    avatar={avatar}
                    firstname={firstName}
                    username={username}
                    isOption={isOption}
                    className={styles.userInfo}
                />
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
            </div>
        </React.Fragment>
    );
};

export default Tweet;
