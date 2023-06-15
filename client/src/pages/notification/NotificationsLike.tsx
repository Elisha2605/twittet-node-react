import React, { FC } from "react";
import styles from "./NotificationsLike.module.css";
import UserInfo from "../../components/ui/UserInfo";
import { IMAGE_AVATAR_BASE_URL } from "../../constants/common.constants";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

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
                        avatar={like?.user?.avatar && `${IMAGE_AVATAR_BASE_URL}/${like?.user?.avatar}`}
                        name={like?.user?.name}
                        isVerified={like?.user?.isVerified}
                        username={like?.user?.username}
                        className={styles.userInfoWrapper}
                        isNavigate={false}
                        >
                    </UserInfo>
                    <FontAwesomeIcon icon={faHeart} size={'xl'} color={'var(--color-pink)'} />
                    <p className={styles.message}>{like?.message}</p> 
                </div>   
            </div>

        </React.Fragment>
    )
}

export default NotificationsLike;

