import React, { FC } from 'react';
import Header from '../components/header/Header';
import styles from './Explore.module.css';
import Layout from '../Layout.module.css';
import SearchBar from '../components/common/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';


const Explore = () => {
    
    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                        <Header>
                            <div className={styles.headerWrapper}>
                                <SearchBar width={90} />
                                <FontAwesomeIcon icon={faGear} size={'lg'} />
                            </div>
                        </Header>
                    {/* Home page - start */}
                    <div className={styles.main}>
                        {/* TweetForm */}
                        Page under construction 
                        <br />
                        Maybe display some weither info
                        {/* TweetForm */}
                        
                        {/* tweets - start */}
                        
                        {/* tweets - end */}
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

export default Explore;
