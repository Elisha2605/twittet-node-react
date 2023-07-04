import React, { FC } from "react";
import styles from "./NotificationsLike.module.css";
import UserInfo from "../../components/ui/UserInfo";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { getTimeDifference } from "../../utils/helpers.utils";

interface NotificationsLikeProps{
    like: any
}

const NotificationsLike: FC<NotificationsLikeProps> = ({ 
    like,
}) => {

    const navigate = useNavigate();

    

    return (
        <React.Fragment>
            <div className={styles.container} onClick={() => navigate(`/tweet/${like?._id}`)}>
                <div className={styles.wrapper}>  
                    <UserInfo
                        userId={like?.user?._id}
                        avatar={like?.user?.avatar}
                        name={like?.user?.name}
                        isVerified={like?.user?.isVerified}
                        username={like?.user?.username}
                        className={styles.userInfoWrapper}
                        isNavigate={false}
                        >
                    · <div>{getTimeDifference(new Date(like?.createdAt).getTime())}</div>
                    </UserInfo>
                    <div className={styles.notificationMessageWrapper}>
                        <FontAwesomeIcon icon={faHeart} size={'xl'} color={'var(--color-pink)'} />
                        <p className={styles.message}>{like?.message}</p> 
                    </div>
                </div>   
            </div>

        </React.Fragment>
    )
}

export default NotificationsLike;

