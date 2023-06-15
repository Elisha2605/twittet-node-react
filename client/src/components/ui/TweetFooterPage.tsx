import {
    faBookmark,
    faHeart as faHeartSolid,
    faPen,
} from '@fortawesome/free-solid-svg-icons';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useContext, useEffect, useState } from 'react';
import styles from './TweetFooterPage.module.css';
import PopUpMenu from './PopUpMenu';
import {
    reTweetIcon,
    reTweetOptions,
} from '../../data/menuOptions';
import { useNavigate } from 'react-router-dom';
import { TWEET_AUDIENCE, TWEET_MENU, TWEET_TYPE } from '../../constants/common.constants';
import AuthContext from '../../context/user.context';
import {
    faBookmark as faBookmarkRegular,
    faComment,
    faHeart,
} from '@fortawesome/free-regular-svg-icons';

interface TweetFooterProps {
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
    isSaved: Function;
    onClickBookmark: Function;
}

const TweetFooter: FC<TweetFooterProps> = ({
    tweet,
    reTweets,
    onClick,
    isTweetReply,
    isLiked,
    onClickRetweet,
    isSaved,
    onClickBookmark
}) => {
    const [authUser, setAuthUser] = useState<any>(null);

    const navigate = useNavigate();
    
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
                        size={'lg'}
                        className={styles.faComment}
                    />
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
                            classNameContainer={styles.popUpRetweetContainer}
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
                                size={'lg'}
                                className={styles.faRepeat}
                            />
                        </PopUpMenu>

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
                        size={'lg'}
                        className={styles.faHeart}
                    />
                </div>
                <div
                    className={`${styles.item} ${
                        isTweetReply ? styles.itemOnTweetReply : ''
                    }`}
                >
                    <div onClick={() => onClickBookmark()}>
                        <FontAwesomeIcon
                            icon={isSaved() ? faBookmark : faBookmarkRegular}
                            color={isSaved() ? 'var(--color-primary)': ''}
                            size={'lg'}
                            className={`${styles.faBookmark}`}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default TweetFooter;
