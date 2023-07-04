import React, { useContext, useEffect, useState } from 'react';
import styles from './Follower.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserFollows } from '../../api/follow.api';
import UserInfo from '../../components/ui/UserInfo';
import { ButtonSize, ButtonType } from '../../components/ui/Button';
import AuthContext from '../../context/user.context';
import FollowButton from '../../components/ui/FollowButton';

const Follower: React.FC<{}> = () => {
    const { id } = useParams<{ id: string }>();
    const [authUser, setAuthUser] = useState<any>(null);
    const [followers, setFollowers] = useState<any[]>([]);

    const navigate = useNavigate();

    // get auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
        getAuthUser();
    }, []);

    // get Follow status
    useEffect(() => {
        const getAuthUserFollowStatus = async () => {
            const { followers } = await getUserFollows(id!);
            setFollowers(followers);
        };
        getAuthUserFollowStatus();
    }, [id]);

    return (
        <React.Fragment>
            {/* FOR YOU - START */}
            <div className={styles.main}>
                {followers && followers.map((follower) => (
                    <div
                        key={follower?._id}
                        className={styles.followingItem}
                        onClick={() =>
                            navigate(`/profile/${follower?.user?._id}`)
                        }
                    >
                        <UserInfo
                            user={follower?.user}
                            avatar={follower?.user?.avatar}
                            isVerified={follower?.user?.isVerified}
                            name={follower?.user?.name}
                            username={follower?.user?.username}
                            className={styles.userInfoWrapper}
                        >
                            {authUser?._id !== follower?.user?._id && (
                                <FollowButton
                                    userId={follower?.user?._id}
                                    type={ButtonType.secondary}
                                    size={ButtonSize.small}
                                />
                            )}
                        </UserInfo>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
};

export default Follower;
