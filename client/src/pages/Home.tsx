import React from 'react';
import Aside from '../components/aside/Aside';
import Avatar, { Size } from '../components/ui/Avatar';
import SearchBar from '../components/ui/SearchBar';
import WhoToFollow from '../components/ui/WhoToFollow';
import FormTweet from '../components/form/FormTweet';
import Header from '../components/header/Header';
import Tweet from '../components/tweet/Tweet';
import styles from './Home.module.css';
import Layout from '../Layout.module.css';
import HeaderTitle from '../components/header/HeaderTitle';
import HorizontalNavBar from '../components/ui/HorizontalNavBar';
import { options, icons } from '../data/menuOptions';


const HomePage = () => {


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
                    <Header border={true}>
                        <HeaderTitle title={'Home'} className={styles.title}/>
                        <HorizontalNavBar className={styles.homeNaveBar}>
                            <div className={styles.active}>For you</div>
                            <div>Following</div>
                        </HorizontalNavBar>
                    </Header>
                    <div className={styles.main}>
                        {/* TweetForm */}
                        <div className={styles.formSection}>    
                            <Avatar path={"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"} size={Size.small} className={''} />
                            <FormTweet />
                        </div>
                        {/* TweetForm */}
                        
                        {/* tweets - start */}
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
                            options={options}
                            icons={icons}
                            onClickOption={handleOptionClick}
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
                            options={options}
                            onClickOption={handleOptionClick}
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
                            options={options}
                            onClickOption={handleOptionClick}
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
                            options={options}
                            onClickOption={handleOptionClick}
                        />
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

export default HomePage;
