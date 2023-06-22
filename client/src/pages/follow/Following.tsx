import React, { useContext, useEffect, useState } from 'react';
import styles from './Following.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import UserInfo from '../../components/ui/UserInfo';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import { ButtonSize, ButtonType } from '../../components/ui/Button';
import { getUserFollows } from '../../api/follow.api';
import AuthContext from '../../context/user.context';
import FollowButton from '../../components/ui/FollowButton';

const Following = () => {
    const { id } = useParams<{ id: string }>();
    const [authUser, setAuthUser] = useState<any>(null);
    const [followings, setFollowings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const navigate = useNavigate();

    // get Auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            setIsLoading(true);
            const { user } = ctx.getUserContext();
            setAuthUser(user);
            setIsLoading(false);
        };
        getAuthUser();
    }, []);

    // get Follow status
    useEffect(() => {
        const getAuthUserFollowStatus = async () => {
            setIsLoading(true);
            const { followings } = await getUserFollows(id!);
            setFollowings(followings);
            setIsLoading(false);
        };
        getAuthUserFollowStatus();
    }, [id]);

    return (
        <React.Fragment>
            {!isLoading && authUser && (
                <div className={styles.main}>
                    {followings && followings.map((following) => (
                        <div
                            key={following?._id}
                            className={styles.followingItem}
                            onClick={() => navigate(`/profile/${following?.user?._id}`)}
                        >
                            {!isLoading && authUser && (
                                <UserInfo
                                    user={following?.user}
                                    avatar={
                                        following?.user?.avatar &&
                                        `${IMAGE_AVATAR_BASE_URL}/${following?.user?.avatar}`
                                    }
                                    name={following?.user?.name}
                                    isVerified={following?.user?.isVerified}
                                    username={following?.user?.username}
                                    className={styles.userInfoWrapper}
                                >
                                    <FollowButton
                                        userId={following?.user?._id}
                                        type={ButtonType.secondary}
                                        size={ButtonSize.small}
                                    />
                                </UserInfo>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </React.Fragment>
    );
};

export default Following;
