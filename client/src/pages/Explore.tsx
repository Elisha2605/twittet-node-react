import React from 'react';
import Header from '../components/header/Header';
import styles from './Explore.module.css';
import Layout from '../Layout.module.css';
import SearchBar from '../components/common/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import PageUnderConstruction from '../components/common/PageUnderConstruction';
import GearIcon from '../components/icons/GearIcon';
import Aside from '../components/aside/Aside';
import WhoToFollow from '../components/common/WhoToFollow';

const Explore = () => {
    
    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                        <Header>
                            <div className={styles.headerWrapper}>
                                <SearchBar width={85} />
                                <GearIcon className={styles.gearIcon}/>
                            </div>
                        </Header>
                    {/* Home page - start */}
                    <div className={styles.main}>
                        {/* TweetForm */}

                        <PageUnderConstruction message={'Maybe display some weather info'} />
                        
                        {/* TweetForm */}
                        
                        {/* tweets - start */}
                        
                        {/* tweets - end */}
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

export default Explore;
