import React from 'react';
import Header from '../components/header/Header';
import styles from './Messages.module.css';
import Layout from '../Layout.module.css';
import HeaderTitle from '../components/header/HeaderTitle';
import GearIcon from '../components/icons/GearIcon';
import EnvelopeIcon from '../components/icons/EnvelopeIcon';
import SearchBar from '../components/ui/SearchBar';
import Aside from '../components/aside/Aside';
import DetailIcon from '../components/icons/DetailIcon';
import Avatar, { Size } from '../components/ui/Avatar';

const Message = () => {
    
    return (
        <React.Fragment>
            <div className={Layout.mainSectionSectionMessageContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                        <Header>
                            <div className={styles.headerContainer}>
                                <div className={styles.headerWrapper}>
                                    <HeaderTitle title={'Messages'} />
                                    <div className={styles.headerIcons}>
                                        <GearIcon />
                                        <EnvelopeIcon />
                                    </div>
                                </div>
                                <SearchBar />
                            </div>
                        </Header>
                    {/* Home page - start */}
                    <div className={styles.main}>
                        {/* tweets - start */}
                        
                        {/* tweets - end */}
                    </div>
                </div>
                    {/* Home page - start */}
                <div>
                   {/* Aside - start */}
                    <Header border={false} clasName={styles.asideHeader} >
                        <DetailIcon className={styles.detailIcon} />
                    </Header>
                    <Aside className={styles.aside}>
                        <div className={styles.userToInfo}>
                            <Avatar size={Size.medium} path={'https://scontent-cph2-1.xx.fbcdn.net/v/t39.30808-6/337155884_6676092215753622_8028443491988735130_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=COWC1Tbi0OEAX90FF4l&_nc_ht=scontent-cph2-1.xx&oh=00_AfDALx_ItxXaDTobKuTxM-spnA2t2KV4BMhZJ2y_vgFF_w&oe=642840C8'} className={''} />
                            <p className={styles.fullname}>Aïcha Haïdara</p>
                            <p className={styles.username}>@haidara_e</p>
                            <p className={styles.moreInfo}>Joined September 2011 · 14 Followers</p>
                        </div>
                    </Aside>
                   {/* Aside - end */}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Message;
