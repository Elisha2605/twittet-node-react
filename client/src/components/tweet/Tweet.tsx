import React, { FC, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import TweetFooter from '../ui/TweetFooter';
import UserInfo from '../ui/UserInfo';
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
    options: string[];
    onClickOption: Function;
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
    options,
    onClickOption,
}) => {
    
    return (
        <React.Fragment>
                <div className={`${styles.container}`}>

                    <UserInfo
                        avatar={avatar}
                        firstname={firstName}
                        username={username}
                        isOption={isOption}
                        className={styles.userInfo}
                        options={options}
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
