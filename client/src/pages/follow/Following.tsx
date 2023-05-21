import React, { useContext, useEffect, useState } from 'react';
import styles from './Following.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../../api/user.api';
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

    const navigate = useNavigate();

    // get Auth user
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
            const { followings } = await getUserFollows(id!);
            setFollowings(followings);
        };
        getAuthUserFollowStatus();
    }, [id]);

    return (
        <React.Fragment>
            <div className={styles.main}>
                {followings.map((follow) => (
                    <div
                        key={follow._id}
                        className={styles.followingItem}
                        onClick={() => navigate(`/profile/${follow.user._id}`)}
                    >
                        <UserInfo
                            userId={follow.user._id}
                            avatar={
                                follow.user?.avatar &&
                                `${IMAGE_AVATAR_BASE_URL}/${follow.user?.avatar}`
                            }
                            name={follow.user?.name}
                            isVerified={follow.user.isVerified}
                            username={follow.user?.username}
                            className={styles.userInfoWrapper}
                        >
                            {authUser?._id !== follow.user._id && (
                                <FollowButton
                                    userId={follow.user._id}
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

export default Following;
