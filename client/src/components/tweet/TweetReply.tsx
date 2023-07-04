import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import TweetFooter from '../ui/TweetFooter';
import UserInfo from '../ui/UserInfo';
import styles from './TweetReply.module.css';
import { getTimeDifference } from '../../utils/helpers.utils';
import { IMAGE_TWEET_BASE_URL } from '../../constants/common.constants';
import { 
    tweetMenuOptions, 
    tweetMenuIcons, 
} from '../../data/menuOptions';

interface TweetProps {
    tweet?: any;
    onClickMenu: Function;
    onClickRetweet?: Function;
    onClickLike: (tweet: any) => void;
    isRetweet?: boolean;
    isLiked?: boolean;
    isReply?: boolean;
    classNameNoImage?: string;
    onRemoveFromBookmarks?: (tweetId: string) => void;

}

const Tweet: FC<TweetProps> = ({
    tweet,
    onClickMenu,
    onClickRetweet,
    onClickLike,
    isRetweet,
    isLiked,
    isReply = false,
    classNameNoImage,
    
    onRemoveFromBookmarks
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

    let navigate = useNavigate();

    const renderColoredText = (text: string) => {
        const words = text ? text.split(' ') : [];
        return words.map((word: any, index: any) => {
            if (word.startsWith('@') || word.startsWith('#')) {
                return (
                    <a
                        key={index}
                        href={`http://127.0.0.1:3000/profile/${userId}`}
                        className={styles.coloredText}
                    >
                        {word}{' '}
                    </a>
                );
            }
            return <span key={index}>{word} </span>;
        });
    };
    
    return (
        <React.Fragment>
            <div className={`${styles.container}`} key={tweetId}>
                <div className={styles.contentWrapper}>    
                    <UserInfo
                        userId={userId}
                        tweet={tweet}
                        avatar={avatar}
                        name={name}
                        username={username}
                        isVerified={isVerfied}
                        time={createdAt}
                        isOption={true}
                        className={styles.userInfo}
                        options={tweetMenuOptions}
                        icons={tweetMenuIcons}
                        onClickOption={onClickMenu}
                        isReply={isReply}
                    />
                    <div className={styles.body} key={tweet._id} 
                        onClick={() => navigate(`/tweet/${tweet._id}`)}>
                        <p className={styles.tweet}>{tweetText}</p>
                        {tweetImage && (
                            <div className={`${styles.image} ${!isReply ? classNameNoImage : ''}`}
                            onClick={(e: any) => {
                                e.stopPropagation();
                                    navigate(`/tweet/image/${tweet._id}`);
                                }
                            }>
                                <img src={tweetImage ? `${IMAGE_TWEET_BASE_URL}/${tweetImage}` : undefined} alt="" />
                            </div>
                        )}
                    </div>
                    <TweetFooter
                        tweet={tweet}
                        replies={tweet?.replyCount === 0 ? '' : tweet?.replyCount}
                        reTweets={tweet?.retweetCount === 0 ? '' : tweet?.retweetCount}
                        likes={tweet.totalLikes > 0 ? tweet.totalLikes : ''}
                        views={tweet.viewCount > 0 ? tweet.viewCount : ''}
                        onClickRetweet={onClickRetweet}
                        onClick={() => onClickLike!(tweet)}
                        isLiked={isLiked}
                        isRetweet={isRetweet}
                        onRemoveFromBookmarks={onRemoveFromBookmarks}
                        isTweetReply={true}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Tweet;
