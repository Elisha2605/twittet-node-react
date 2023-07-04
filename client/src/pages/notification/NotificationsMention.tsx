import React, { FC, useContext, useEffect, useState } from "react";
import styles from "./NotificationsMention.module.css";
import Tweet from "../../components/tweet/Tweet";
import AuthContext from "../../context/user.context";

interface NotificationsMentionProps{
    mentions: any
}

const NotificationsMention: FC<NotificationsMentionProps> = ({ 
    mentions,
}) => {

    const [authUser, setAuthUser] = useState<any>(null);

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        }
        getAuthUser();
    }, []);



    return (
        <React.Fragment>
            <div>{mentions?.text}</div>
             <Tweet
                tweet={mentions?.sender}
                onClickMenu={() => {}}
                onClickLike={() => {}}
                isLiked={mentions?.likes?.includes(authUser?._id)}
            />
        </React.Fragment>
    )
}

export default NotificationsMention;

