import React, { useEffect, useState } from 'react';
import Aside from '../../components/aside/Aside';
import SearchBar from '../../components/ui/SearchBar';
import WhoToFollow from '../../components/ui/WhoToFollow';
import Header from '../../components/header/Header';
import styles from './FollowStatus.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../../api/user.api';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import HorizontalNavBar from '../../components/ui/HorizontalNavBar';
import Following from './Following';
import Follower from './Follower';

const FollowStatus = () => {
    const { path, id } = useParams<{ path: string; id: string }>();
    const [user, setUser] = useState<any>();

    const navigate = useNavigate();

    const handleTabClick = (tab: any) => {
        navigate(`/follow-status/${tab}/${id}`);
    };

    useEffect(() => {
        const userInfo = async () => {
            const res = await getUserById(id!);
            const { user } = res;
            setUser(user);
        };
        userInfo();
    }, [id]);

    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                    <Header border={true}>
                        <div className={styles.headerItems}>
                            <ArrowLeftIcon
                                onClick={() => {
                                    navigate(-1);
                                }}
                            />
                            <HeaderTitle
                                title={user?.name}
                                subTitle={`@${user?.username}`}
                            />
                        </div>
                        <HorizontalNavBar className={styles.homeNaveBar}>
                            <div
                                className={`${
                                    path === 'following' ? styles.active : ''
                                }`}
                                onClick={() => handleTabClick('following')}
                            >
                                Following
                            </div>
                            <div
                                className={`${
                                    path === 'followers' ? styles.active : ''
                                }`}
                                onClick={() => handleTabClick('followers')}
                            >
                                Followers
                            </div>
                        </HorizontalNavBar>
                    </Header>
                    <div className={styles.main}>
                        {path === 'following' ? <Following /> : <Follower />}
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
