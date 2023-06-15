import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TweetFooter from '../ui/TweetFooter';
import UserInfo from '../ui/UserInfo';
import styles from './Tweet.module.css';
import { getTimeDifference } from '../../utils/helpers.utils';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_AVATAR_DEFAULT,
    IMAGE_TWEET_BASE_URL,
    IMAGE_TWEET_REPLY_BASE_URL,
    TWEET_AUDIENCE,
    TWEET_REPLY,
    TWEET_TYPE,
} from '../../constants/common.constants';
import HeartIcon from '../icons/HeartIcon';
import UserIcon from '../icons/UserIcon';
import AtIcon from '../icons/AtIcon';
import { tweetMenuOptions, tweetMenuIcons } from '../../data/menuOptions';
import UserInfoRetweet from '../ui/UserInfoRetweet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/user.context';
import { getAuthUserFollows } from '../../api/follow.api';

interface TweetProps {
    tweet?: any;
    onClickMenu?: Function;
    onClickRetweet?: Function;
    onClickLike?: (tweet: any) => void;
    isLiked?: boolean;
    isRetweet?: boolean;
    isReply?: boolean;
    onRemoveFromBookmarks?: (tweetId: string) => void;
}

const Tweet: FC<TweetProps> = ({
    tweet,
    onClickMenu,
    onClickRetweet,
    onClickLike,
    isLiked,
    isReply,
    isRetweet = false,
    onRemoveFromBookmarks
}) => {

    const [authUser, setAuthUser] = useState<any>(null);
    const [followers, setFollowers] = useState<any>([]);

    const imgRef = useRef<HTMLImageElement>(null);
    
    // regular tweet
    const tweetId = tweet?._id;
    const createdAt = getTimeDifference(new Date(tweet?.createdAt).getTime());
    const tweetImage = tweet?.image;
    const text = tweet?.text;

    const userId = tweet?.user?._id;
    const name = tweet?.user?.name;
    const username = tweet?.user?.username;
    const avatar = tweet?.user?.avatar;
    const isVerfied = tweet?.user?.isVerified;

    // reTweet
    const { retweet } = tweet;
    const retweetId = retweet?.tweet?._id;
    const retweetCreatedAt = getTimeDifference(new Date(retweet?.tweet?.createdAt).getTime());
    const retweetImage = retweet?.tweet?.image;
    const retweetText = retweet?.tweet?.text;

    const retweetUserId = retweet?.user?._id;
    const retweetUserName = retweet?.user?.name;
    const retweetUserUsername = retweet?.user?.username;
    const isVerfiedRetweetUser = retweet?.user?.isVerified;
    const retweetUserAvatar = retweet?.user?.avatar;

    let navigate = useNavigate();

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        }
        getAuthUser();
    }, []);

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

    const goToTweetPage = () => {
        if (tweet?.image) {
            navigate(`/tweet/image/${tweet._id}`);
        } else {
            navigate(`/tweet/${tweet._id}`);
        }
    };

    const hasRetweetAndTweetImage =  retweetImage && tweetImage;

    useEffect(() => {
        const fetchAuthUserData = async () => {
            const { followers } = await getAuthUserFollows();
            setFollowers(followers);
        };
        fetchAuthUserData();
    }, []);

    const isOnlyPeopleYouFollow = (userId: string): boolean => {
        if (followers &&
            tweet?.user?._id !== authUser?._id &&
            tweet?.reply === TWEET_REPLY.peopleYouFollow &&
            followers.some((following: any) => following?.user?._id === userId)
        ) {
            return true;
        }
        return false;
    };

    const isMention = (userId: string): boolean => {
        if (
            tweet &&
            tweet.mentions &&
            tweet?.user?._id !== authUser?._id &&
            !tweet.mentions.includes(userId)
        ) {
            return false;
        }
        return true;
    };

    const handleImageLoad = () => {
        if (imgRef.current) {
          // Check if the image height exceeds the threshold
          if (imgRef.current.offsetHeight > 200) { // Set your desired threshold here
            // Add the 'imageFixedHeight' class to limit the image height
            const parentElement = imgRef.current.parentNode as HTMLElement;
            parentElement.classList.add(styles.imageFixedHeight);
          }
        }
    };

    return (
        <React.Fragment>
            <div className={`${styles.container}`} key={tweetId}>
                {/* RETWEET - START */}

                {tweet?.type === TWEET_TYPE.reTweet ? (
                    <>
                        {!tweetImage && !text && authUser && (
                            <div className={styles.whoRetweeted}>
                                <FontAwesomeIcon icon={faRepeat} className={styles.faRepeat} />
                                {authUser?._id === userId ? (
                                    <div>You Retweeted</div>
                                ): (
                                    <p>{name} Retweeted</p>
                                )}
                            </div>
                        )}
                        <UserInfo
                            userId={userId}
                            tweet={tweet}
                            avatar={
                                avatar
                                    ? `${IMAGE_AVATAR_BASE_URL}/${avatar}`
                                    : `${IMAGE_AVATAR_BASE_URL}/${IMAGE_AVATAR_DEFAULT}`
                            }
                            name={name}
                            username={username}
                            isVerified={isVerfied}
                            time={createdAt}
                            isOption={true}
                            className={styles.userInfo}
                            options={tweetMenuOptions}
                            icons={tweetMenuIcons}
                            onClickOption={onClickMenu}
                            isNavigate={true}
                        />
                        <div
                            className={styles.body}
                            key={tweet._id}
                            onClick={() => navigate(`/tweet/${tweet._id}`)}
                        >
                            <p className={styles.tweet}>
                                {renderColoredText(text)}
                            </p>
                            {tweetImage && (
                                <div className={styles.image}>
                                    <img
                                        ref={imgRef}
                                        src={
                                            tweetImage
                                                ? `${IMAGE_TWEET_BASE_URL}/${tweetImage}`
                                                : undefined
                                        }
                                        alt=""
                                        onLoad={handleImageLoad}
                                    />
                                </div>
                            )}
                            <div className={`${styles.retweetContainer} ${hasRetweetAndTweetImage ? styles.reTweetWithImageContainer : ''}`} onClick={() => navigate(`/tweet/${retweetId}`)}>
                                <UserInfoRetweet
                                    userId={retweetUserId}
                                    tweet={retweet}
                                    avatar={
                                        avatar
                                            ? `${IMAGE_AVATAR_BASE_URL}/${retweetUserAvatar}`
                                            : undefined
                                    }
                                    name={retweetUserName}
                                    username={retweetUserUsername}
                                    isVerified={isVerfiedRetweetUser}
                                    time={retweetCreatedAt}
                                    isOption={true}
                                    className={styles.userInfoRetweet}
                                    options={tweetMenuOptions}
                                    icons={tweetMenuIcons}
                                    onClickOption={onClickMenu}
                                    isNavigate={true}
                                />
                                <div
                                    className={`${styles.retweetBody} ${hasRetweetAndTweetImage ? styles.reTweetWithImageBody : ''}`}
                                    key={retweetId}
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        navigate(`/tweet/${retweetId}`);
                                        }
                                }>
                                    <p className={`${styles.reTweetText} ${hasRetweetAndTweetImage ? styles.reTweetWithImageText : ''}`}>
                                        {renderColoredText(retweetText && retweetText.length > 150 ? retweetText.substring(0, 150) + '...' : retweetText)}
                                    </p>
                                    {retweetImage && (
                                        <div className={`${styles.reTweetImage} ${hasRetweetAndTweetImage ? styles.reTweetWithImageImage : ''}`}>
                                            {!isReply ? (
                                                <img
                                                    ref={imgRef}
                                                    src={
                                                        retweetImage
                                                            ? `${IMAGE_TWEET_BASE_URL}/${retweetImage}`
                                                            : undefined
                                                    }
                                                    alt=""
                                                    onLoad={handleImageLoad}
                                                />
                                            ): (
                                                <img
                                                ref={imgRef}
                                                src={
                                                    retweetImage
                                                        ? `${IMAGE_TWEET_REPLY_BASE_URL}/${retweetImage}`
                                                        : undefined
                                                }
                                                alt=""
                                                onLoad={handleImageLoad}
                                            />
                                            )}
                                        </div>
                                    )}
                                </div>           
                            </div>
                        </div>
                    {/* RETWEET - END */}
                    </>
                ): (
                    <>
                    {/* RGULAR TWEET - START */}

                        <UserInfo
                            userId={userId}
                            tweet={tweet}
                            avatar={
                                avatar
                                    ? `${IMAGE_AVATAR_BASE_URL}/${avatar}`
                                    : `${IMAGE_AVATAR_BASE_URL}/${IMAGE_AVATAR_DEFAULT}`
                            }
                            name={name}
                            username={username}
                            isVerified={isVerfied}
                            time={createdAt}
                            isOption={true}
                            className={styles.userInfo}
                            options={tweetMenuOptions}
                            icons={tweetMenuIcons}
                            onClickOption={onClickMenu}
                            isNavigate={true}
                        />
                        <div
                            className={styles.body}
                            key={tweet._id}
                            onClick={() => navigate(`/tweet/${tweet._id}`)}
                        >
                            <p className={styles.tweet}>
                                {renderColoredText(tweet.text)}
                            </p>
                            {tweetImage && (
                                <div 
                                    className={`${styles.image}`} 
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        navigate(`/tweet/image/${tweet._id}`);
                                    }
                                }>
                                    {tweet?.isReply ? (
                                        <img
                                            ref={imgRef}
                                            src={
                                                tweetImage
                                                    ? `${IMAGE_TWEET_REPLY_BASE_URL}/${tweetImage}`
                                                    : undefined
                                            }
                                            alt=""
                                            onLoad={handleImageLoad}
                                        />
                                    ): (
                                        <img
                                            ref={imgRef}
                                            src={
                                                tweetImage
                                                    ? `${IMAGE_TWEET_BASE_URL}/${tweetImage}`
                                                    : undefined
                                            }
                                            alt=""
                                            onLoad={handleImageLoad}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
                {/* RGULAR TWEET - END */}
                
                {tweet.audience === TWEET_AUDIENCE.twitterCircle ? (
                    <div className={styles.twitterCircle}>
                        <span className={styles.icon}>
                            <HeartIcon small={true} />
                        </span>{' '}
                        <span>
                            Only people in @{username}'s Twitter Circle can see
                            this Tweet
                        </span>
                    </div>
                ) : tweet.reply === TWEET_REPLY.peopleYouFollow && isOnlyPeopleYouFollow(userId) ? (
                    <div className={styles.tweetReply}>
                        <span className={styles.icon}>
                            <UserIcon isSmall={true} />
                        </span>{' '}
                        <span>You can reply to this conversation</span>
                    </div>
                ) : (tweet.reply === TWEET_REPLY.onlyPeopleYouMention  && isMention(authUser?._id)) && (
                     (
                        <div className={styles.tweetReply}>
                            <span className={styles.icon}>
                                <AtIcon isSmall={true} />
                            </span>{' '}
                            <span>You can reply to this conversation</span>
                        </div>
                    )
                )}
                <TweetFooter
                    tweet={tweet}
                    replies={tweet?.replyCount === 0 ? '' : tweet?.replyCount}
                    reTweets={tweet?.retweetCount === 0 ? '' : tweet?.retweetCount}
                    likes={tweet?.totalLikes > 0 ? tweet?.totalLikes : ''}
                    views={tweet?.viewCount > 0 ? tweet?.viewCount : ''}
                    onClickRetweet={onClickRetweet}
                    onClick={() => onClickLike!(tweet)}
                    isLiked={isLiked}
                    isRetweet={isRetweet}
                    onRemoveFromBookmarks={onRemoveFromBookmarks}
                />
            </div>
        </React.Fragment>
    );
};

export default Tweet;
