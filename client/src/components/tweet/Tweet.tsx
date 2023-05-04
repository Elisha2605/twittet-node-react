import React, { FC, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import TweetFooter from '../ui/TweetFooter';
import UserInfo from '../ui/UserInfo';
import styles from './Tweet.module.css';
import { getTimeDifference } from '../../utils/helpers.utils';
import { IMAGE_AVATAR_BASE_URL, IMAGE_TWEET_BASE_URL, TWEET_AUDIENCE, TWEET_REPLY } from '../../constants/common.constants';
import HeartIcon from '../icons/HeartIcon';
import UserIcon from '../icons/UserIcon';
import AtIcon from '../icons/AtIcon';
import { 
    tweetMenuOptions, 
    tweetMenuIcons, 
} from '../../data/menuOptions';

interface TweetProps {
    tweet?: any;
    onClickMenu: Function;
    onClickLike: (tweet: any) => void;
}

const Tweet: FC<TweetProps> = ({
    tweet,
    onClickMenu,
    onClickLike,
}) => {
    
    const tweetId = tweet?._id;
    const createdAt = getTimeDifference(new Date(tweet?.createdAt).getTime());
    const tweetText = tweet?.text;
    const tweetImage = tweet?.image;
    
    const userId = tweet?.user?._id;
    const name = tweet?.user?.name;
    const username = tweet?.user?.username;
    const isVerfied = tweet?.user?.isVerified;
    const avatar = tweet?.user?.avatar;

    
    return (
        <React.Fragment>
            <div className={`${styles.container}`} key={tweetId}>
                <UserInfo
                    userId={userId}
                    tweet={tweet}
                    avatar={avatar ? `${IMAGE_AVATAR_BASE_URL}/${avatar}` : undefined}
                    name={name}
                    username={username}
                    isVerified={isVerfied}
                    time={createdAt}
                    isOption={true}
                    className={styles.userInfo}
                    options={tweetMenuOptions}
                    icons={tweetMenuIcons}
                    onClickOption={onClickMenu}
                />
                <NavLink to={'/message'}>
                    <div className={styles.body} key={tweet._id}>
                        <p className={styles.tweet}>{tweetText}</p>
                        {tweetImage && (
                            <div className={styles.image}>
                                <img src={tweetImage ? `${IMAGE_TWEET_BASE_URL}/${tweetImage}` : undefined} alt="" />
                            </div>
                        )}
                    </div>
                    {tweet.audience === TWEET_AUDIENCE.twitterCircle ? (
                        <div className={styles.twitterCircle}>
                            <span className={styles.icon}><HeartIcon small={true} /></span> <span>Only people in @{username}'s Twitter Circle can see this Tweet</span>
                        </div>
                        
                    ) : (tweet.reply === TWEET_REPLY.peopleYouFollow) ? (
                        <div className={styles.tweetReply}>
                            <span className={styles.icon}><UserIcon small={true} /></span> <span>You can reply to this conversation</span>
                        </div>
                    ) : (tweet.reply === TWEET_REPLY.onlyPeopleYouMention) && (
                        <div className={styles.tweetReply}>
                            <span className={styles.icon}><AtIcon small={true} /></span> <span>You can reply to this conversation</span>
                        </div>
                    )}
                </NavLink>
                    <TweetFooter
                        tweet={tweet}
                        comments={'164'}
                        reposts={'923'}
                        likes={tweet.totalLikes > 0 ? tweet.totalLikes: '' }
                        views={'466'}
                        onClick={() => onClickLike(tweet)}
                    />
            </div>
        </React.Fragment>
    );
};

export default Tweet;
