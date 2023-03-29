import React from 'react';
import Aside from '../components/aside/Aside';
import SearchBar from '../components/common/SearchBar';
import WhoToFollow from '../components/common/WhoToFollow';
import Header from '../components/header/Header';
import Tweet from '../components/tweet/Tweet';
import styles from './Profile.module.css';
import Layout from '../Layout.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import Button, { ButtonSize, ButtonType } from '../components/common/Button';
import HeaderTitle from '../components/header/HeaderTitle';
import HorizontalNavBar from '../components/common/HorizontalNavBar';

const Profile = () => {
    
    const onEditProfile = () => {

    }

    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>

                    {/* HEADER - START */}
                    <Header border={true}>
                        <div className={styles.headerItems}>
                            <ArrowLeftIcon />
                            <HeaderTitle title={'Aïcha'} subTitle={'1 Tweet'} />
                        </div>
                    </Header>
                    {/* HEADER - END */}

                    <div className={styles.main}>
                        {/* MAIN - START */}
                            <div className={styles.imageWrapper}>
                                <div className={styles.coverImage}><img src={'https://images.unsplash.com/photo-1595670322505-4de61b9cdf47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80'} alt="" /></div>
                                <div className={styles.profileImage}><img src={'https://scontent-cph2-1.xx.fbcdn.net/v/t39.30808-6/337155884_6676092215753622_8028443491988735130_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=COWC1Tbi0OEAX90FF4l&_nc_ht=scontent-cph2-1.xx&oh=00_AfDALx_ItxXaDTobKuTxM-spnA2t2KV4BMhZJ2y_vgFF_w&oe=642840C8'} alt="" /></div>
                                <Button className={styles.editProfileBtn} value={'Edit profile'} type={ButtonType.tietary} size={ButtonSize.small} onClick={onEditProfile} />
                            </div>
                            <div className={styles.userInfo}>
                                <p className={styles.firstname}>Aïcha</p>
                                <p className={styles.username}>@aïchaHaïdara</p>
                                <p className={styles.bio}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,</p>
                                <div className={styles.joined}>
                                    <FontAwesomeIcon icon={faCalendarDays} />
                                    <p>Joined October 2018</p>
                                </div>
                                <div className={styles.followStatus}>
                                    <p>2<span>Following</span></p>
                                    <p>1<span>Follower</span></p>
                                </div>
                            </div>

                            <HorizontalNavBar className={styles.profileNav}>
                                <div className={styles.active}>Tweets</div>
                                <div>Replies</div>
                                <div>Media</div>
                                <div>Likes</div>
                            </HorizontalNavBar>

                        {/* TWEETS - START */}
                        <Tweet 
                            avatar={'https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=723&q=80'} 
                            firstName={'Luis Suárez'} 
                            username={'LuisSuarez9'} 
                            tweet={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,molestiae quas vel sint commodi repudiandae consequuntur'}
                            image={'https://images.unsplash.com/photo-1534083264897-aeabfc7daf8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'}
                            isOption={true}
                            comments={'164'} 
                            reposts={'924'} 
                            likes={'21.3'} 
                            views={'446'} 
                        />
                        {/* TWEETS - END */}

                        {/* MAIN - END */}
                    </div>
                </div>
                    {/* Home page - start */}
                <div>
                    <Header border={false}>
                        <SearchBar />
                    </Header>
                    <Aside className={styles.aside}>
                        <WhoToFollow />
                    </Aside>
                </div>
            </div>

        </React.Fragment>
    );
};

export default Profile;