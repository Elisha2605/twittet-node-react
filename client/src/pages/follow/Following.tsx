import React, { useContext, useEffect, useState } from 'react';
import Aside from '../../components/aside/Aside';
import SearchBar from '../../components/ui/SearchBar';
import WhoToFollow from '../../components/ui/WhoToFollow';
import Header from '../../components/header/Header';
import styles from './Following.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../../api/user.api';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import UserInfo from '../../components/ui/UserInfo';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import Button, { ButtonSize, ButtonType } from '../../components/ui/Button';
import HorizontalNavBar from '../../components/ui/HorizontalNavBar';
import { getAuthUserFollows, sendFollowRequest } from '../../api/follow.api';
import AuthContext from '../../context/user.context';

const Following = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>();
    const [authUser, setAuthUser] = useState<any>(null);
    const [followings, setFollowings] = useState<any[]>([]);


    const navigate = useNavigate();

    // get Auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        }
        getAuthUser();
    }, []);

    useEffect(() => {
        const userInfo = async () => {
            const res = await getUserById(id!);
            const { user } = res;
            // console.log(res);
            setUser(user);
        };
        userInfo();
    }, [id]);

    // get Follow status
    useEffect(() => {
        const getAuthUserFollowStatus = async () => {
            const { followings } = await getAuthUserFollows(id!);
            followings.forEach((following: any) => {
                following.isFollowing = true; // add the isFollowing property
            });
            setFollowings(followings);
        };
        getAuthUserFollowStatus();
    }, [id]);

     // send follow request
    const handleFollowRequest = async (e: React.MouseEvent<HTMLButtonElement>, userId: string) => {
        e.stopPropagation();
        console.log(userId);
        const res = await sendFollowRequest(authUser?._id, userId!);
        console.log(res); // delete me
        // update the follow status for the clicked user
        const newFollowings = followings.map((following) => {
            if (following.user._id === userId) {
                return {
                    ...following,
                    isFollowing: !following.isFollowing
                };
            } else {
                return following;
            }
        });
        console.log(newFollowings);
        setFollowings(newFollowings);
    }

    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                    <Header border={true}>
                        <div className={styles.headerItems}>
                            <ArrowLeftIcon onClick={() => {navigate(-1)}} />
                            <HeaderTitle
                                title={user?.name}
                                subTitle={`@${user?.username}`}
                            />
                        </div>
                        <HorizontalNavBar className={styles.homeNaveBar}>
                            <div className={styles.active}>
                                Following
                            </div>
                            <div className={''} onClick={() => navigate(`/followers/${id}`)}>
                                Followers
                            </div>
                        </HorizontalNavBar>
                    </Header>

                    {/* FOR YOU - START */}
                    <div className={styles.main}>
                        {followings.map((follow) => (
                            <div key={follow._id} className={styles.followingItem} onClick={() => navigate(`/profile/${follow.user._id}`)}>    
                                <UserInfo
                                    userId={follow.user._id}
                                    avatar={follow.user?.avatar && `${IMAGE_AVATAR_BASE_URL}/${follow.user?.avatar}`}
                                    name={follow.user?.name}
                                    isVerified={follow.user.isVerified}
                                    username={follow.user?.username}
                                    className={styles.userInfoWrapper}
                                >
                                    <Button
                                        itemId={follow.user._id}
                                        className={styles.followingBtn}
                                        value={follow.isFollowing ? 'Following' : 'Follow'}
                                        type={follow.isFollowing ? ButtonType.tietary : ButtonType.secondary}   
                                        size={ButtonSize.small}
                                        onClick={(e: any) => handleFollowRequest(e, follow.user._id)}
                                    />
                                </UserInfo>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Home page - start */}
                <div>
                    <Header border={false}>
                        <SearchBar width={74} />
                    </Header>
                    <Aside className={styles.aside}>
                        <WhoToFollow />
                    </Aside>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Following;