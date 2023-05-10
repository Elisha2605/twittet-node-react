import React, { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import styles from './Notifications.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import GearIcon from '../../components/icons/GearIcon';
import HorizontalNavBar from '../../components/ui/HorizontalNavBar';
import PageUnderConstruction from '../../components/ui/PageUnderConstruction';
import SearchBar from '../../components/ui/SearchBar';
import Aside from '../../components/aside/Aside';
import WhoToFollow from '../../components/ui/WhoToFollow';

const Notification = () => {

    const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab-notification') || 'all');

     // Set active tab in local storage
    useEffect(() => {
        localStorage.setItem('activeTab-notification', activeTab);
    }, [activeTab]);

    
    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                        <Header border={true}>
                            <div className={styles.headerWrapper}>
                                <HeaderTitle title={'Notifications'} />
                                <GearIcon />
                            </div>
                            <HorizontalNavBar className={styles.NotificationNav}>
                                <div className={activeTab === 'all' ? styles.active : ''}
                                    onClick={() => setActiveTab('all')}
                                >
                                    All
                                </div>
                                <div className={activeTab === 'mentions' ? styles.active : ''}
                                    onClick={() => setActiveTab('mentions')}
                                >
                                    Mentions
                                </div>
                            </HorizontalNavBar>
                        </Header>
                    {/* Home page - start */}
                    {activeTab === 'all' && (
                        <div className={styles.main}>
                            <PageUnderConstruction message={'Will display - all notificatins such as logins, follow request, new message'}/>
                        </div>
                    )}

                    {activeTab === 'mentions' && (
                        <div className={styles.main}>
                            <PageUnderConstruction message={'Will display - all tweet mentions'}/>
                        </div>
                    )}
                </div>
                    {/* Home page - start */}
                <div>
                    <Header border={false}>
                        <SearchBar width={74}/>
                    </Header>
                    <Aside className={styles.aside}>
                        <WhoToFollow />
                    </Aside>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Notification;
