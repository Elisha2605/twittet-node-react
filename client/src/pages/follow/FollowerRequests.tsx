import React, { FC, useContext, useEffect, useState } from 'react';
import styles from './FollowerRequests.module.css';
import { ModalContext } from '../../context/modal.context';
import AuthContext from '../../context/user.context';
import UserInfo from '../../components/ui/UserInfo';
import { approveFollowRequest, declineFollowRequest, getAuthUserFollows } from '../../api/follow.api';
import Header from '../../components/header/Header';
import Layout from '../../Layout.module.css';
import SearchBar from '../../components/ui/SearchBar';
import Aside from '../../components/aside/Aside';
import WhoToFollow from '../../components/ui/WhoToFollow';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import HeaderTitle from '../../components/header/HeaderTitle';
import { useNavigate } from 'react-router-dom';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';


interface FollowerRequestsProps {}

const FollowerRequests: FC<FollowerRequestsProps> = ({}) => {

    const [authUser, setAuthUser] = useState<any>(null);
    const [waitingRequests, setWaitingRequests] = useState<any[]>([]);
    const [approveResponse, setApproveResponse] = useState<boolean>(false);
    const [declinedResponse, setDeclinedResponse] = useState<boolean>(false);
    
    const navigate = useNavigate();

    const ctx = useContext(AuthContext);
    useEffect(() => {
    const getAuthUser = async () => {
        const { user } = ctx.getUserContext();
        if (user) {
        setAuthUser(user);
        const res = await getAuthUserFollows(user._id);
        setWaitingRequests(res.waitings);
        }
    };
    getAuthUser();
    }, [ctx, authUser?._id]);
   
    const approveRequest = async (senderId: string) => {
        const res = await approveFollowRequest(authUser?._id, senderId);
        if (res.success) {
            setApproveResponse(true)
        }
        console.log(res);
    }

    const declineRequest = async (senderId: string) => {
        const res = await declineFollowRequest(authUser?._id, senderId)
        if (res.success) {
            setDeclinedResponse(true)
        }
        console.log(res);
    }

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
                            {waitingRequests && waitingRequests.map((waiting: any) => (
                                <div key={waiting?.user?._id} className={styles.contentWrapper}>
                                    <UserInfo
                                        userId={waiting?.user?._id}
                                        avatar={waiting?.user?.avatar && `${IMAGE_AVATAR_BASE_URL}/${waiting?.user?.avatar}`}
                                        name={waiting?.user?.name}
                                        username={waiting?.user?.username}
                                        isVerified={waiting?.user?.isVerified}
                                    />
                                    <div className={styles.buttons}>
                                        {!approveResponse && !declinedResponse && (
                                            <>
                                                <div className={styles.declineBtn} onClick={() => declineRequest(waiting?.user?._id)}>
                                                    Decline
                                                </div>
                                                <div className={styles.acceptBtn} onClick={() => approveRequest(waiting?.user?._id)}>
                                                    Accept
                                                </div>
                                            </>
                                        )}
                                        {approveResponse && (
                                            <div>Approved</div>
                                        )}
                                        {declinedResponse && (
                                            <div>Declined</div>
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
