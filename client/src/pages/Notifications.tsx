import React from 'react';
import Header from '../components/header/Header';
import styles from './Notifications.module.css';
import Layout from '../Layout.module.css';
import HeaderTitle from '../components/header/HeaderTitle';
import GearIcon from '../components/icons/GearIcon';
import HorizontalNavBar from '../components/common/HorizontalNavBar';
import PageUnderConstruction from '../components/common/PageUnderConstruction';
import SearchBar from '../components/common/SearchBar';
import Aside from '../components/aside/Aside';
import WhoToFollow from '../components/common/WhoToFollow';


const Notification = () => {
    
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
                                <div className={styles.active}>All</div>
                                <div>Mentions</div>
                            </HorizontalNavBar>
                        </Header>
                    {/* Home page - start */}
                    <div className={styles.main}>
                        <PageUnderConstruction message={'Will display - all notificatins and all Mentions'}/>
                    </div>
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
