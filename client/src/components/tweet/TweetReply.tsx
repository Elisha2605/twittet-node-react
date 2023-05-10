import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import TweetFooter from '../ui/TweetFooter';
import UserInfo from '../ui/UserInfo';
import styles from './TweetReply.module.css';
import { getTimeDifference } from '../../utils/helpers.utils';
import { IMAGE_AVATAR_BASE_URL, IMAGE_TWEET_REPLY_BASE_URL } from '../../constants/common.constants';
import { 
    tweetMenuOptions, 
    tweetMenuIcons, 
} from '../../data/menuOptions';

interface TweetProps {
    tweet?: any;
    onClickMenu: Function;
    onClickLike: (tweet: any) => void;
    isReply?: boolean;
    classNameNoImage?: string;
}

const Tweet: FC<TweetProps> = ({
    tweet,
    onClickMenu,
    onClickLike,
    isReply = false,
    classNameNoImage,
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

    const goToTweetPage = () => {
        if (tweet?.image) {
            navigate(`/tweet/image/${tweetId}`)
        } else {
            navigate(`/tweet/${tweetId}`)
        }
    }
    
    
    return (
        <React.Fragment>
            <div className={`${styles.container}`} key={tweetId}>
                <div className={styles.contentWrapper}>    
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
                        isReply={isReply}
                    />
                    <div className={styles.body} key={tweet._id} onClick={goToTweetPage}>
                        <p className={styles.tweet}>{tweetText}</p>
                        {tweetImage && (
                            <div className={`${styles.image} ${!isReply ? classNameNoImage : ''}`}>
                                <img src={tweetImage ? `${IMAGE_TWEET_REPLY_BASE_URL}/${tweetImage}` : undefined} alt="" />
                            </div>
                        )}
                    </div>

                    <TweetFooter
                        tweet={tweet}
                        comments={'1'}
                        reposts={'9'}
                        likesCount={tweet.totalLikes > 0 ? tweet.totalLikes: '' }
                        views={'4'}
                        onClick={() => onClickLike(tweet)}
                        isTweetReply={isReply}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Tweet;
