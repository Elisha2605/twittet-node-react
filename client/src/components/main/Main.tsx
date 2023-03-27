import React from 'react';

import Aside from '../aside/Aside';
import Avatar from '../common/Avatar';
import SearchBar from '../common/SearchBar';
import TweetFooter from '../common/TweetFooter';
import UserInfo from '../common/UserInfo';
import WhoToFollow from '../common/WhoToFollow';
import FormTweet from '../Form/FormTweet';
import Header from '../header/Header';
import Tweet from '../tweet/Tweet';
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
                        <Tweet 
                            avatar={'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODR8fHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'} 
                            firstName={'Luis Suárez'} 
                            username={'LuisSuarez9'} 
                            tweet={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,molestiae quas vel sint commodi repudiandae consequuntur'}
                            image={'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80'}
                            isOption={true}
                            comments={'164'} 
                            reposts={'924'} 
                            likes={'21.3'} 
                            views={'446'} 
                        />
                        <Tweet 
                            avatar={'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=689&q=80'} 
                            firstName={'Luis Suárez'} 
                            username={'LuisSuarez9'} 
                            image={'https://images.unsplash.com/photo-1598120035994-6c6a8547c0ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fG1lc3NpfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'}
                            isOption={true}
                            comments={'164'} 
                            reposts={'924'} 
                            likes={'21.3'} 
                            views={'446'} 
                        />
                         <Tweet 
                            avatar={'https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=723&q=80'} 
                            firstName={'Luis Suárez'} 
                            username={'LuisSuarez9'} 
                            tweet={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,molestiae quas vel sint commodi repudiandae consequuntur'}
                            image={'https://images.unsplash.com/photo-1534083264897-aeabfc7daf8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'}
                            isOption={true}
                            comments={'164'} 
                            reposts={'924'} 
                            likes={'21.3'} 
                            views={'446'} 
                        />
                        <Tweet 
                            avatar={'https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=723&q=80'} 
                            firstName={'Luis Suárez'} 
                            username={'LuisSuarez9'} 
                            tweet={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,molestiae quas vel sint commodi repudiandae consequuntur'}
                            isOption={true}
                            comments={'164'} 
                            reposts={'924'} 
                            likes={'21.3'} 
                            views={'446'} 
                        />
                    </div>
                </div>
                <div>
                    <Header border={false}>
                        <SearchBar />
                    </Header>
                    <Aside className={styles.aside}>
                        <WhoToFollow />
                    </Aside>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Main;
