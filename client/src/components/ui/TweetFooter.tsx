import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faArrowUpFromBracket, faBookmark, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faChartSimple, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styles from "./TweetFooter.module.css";
import PopUpMenu from "./PopUpMenu";
import { shareIcon, shareOptions } from "../../data/menuOptions";
import { saveTweetToBookmark } from "../../api/bookmark.api";
import { useLocation } from 'react-router-dom';

interface TweetFooterProps {
    tweet?: any;
    comments: string;
    reposts: string;
    likes: string;
    views: string;
    onClick?: (tweet: string) => void;
    // onClickShare?: ()
    isTweetReply?: boolean;
}

const TweetFooter: FC<TweetFooterProps> = ({ 
    tweet,
    comments,
    reposts,
    likes,
    views,
    onClick,
    isTweetReply
}) => {

    const location = useLocation();

    const handleLike = (tweet: any) => {
        onClick!(tweet);
    };

    const onClickShare = async (option: any, _id: string, tweet: any) => {
        if (option === 'Bookmark' || option === 'Remove tweet') {
            const res = await saveTweetToBookmark(tweet._id);
            console.log(res);
        }
    }

    return (
        <React.Fragment>
            <div className={`${styles.container} ${isTweetReply ? styles.containerOnTweetReply : ''}`}>
                <div className={`${styles.item} ${styles.hoverBlue} ${isTweetReply ? styles.itemOnTweetReply   : ''}`}>
                    <FontAwesomeIcon icon={faComment} className={styles.faComment} />
                    <p>{comments}</p>
                </div>
                <div className={`${styles.item} ${styles.hoverGreen} ${isTweetReply ? styles.itemOnTweetReply : ''}`}>
                    <FontAwesomeIcon icon={faRepeat} className={styles.faRepeat} />
                    <p>{reposts}</p>
                </div>
                {likes ? (
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
                                onClick={onClickShare}
                            > 
                                <FontAwesomeIcon icon={faArrowUpFromBracket} className={`${styles.faArrowUpFromBracket} ${styles.hoverBlue}`} />
                            </PopUpMenu>
                        ): (
                            <PopUpMenu
                                value={tweet}
                                isMenuIcon={false}
                                options={shareOptions!}
                                icons={shareIcon}
                                onClick={onClickShare}
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