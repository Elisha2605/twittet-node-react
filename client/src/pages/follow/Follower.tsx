import React, { useEffect, useState } from 'react';
import Aside from '../../components/aside/Aside';
import SearchBar from '../../components/ui/SearchBar';
import WhoToFollow from '../../components/ui/WhoToFollow';
import Header from '../../components/header/Header';
import styles from './Follower.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import HorizontalNavBar from '../../components/ui/HorizontalNavBar';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../../api/user.api';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import { getAuthUserFollows } from '../../api/follow.api';
import UserInfo from '../../components/ui/UserInfo';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import Button, { ButtonSize, ButtonType } from '../../components/ui/Button';

interface FollowerProps {

}

const Follower: React.FC<{}> = () => {

    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>();
    const [followers, setFollowers] = useState<any[]>([]);


    
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = async () => {
            const res = await getUserById(id!);
            const { user } = res;
            // console.log(res);
            setUser(user)
        }
        userInfo();
    }, [id]);

      // get Follow status
    useEffect(() => {
        const getAuthUserFollowStatus = async () => {
            const { followers } = await getAuthUserFollows(id!);

            setFollowers(followers);
        };
        getAuthUserFollowStatus();
    }, [id]);

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
                            <div className={''} onClick={() => navigate(`/following/${id}`)}>
                                Following
                            </div>
                            <div className={styles.active}>
                                Followers
                            </div>
                        </HorizontalNavBar>
                    </Header>  
                    
                    {/* FOR YOU - START */}
                    <div className={styles.main}>
                        {followers.map((follow) => (
                            <div key={follow._id} className={styles.followingItem} onClick={() => navigate(`/profile/${follow.user._id}`)}>   
                                <UserInfo
                                    avatar={follow.user?.avatar && `${IMAGE_AVATAR_BASE_URL}/${follow.user?.avatar}`}
                                    name={follow.user?.name}
                                    username={follow.user?.username}
                                    className={styles.userInfoWrapper}
                                >
                                    <Button
                                        className={styles.editProfileBtn}
                                        value={'Following'}
                                        type={ButtonType.tietary}
                                        size={ButtonSize.small}
                                        onClick={() => {
                                            console.log('Edit profile clicked');
                                        }}
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

export default Follower;
