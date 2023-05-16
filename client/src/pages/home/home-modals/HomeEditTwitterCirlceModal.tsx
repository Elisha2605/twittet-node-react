import React, { FC, useContext, useEffect, useState } from 'react';
import styles from './HomeEditTwitterCirlceModal.module.css';
import {
    IMAGE_AVATAR_BASE_URL,
} from '../../../constants/common.constants';
import { ModalContext } from '../../../context/modal.context';
import Modal from '../../../components/ui/Modal';
import XmarkIcon from '../../../components/icons/XmarkIcon';
import { getAuthUserFollows } from '../../../api/follow.api';
import Header from '../../../components/header/Header';
import HorizontalNavBar from '../../../components/ui/HorizontalNavBar';
import UserInfo from '../../../components/ui/UserInfo';
import { useNavigate } from 'react-router-dom';
import Button, { ButtonSize, ButtonType } from '../../../components/ui/Button';
import { addUserToTwitterCircle, getAuthUserTwitterCircleMembers } from '../../../api/twitterCircle.api';
import SearchBar from '../../../components/ui/SearchBar';
import PageUnderConstruction from '../../../components/ui/PageUnderConstruction';
import ContentNotAvailable from '../../../components/ui/ContentNotAvailable';

interface HomeEditTwitterCirlceModalProps {}

const HomeEditTwitterCirlceModal: FC<HomeEditTwitterCirlceModalProps> = ({}) => {

    const [followings, setFollowings] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab-edit-circle') || 'twitter-cirlce');


    const navigate = useNavigate();
    const { closeModal, modalOpen } = useContext(ModalContext);

    useEffect(() => {
        const fetchAuthUserData = async () => {
            if (modalOpen) {
                const { followings } = await getAuthUserFollows();
                setFollowings(followings);
            }
        };
        fetchAuthUserData();
    }, [modalOpen]);

    useEffect(() => {
        const getTwitterCircleMembers = async () => {
            if (modalOpen) {
                const { user } = await getAuthUserTwitterCircleMembers();
                setMembers(user?.members)
            }
        }
        getTwitterCircleMembers();
    }, [modalOpen])

    useEffect(() => {
        if (!modalOpen) {
            setActiveTab('twitter-cirlce');
        }
    }, [modalOpen])

    const onRemoveTwitterCircle = async (e: React.MouseEvent<HTMLButtonElement>, userId: string) => {
        e.stopPropagation();
        const res = await addUserToTwitterCircle(userId);
        setMembers((prevMembers: any) => prevMembers.filter((member: any) => member?._id !== userId))
        console.log(res);
    }

    const onAddTwitterCircle = async (e: React.MouseEvent<HTMLButtonElement>, addedUser: any) => {
        e.stopPropagation();
        const userId = addedUser?.user?._id;
        const alreadyInCircle = isTwitterCircle(userId);
      
        if (alreadyInCircle) {
          // User is already in the circle, so remove them
          const res = await addUserToTwitterCircle(userId);
          setMembers((prevMembers: any) => {
            if (!Array.isArray(prevMembers)) {
              return [];
            }
            return prevMembers.filter((member: any) => member?._id !== userId);
          });
          console.log(res);
        } else {
          // User is not in the circle, so add them
          const res = await addUserToTwitterCircle(userId);
          setMembers((prevMembers: any) => [addedUser?.user, ...(Array.isArray(prevMembers) ? prevMembers : [])]);
          console.log(res);
        }
    };

    const isTwitterCircle = (userId: string): boolean => {
        return members && members.some((member: any) => member?._id === userId);
    };

    return (
        <React.Fragment>
            <Modal
                smallTitle={'Edit your twitter Circle'}
                modalName={'home-edit-twitterCircle-modal'}
                isOverlay={true}
                classNameContainer={styles.modalContainer}
                classNameWrapper={styles.modalWrapper}
                isCustomeHeader={true}
            >
                <div className={styles.headerWrapper}>
                    <XmarkIcon size={'sm'} onClick={() => closeModal('')} />
                    <div className={styles.titleAndBtnWrapper}>
                        <h5>Edit Twitter Circle</h5>
                    </div>
                </div>
                <Header border={true}>
                    <HorizontalNavBar className={styles.twitterCircleNavBar}>
                        <div className={activeTab === 'twitter-cirlce' ? styles.active : ''}
                            onClick={() => setActiveTab('twitter-cirlce')}>
                            Twitter Circle
                        </div>
                        <div className={activeTab === "recommended" ? styles.active : ''}
                            onClick={() => setActiveTab('recommended')}>
                            Recommended
                        </div>
                    </HorizontalNavBar>
                </Header>

                {activeTab === 'twitter-cirlce' && (
                    <div className={styles.members}>
                        <p className={styles.twitterCircleMsg}>
                            People won’t be notified when you edit your Twitter Circle. 
                            Anyone you add will be able to see your previous Twitter Circle Tweets.
                        </p>
                       {members && members.map((member: any) => (
                            <div key={member?._id} className={styles.followingItem} onClick={() => navigate(`/profile/${member?._id}`)}>   
                                <UserInfo
                                   userId={member?._id}
                                   avatar={member?.avatar && `${IMAGE_AVATAR_BASE_URL}/${member?.avatar}`}
                                   isVerified={member?.isVerified}
                                   name={member?.name}
                                   username={member?.username}
                                   className={styles.userInfoWrapper}
                                >
                                <Button
                                    type={ButtonType.tietary}
                                    size={ButtonSize.small} value={'Remove'} onClick={(e: any) => onRemoveTwitterCircle(e, member?._id)}    
                                />
                                </UserInfo>
                            </div>
                         ))}

                        {members.length === 0 && (
                            <ContentNotAvailable 
                                title={'There isn’t anyone in your Twitter Circle — yet'} 
                                message='When you add people, they’ll show up here.' 
                            />
                        )}
                    </div>
                )}
                {activeTab === 'recommended' && (
                    <div className={styles.recommendation}>
                        {/* <SearchBar 
                            isButton={true} 
                            classNameContainer={styles.searchBarContainer} 
                            classNameInput={styles.searchBarInput}
                        /> */}
                        {}
                        <p className={styles.twitterCircleMsg}>
                            People won’t be notified when you edit your Twitter Circle. Anyone 
                            you add will be able to see your previous Twitter Circle Tweets
                        </p>
                         {followings && followings.map((following: any) => (
                            <div key={following?._id} className={styles.followingItem} onClick={() => navigate(`/profile/${following.user._id}`)}>   
                                <UserInfo
                                   userId={following?._id}
                                   avatar={following?.user?.avatar && `${IMAGE_AVATAR_BASE_URL}/${following?.user?.avatar}`}
                                   isVerified={following?.user?.isVerified}
                                   name={following?.user?.name}
                                   username={following?.user?.username}
                                   className={styles.userInfoWrapper}
                                >
                                <div>
                                    {isTwitterCircle(following?.user?._id) ? (
                                        <Button
                                            type={ButtonType.tietary}
                                            size={ButtonSize.small} value={'Remove'} onClick={(e: any) => onAddTwitterCircle(e, following)}    
                                        />
                                    ): (
                                        <Button
                                            type={ButtonType.secondary}
                                            size={ButtonSize.small} value={'Add'} onClick={(e: any) => onAddTwitterCircle(e, following)}    
                                        />
                                    )}
                                </div>
                                </UserInfo>
                            </div>
                         ))}
                         {followings.length === 0 && (
                            <ContentNotAvailable 
                                title={'You don’t have any recommendations — yet'} 
                                message='We’ll suggest people to add to your Twitter Circle here.' 
                            />
                         )}
                    </div>
                )}
            </Modal>
        </React.Fragment>
    );
};

export default HomeEditTwitterCirlceModal;
