import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import {
    faArrowUpFromBracket,
    faBookmark,
    faHeart as faHeartSolid,
    faPen,
} from '@fortawesome/free-solid-svg-icons';
import { faChartSimple, faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useContext, useEffect, useState } from 'react';
import styles from './TweetFooter.module.css';
import PopUpMenu from './PopUpMenu';
import {
    reTweetIcon,
    reTweetOptions,
    shareIcon,
    shareOptions,
} from '../../data/menuOptions';
import { saveTweetToBookmark } from '../../api/bookmark.api';
import { useLocation, useNavigate } from 'react-router-dom';
import { TWEET_AUDIENCE, TWEET_MENU, TWEET_TYPE } from '../../constants/common.constants';
import AuthContext from '../../context/user.context';
import { useMessage } from '../../context/successMessage.context';

interface TweetFooterProps {
    socket?: any;

    tweet?: any;
    replies: string;
    reTweets: string;
    likes: string;
    views: string;
    onClick?: (tweet: string) => void;
    isTweetReply?: boolean;
    isLiked?: boolean;
    isRetweet?: boolean;
    onClickRetweet?: Function;
    onRemoveFromBookmarks?: (tweetId: string) => void;
}

const TweetFooter: FC<TweetFooterProps> = ({
    socket,


    tweet,
    replies,
    reTweets,
    likes,
    views,
    onClick,
    isTweetReply,
    isLiked,
    isRetweet,
    onClickRetweet,
    onRemoveFromBookmarks
}) => {
    const [authUser, setAuthUser] = useState<any>(null);

    const location = useLocation();
    const navigate = useNavigate();
    
    const { showMessage } = useMessage();
    
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
        getAuthUser();
    }, []);

    const handleLike = (tweet: any) => {
        onClick!(tweet);
    };

    const onClickSaveAndUnsaveTweet = async (
        option: any,
        _id: string,
        tweet: any
        ) => {

        const res: any = await saveTweetToBookmark(tweet._id);
            
        if (res.message === 'Added') {
            showMessage('Tweet added to your Bookmarks', 'success');
        } else if (res.message === 'Removed') {
            showMessage('Tweet removed from Bookmarks', 'success');
            onRemoveFromBookmarks!(tweet._id)
        }
    };

    const onTweetReply = () => {
        navigate(`/tweet/${tweet?._id}`);
    };

    // can't tweet if it's another user's retweet with quote.
    const canRetweet =
        ((tweet?.text || tweet?.image) &&
            tweet?.type === TWEET_TYPE.reTweet &&
            authUser?._id !== tweet?.user?._id) ||
        tweet?.audience === TWEET_AUDIENCE.twitterCircle;

    const hasRetweeted = tweet?.type === TWEET_TYPE.reTweet && tweet?.text === null && tweet?.user?._id === authUser?._id

    return (
        <React.Fragment>
            <div
                className={`${styles.container} ${
                    isTweetReply ? styles.containerOnTweetReply : ''
                }`}
            >
                <div
                    className={`${styles.item} ${styles.hoverBlue} ${
                        isTweetReply ? styles.itemOnTweetReply : ''
                    }`}
                    onClick={onTweetReply}
                >
                    <FontAwesomeIcon
                        icon={faComment}
                        className={styles.faComment}
                    />
                    <p>{replies}</p>
                </div>

                <div
                    className={`${styles.item} ${styles.hoverGreen} ${
                        isTweetReply ? styles.itemOnTweetReply : ''
                    }`}
                >
                {hasRetweeted ? (
                    <>
                        <PopUpMenu
                            value={tweet}
                            isMenuIcon={false}
                            options={[TWEET_MENU.undoRetweet, TWEET_MENU.quoteTweet]!}
                            icons={{
                                'Undo Retweet': (
                                    <FontAwesomeIcon icon={faRepeat} />
                                ),
                                'Quote Tweet': (
                                    <FontAwesomeIcon icon={faPen} />
                                ),
                            }}
                            isDisable={canRetweet}
                            onClick={(option, tweet: any) =>
                                onClickRetweet!(option, tweet)
                            }
                            className={styles.retweetPopUp}
                        >
                            <FontAwesomeIcon
                                icon={faRepeat}
                                className={styles.faRepeat}
                            />
                        </PopUpMenu>
                        <p>{reTweets}</p>
                    </>
                ): (
                    <>
                    <PopUpMenu
                            value={tweet}
                            isMenuIcon={false}
                            options={reTweetOptions!}
                            icons={reTweetIcon}
                            isDisable={canRetweet}
                            onClick={(option, tweet: any) => 
                                onClickRetweet!(option, tweet)
                            }
                            className={styles.retweetPopUp}
                        >
                            <FontAwesomeIcon
                                icon={faRepeat}
                                className={styles.faRepeat}
                            />
                        </PopUpMenu>
                        <p>{reTweets}</p>
                    </>
                )}
                </div>
                
                <div
                    className={`${styles.item} ${isLiked ? styles.liked : styles.item} ${
                        styles.hoverPink
                    } ${isTweetReply ? styles.itemOnTweetReply : ''}`}
                    onClick={handleLike}
                >
                    <FontAwesomeIcon
                        icon={isLiked ? faHeartSolid : faHeart}
                        className={styles.faHeart}
                    />
                    <p>{likes}</p>
                </div>
                <div
                    className={`${styles.item} ${styles.hoverBlue} ${
                        isTweetReply ? styles.itemOnTweetReply : ''
                    }`}
                >
                    <FontAwesomeIcon
                        icon={faChartSimple}
                        className={styles.faChartSimple}
                    />
                    <p>{views}</p>
                </div>
                <div
                    className={`${styles.item} ${
                        isTweetReply ? styles.itemOnTweetReply : ''
                    }`}
                >
                    {location.pathname === '/bookmarks' ? (
                        <PopUpMenu
                            value={tweet}
                            isMenuIcon={false}
                            options={['Remove tweet']!}
                            icons={{
                                'Remove tweet': (
                                    <FontAwesomeIcon icon={faBookmark} />
                                ),
                            }}
                            onClick={onClickSaveAndUnsaveTweet}
                        >
                            <FontAwesomeIcon
                                icon={faArrowUpFromBracket}
                                className={`${styles.faArrowUpFromBracket} ${styles.hoverBlue}`}
                            />
                        </PopUpMenu>
                    ) : (
                        <PopUpMenu
                            value={tweet}
                            isMenuIcon={false}
                            options={shareOptions!}
                            icons={shareIcon}
                            onClick={onClickSaveAndUnsaveTweet}
                        >
                            <FontAwesomeIcon
                                icon={faArrowUpFromBracket}
                                className={`${styles.faArrowUpFromBracket} ${styles.hoverBlue}`}
                            />
                        </PopUpMenu>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default TweetFooter;
