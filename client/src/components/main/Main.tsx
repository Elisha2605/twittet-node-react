import React from 'react';

import Aside from '../aside/Aside';
import Avatar from '../common/Avatar';
import SearchBar from '../common/SearchBar';
import UserInfo from '../common/WhoToFollow';
import FormTweet from '../Form/FormTweet';
import Header from '../header/Header';
import styles from './Main.module.css';

const Main = () => {
    
    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.mainWrapper}>
                    <Header border={true} title={'Home'}>
                        <div className={styles.headerItems}>
                            <div className={styles.forYou}>For you</div>
                            <div className={styles.following}>Following</div>
                        </div>
                    </Header>
                    <div className={styles.main}>
                        <div className={styles.formSection}>    
                            <Avatar size={''} path={"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"} />
                            <FormTweet />
                        </div>
                        Main
                        
                    </div>
                </div>
                <div>
                    <Header border={false}>
                        <SearchBar />
                    </Header>
                    <Aside className={styles.aside}>
                        <UserInfo />
                    </Aside>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Main;
