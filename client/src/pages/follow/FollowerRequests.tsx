import React, { FC, useContext, useEffect, useState } from 'react';
import styles from './FollowerRequests.module.css';
import AuthContext from '../../context/user.context';
import UserInfo from '../../components/ui/UserInfo';
import { approveFollowRequest, declineFollowRequest, getUserFollows, sendFollowRequest } from '../../api/follow.api';
import Header from '../../components/header/Header';
import Layout from '../../Layout.module.css';
import SearchBar from '../../components/ui/SearchBar';
import Aside from '../../components/aside/Aside';
import WhoToFollow from '../../components/ui/WhoToFollow';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import HeaderTitle from '../../components/header/HeaderTitle';
import { useNavigate } from 'react-router-dom';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import FollowButton, { ButtonSize, ButtonType } from '../../components/ui/FollowButton';


interface FollowerRequestsProps {}

const FollowerRequests: FC<FollowerRequestsProps> = ({}) => {

    const [authUser, setAuthUser] = useState<any>(null);
    const [waitingRequests, setWaitingRequests] = useState<any[]>([]);
    const [responses, setResponses] = useState<{ [key: string]: { approved: boolean, declined: boolean, follow: boolean } }>({});

    
    const navigate = useNavigate();

    const ctx = useContext(AuthContext);
    useEffect(() => {
    const getAuthUser = async () => {
        const { user } = ctx.getUserContext();
        if (user) {
            setAuthUser(user);
            const res = await getUserFollows(user._id);
            setWaitingRequests(res.waitings);
        }
    };
    getAuthUser();
    }, [ctx, authUser?._id]);
   
    const approveRequest = async (senderId: string) => {
        const res = await approveFollowRequest(authUser?._id, senderId);
        console.log(res);
        if (res.success) {
            setResponses((prevState) => ({
                ...prevState,
                [senderId]: {
                    approved: true,
                    declined: false,
                    follow: false,
                },
            }));
        }
    };
    
    const declineRequest = async (senderId: string) => {
        const res = await declineFollowRequest(authUser?._id, senderId);
        console.log(res);
        if (res.success) {
            setResponses((prevState) => ({
                ...prevState,
                [senderId]: {
                    approved: false,
                    declined: true,
                    follow: false,
                },
            }));
        }
    };

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
                                className={styles.arrowLeftIcon}
                            />
                            <HeaderTitle
                                title={'Follower requests'}
                                className={styles.title}
                            />
                        </div>
                    </Header>
                    {/* Home page - start */}
                    <div className={styles.main}>
                            {waitingRequests.map((waiting: any) => (
                                <div key={waiting?.user?._id} className={styles.contentWrapper}>
                                    <div>
                                        <UserInfo
                                            userId={waiting?.user?._id}
                                            avatar={waiting?.user?.avatar && `${IMAGE_AVATAR_BASE_URL}/${waiting?.user?.avatar}`}
                                            name={waiting?.user?.name}
                                            username={waiting?.user?.username}
                                            isVerified={waiting?.user?.isVerified}
                                        />
                                        {responses[waiting?.user?._id]?.approved && (
                                            <p className={styles.followsYou}>Follows you</p>
                                        )}
                                    </div>
                                    <div className={styles.buttons}>
                                        {!responses[waiting?.user?._id]?.approved && !responses[waiting?.user?._id]?.declined && !responses[waiting?.user?._id]?.follow && (
                                            <>
                                                <div className={styles.declineBtn} onClick={() => declineRequest(waiting?.user?._id)}>
                                                    Decline
                                                </div>
                                                <div className={styles.acceptBtn} onClick={() => approveRequest(waiting?.user?._id)}>
                                                    Accept
                                                </div>
                                            </>
                                        )}
                                        {responses[waiting?.user?._id]?.approved && (
                                            <FollowButton
                                                userId={waiting?.user?._id}
                                                type={ButtonType.secondary}
                                                size={ButtonSize.small}
                                            />
                                        )}
                                        {responses[waiting?.user?._id]?.follow && (
                                            <div className={styles.followBtn}>
                                                Following
                                            </div>
                                        )}
                                        {responses[waiting?.user?._id]?.declined && (
                                            <div className={styles.declineMsg}>
                                                Request declined
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
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

export default FollowerRequests;
