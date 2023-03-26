import React from 'react';
import Aside from '../aside/Aside';
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
                        Main
                        
                    </div>
                </div>
                <div>
                    <Header border={false}>
                        <input type="text" />
                    </Header>
                    <Aside className={styles.aside} />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Main;
