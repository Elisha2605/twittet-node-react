import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faArrowUpFromBracket, faBookmark, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faChartSimple, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC, useContext } from "react";
import styles from "./TweetFooter.module.css";
import PopUpMenu from "./PopUpMenu";
import { reTweetIcon, reTweetOptions, shareIcon, shareOptions } from "../../data/menuOptions";
import { saveTweetToBookmark } from "../../api/bookmark.api";
import { useLocation, useNavigate } from 'react-router-dom';

interface TweetFooterProps {
    tweet?: any;

    replies: string;
    retTweets: string;
    likes: string;
    views: string;
    onClick?: (tweet: string) => void;
    // onClickShare?: ()
    isTweetReply?: boolean;
    isLiked?: boolean;
    onClickRetweet?: Function;
}

const TweetFooter: FC<TweetFooterProps> = ({ 
    tweet,

    replies,
    retTweets,
    likes,
    views,
    onClick,
    isTweetReply,
    isLiked,
    onClickRetweet
}) => {

    const location = useLocation();
    const navigate = useNavigate();

    const handleLike = (tweet: any) => {
        onClick!(tweet);
    };

    const onClickSaveAndUnsaveTweet = async (option: any, _id: string, tweet: any) => {
        if (option === 'Bookmark' || option === 'Remove tweet') {
            const res = await saveTweetToBookmark(tweet._id);
            console.log(res);
        }
    }

    const onTweetReply = () => {
        if (tweet?.image) {
            navigate(`/tweet/image/${tweet?._id}`)
        } else if (!tweet?.image) {
            navigate(`/tweet/${tweet?._id}`)
        }
    }  

    return (
        <React.Fragment>
            <div className={`${styles.container} ${isTweetReply ? styles.containerOnTweetReply : ''}`}>
                <div className={`${styles.item} ${styles.hoverBlue} ${isTweetReply ? styles.itemOnTweetReply   : ''}`} onClick={onTweetReply}>
                    <FontAwesomeIcon icon={faComment} className={styles.faComment} />
                    <p>{replies}</p>
                </div>
                <div className={`${styles.item} ${styles.hoverGreen} ${isTweetReply ? styles.itemOnTweetReply : ''}`}>
                    <PopUpMenu
                        value={tweet}
                        isMenuIcon={false}
                        options={reTweetOptions!}
                        icons={reTweetIcon}
                        onClick={(option, tweet) =>
                            onClickRetweet!(option, tweet)
                        }
                        className={styles.retweetPopUp}
                    > 
                        <FontAwesomeIcon icon={faRepeat} className={styles.faRepeat} />
                    </PopUpMenu>
                    <p>{retTweets}</p>
                </div>
                {isLiked ? (
                    <div className={`${styles.item} ${styles.liked} ${styles.hoverPink} ${isTweetReply ? styles.itemOnTweetReply : ''}`} onClick={handleLike} >
                        <FontAwesomeIcon icon={faHeartSolid} color={'var(--color-pink)'} className={styles.faHeart} />
                        <p>{likes}</p>
                    </div>
                ): (
                    <div className={`${styles.item} ${styles.hoverPink} ${isTweetReply ? styles.itemOnTweetReply : ''}`} onClick={handleLike} >
                        <FontAwesomeIcon icon={faHeart} className={styles.faHeart} />
                        <p>{likes}</p>
                    </div>  
                )}
                
                <div className={`${styles.item} ${styles.hoverBlue} ${isTweetReply ? styles.itemOnTweetReply : ''}`}>
                    <FontAwesomeIcon icon={faChartSimple} className={styles.faChartSimple}  />
                    <p>{views}</p>
                </div>
                    <div className={`${styles.item} ${isTweetReply ? styles.itemOnTweetReply : ''}`}>
                        {location.pathname === '/bookmarks' ? (
                            <PopUpMenu
                                value={tweet}
                                isMenuIcon={false}
                                options={['Remove tweet']!}
                                icons={{'Remove tweet': <FontAwesomeIcon icon={faBookmark} />}}
                                onClick={onClickSaveAndUnsaveTweet}
                            > 
                                <FontAwesomeIcon icon={faArrowUpFromBracket} className={`${styles.faArrowUpFromBracket} ${styles.hoverBlue}`} />
                            </PopUpMenu>
                        ): (
                            <PopUpMenu
                                value={tweet}
                                isMenuIcon={false}
                                options={shareOptions!}
                                icons={shareIcon}
                                onClick={onClickSaveAndUnsaveTweet}
                            > 
                                <FontAwesomeIcon icon={faArrowUpFromBracket} className={`${styles.faArrowUpFromBracket} ${styles.hoverBlue}`} />
                            </PopUpMenu>
                        )}
                    </div>
            </div>
        </React.Fragment>
    )
}

export default TweetFooter;