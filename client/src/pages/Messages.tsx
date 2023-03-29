import React from 'react';
import Header from '../components/header/Header';
import styles from './Messages.module.css';
import Layout from '../Layout.module.css';
import HeaderTitle from '../components/header/HeaderTitle';
import GearIcon from '../components/icons/GearIcon';
import EnvelopeIcon from '../components/icons/EnvelopeIcon';
import SearchBar from '../components/common/SearchBar';
import Aside from '../components/aside/Aside';
import DetailIcon from '../components/icons/DetailIcon';
import Avatar, { Size } from '../components/common/Avatar';

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
                            <Avatar size={Size.medium} path={'https://images.unsplash.com/photo-1570158268183-d296b2892211?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTF8fGJsYWNrJTIwcHJvZmlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'} className={''} />
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
