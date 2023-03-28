import React, { FC } from 'react';

import Aside from '../aside/Aside';
import Avatar from '../common/Avatar';
import SearchBar from '../common/SearchBar';
import WhoToFollow from '../common/WhoToFollow';
import FormTweet from '../Form/FormTweet';
import Header from '../header/Header';
import Tweet from '../tweet/Tweet';
import styles from './Main.module.css';

const Main = () => {
    
    return (
        <React.Fragment>
            <div className={styles.mainContainer}>
                <div className={styles.mainWrapperContainer}>
                    {/* Home page - start */}
                  
                    {/* Home page - start */}
                    <div className={styles.main}>
                        {/* TweetForm */}
                      
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

export default Main;
