import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faChartSimple, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC, useEffect, useState } from "react";
import styles from "./TweetFooter.module.css";
import { likeTweet } from "../../api/tweet.api";

interface TweetFooterProps {
    tweet: any,
    comments: string;
    reposts: string;
    likes: string;
    views: string;
    onClick?: (tweet: string) => void;
}

const TweetFooter: FC<TweetFooterProps> = ({ 
    tweet,
    comments,
    reposts,
    likes,
    views,
    onClick,
}) => {

    
    const handleLike = (tweet: any) => {
        onClick!(tweet);
    };

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
                <div className={styles.item} onClick={handleLike} >
                    <FontAwesomeIcon icon={faHeart} />
                    <p>{likes}</p>
                </div>
                <div className={styles.item}>
                    <FontAwesomeIcon icon={faChartSimple} />
                    <p>{views}</p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default TweetFooter;