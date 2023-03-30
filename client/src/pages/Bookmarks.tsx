import React from 'react';
import Header from '../components/header/Header';
import styles from './Bookmarks.module.css';
import Layout from '../Layout.module.css';
import HeaderTitle from '../components/header/HeaderTitle';
import SearchBar from '../components/ui/SearchBar';
import Aside from '../components/aside/Aside';
import WhoToFollow from '../components/ui/WhoToFollow';
import PopUpMenu from '../components/ui/PopUpMenu';

const Bookmarks = () => {

    const options = ["Option 1", "Option 2", "Option 3"];

    const handleOptionClick = (option: string) => {
        // TODO: handle menu option clickes
        if (option === "Option 1") {
            console.log("one");
            // Insert your code to handle when Option 1 is clicked here
          } else {
            console.log(`${option} was clicked!`);
            // Insert your code to handle when an option other than Option 1 is clicked here
          }
    }
    
    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                        <Header>
                            <div className={styles.headerWrapper}>
                                <HeaderTitle title={'Bookmarks'} subTitle={'@Alvin44943'} />
                                <PopUpMenu options={options} onClick={handleOptionClick} />
                            </div>
                        </Header>
                    {/* Home page - start */}
                    <div className={styles.main}>

                        <div className={styles.emptyBookmarksWrapper}>
                            <div className={styles.emptyBookmarksImage}>
                                <img src={"https://abs.twimg.com/responsive-web/client-web/book-in-bird-cage-800x400.v1.71804389.png"} alt="" />
                            <div className={styles.emptyBookmarksMessage}>
                                <p className={styles.messageTitle}>Save Tweets for later</p>
                                <p className={styles.messageBody}>Don’t let the good ones fly away! Bookmark Tweets to easily find them again in the future.</p>
                            </div>
                            </div>
                        </div>

                        {/* tweets - start */}
                        {/* <Tweet 
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
                        /> */}
                        {/* tweets - end */}
                    </div>
                </div>
                    {/* Home page - start */}
                <div>
                   {/* Aside - start */}
                   <Header border={false}>
                        <SearchBar width={74}/>
                    </Header>
                    <Aside className={styles.aside}>
                        <WhoToFollow />
                    </Aside>
                   {/* Aside - end */}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Bookmarks;
