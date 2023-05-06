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
}

const TweetFooter: FC<TweetFooterProps> = ({ 
    tweet,
    comments,
    reposts,
    likes,
    views,
    onClick,
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
            <div className={styles.container}>
                <div className={styles.item}>
                    <FontAwesomeIcon icon={faComment} />
                    <p>{comments}</p>
                </div>
                <div className={styles.item}>
                    <FontAwesomeIcon icon={faRepeat} />
                    <p>{reposts}</p>
                </div>
                {likes ? (
                    <div className={`${styles.item} ${styles.liked}`} onClick={handleLike} >
                        <FontAwesomeIcon icon={faHeartSolid} color={'var(--color-pink)'} />
                        <p>{likes}</p>
                    </div>
                ): (
                    <div className={styles.item} onClick={handleLike} >
                        <FontAwesomeIcon icon={faHeart} />
                        <p>{likes}</p>
                    </div>  
                )}
                
                <div className={styles.item}>
                    <FontAwesomeIcon icon={faChartSimple} />
                    <p>{views}</p>
                </div>
                    <div className={styles.item}>
                        {location.pathname === '/bookmarks' ? (
                            <PopUpMenu
                                value={tweet}
                                isMenuIcon={false}
                                options={['Remove tweet']!}
                                icons={{'Remove tweet': <FontAwesomeIcon icon={faBookmark} />}}
                                onClick={onClickShare}
                            > 
                                <FontAwesomeIcon icon={faArrowUpFromBracket} />
                            </PopUpMenu>
                        ): (
                            <PopUpMenu
                                value={tweet}
                                isMenuIcon={false}
                                options={shareOptions!}
                                icons={shareIcon}
                                onClick={onClickShare}
                            > 
                                <FontAwesomeIcon icon={faArrowUpFromBracket} />
                            </PopUpMenu>
                        )}
                    </div>
            </div>
        </React.Fragment>
    )
}

export default TweetFooter;