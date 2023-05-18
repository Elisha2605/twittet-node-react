import React, { FC } from "react";
import styles from "./NotificationsLike.module.css";
import UserInfo from "../../components/ui/UserInfo";
import { IMAGE_AVATAR_BASE_URL } from "../../constants/common.constants";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

interface NotificationsLikeProps{
    likes: any
}

const NotificationsLike: FC<NotificationsLikeProps> = ({ 
    likes,
}) => {

    const navigate = useNavigate();

    

    return (
        <React.Fragment>
            <div className={styles.container} onClick={() => navigate(`/tweet/${likes?._id}`)}>
                <div className={styles.wrapper}>  
                    <UserInfo
                        userId={likes?.user?._id}
                        avatar={likes?.user?.avatar && `${IMAGE_AVATAR_BASE_URL}/${likes?.user?.avatar}`}
                        name={likes?.user?.name}
                        isProtected={likes?.user?.isProtected}
                        isVerified={likes?.user?.isVerified}
                        username={likes?.user?.username}
                        className={styles.userInfoWrapper}
                        isNavigate={false}
                        >
                    </UserInfo>
                    <FontAwesomeIcon icon={faHeart} size={'xl'} color={'var(--color-pink)'} />
                    <p className={styles.message}>{likes?.message}</p> 
                </div>   
            </div>

        </React.Fragment>
    )
}

export default NotificationsLike;

