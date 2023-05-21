import React, { useContext, useEffect, useState } from 'react';
import Aside from '../../components/aside/Aside';
import SearchBar from '../../components/ui/SearchBar';
import WhoToFollow from '../../components/ui/WhoToFollow';
import Header from '../../components/header/Header';
import styles from './Following.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../../api/user.api';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import UserInfo from '../../components/ui/UserInfo';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import { ButtonSize, ButtonType } from '../../components/ui/Button';
import HorizontalNavBar from '../../components/ui/HorizontalNavBar';
import { getUserFollows } from '../../api/follow.api';
import AuthContext from '../../context/user.context';
import FollowButton from '../../components/ui/FollowButton';
import Following from './Following';
import Follower from './Follower';

const FollowStatus = () => {
    const { path, id } = useParams<{ path: string, id: string }>();
    const [user, setUser] = useState<any>();
    const [authUser, setAuthUser] = useState<any>(null);
    const [followings, setFollowings] = useState<any[]>([]);


    const navigate = useNavigate();

    // Determine which component to render based on the path parameter
  const renderComponent = () => {
    if (path === 'following') {
      return <Following />;
    } else if (path === 'follower') {
      return <Follower />;
    } else {
      // Handle invalid path here, e.g., navigate to a default route
      navigate('/');
      return null;
    }
  }

    // get Auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        }
        getAuthUser();
    }, [id]);

    useEffect(() => {
        const userInfo = async () => {
            const res = await getUserById(id!);
            const { user } = res;
            setUser(user);
        };
        userInfo();
    }, [id]);

    // get Follow status
    useEffect(() => {
        const getAuthUserFollowStatus = async () => {
            const { followings } = await getUserFollows(id!);
            setFollowings(followings);
        };
        getAuthUserFollowStatus();
    }, [id]);

    const handleTabClick = (tab: any) => {
        navigate(`/follow/${tab}/${id}`);
      };

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
                            <div className={`${path === 'following' ? styles.active : ''}`} onClick={() => handleTabClick('following')}>
                                Following
                            </div>
                            <div className={`${path === 'follower' ? styles.active : ''}`} onClick={() => handleTabClick('follower')}>
                                Followers
                            </div>
                        </HorizontalNavBar>
                    </Header>
                    <div className={styles.main}>
                        {renderComponent()}
                    </div>
                </div>


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

export default FollowStatus;
