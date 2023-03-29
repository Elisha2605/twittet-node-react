import React from 'react';
import Header from '../components/header/Header';
import styles from './Notifications.module.css';
import Layout from '../Layout.module.css';
import HeaderTitle from '../components/header/HeaderTitle';
import GearIcon from '../components/icons/GearIcon';
import HorizontalNavBar from '../components/common/HorizontalNavBar';
import PageUnderConstruction from '../components/common/PageUnderConstruction';


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
                   {/* Aside - start */}
                   
                   {/* Aside - end */}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Notification;
