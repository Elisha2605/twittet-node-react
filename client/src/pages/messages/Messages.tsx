import React from 'react';
import Header from '../../components/header/Header';
import styles from './Messages.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import GearIcon from '../../components/icons/GearIcon';
import EnvelopeIcon from '../../components/icons/EnvelopeIcon';
import SearchBar from '../../components/ui/SearchBar';
import Aside from '../../components/aside/Aside';
import DetailIcon from '../../components/icons/DetailIcon';
import Avatar, { Size } from '../../components/ui/Avatar';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';

const Message = () => {
    
    return (
        <React.Fragment>
            <div className={Layout.mainSectionMessageContainer}>
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
                    <Aside className={styles.aside}>
                    <Header border={false} clasName={styles.asideHeader} >
                        <DetailIcon className={styles.detailIcon} />
                    </Header>
                        <div className={styles.userToInfo}>
                            <Avatar size={Size.medium} path={`${IMAGE_AVATAR_BASE_URL}/default-avatar.jpg`} className={''} />
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
