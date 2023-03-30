import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faChartSimple, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styles from "./TweetFooter.module.css";

interface TweetFooterProps {
    comments: string;
    reposts: string;
    likes: string;
    views: string;
}

const TweetFooter: FC<TweetFooterProps> = ({ 
    comments,
    reposts,
    likes,
    views
}) => {

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
                <div className={styles.item}>
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