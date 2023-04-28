import React from 'react';
import Aside from '../../components/aside/Aside';
import SearchBar from '../../components/ui/SearchBar';
import WhoToFollow from '../../components/ui/WhoToFollow';
import Header from '../../components/header/Header';
import styles from './Follower.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import HorizontalNavBar from '../../components/ui/HorizontalNavBar';
import { useNavigate } from 'react-router-dom';

interface FollowerProps {

}

const Follower: React.FC<{}> = () => {

    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                    <Header border={true}>
                        <HeaderTitle title={'Followers'} className={styles.title} />
                        <HorizontalNavBar className={styles.homeNaveBar}>     
                            <div className={''} onClick={() => navigate('/following')}>
                                Following
                            </div>
                        <div className={styles.active}>
                            Followers
                        </div>
                        </HorizontalNavBar>
                    </Header>  
                    
                    {/* FOR YOU - START */}
                    <div className={styles.main}>
                        Follower
                    </div>

                </div>
                {/* Home page - start */}
                <div>
                    <Header border={false}>
                        <SearchBar width={74} />
                    </Header>
                    <Aside className={styles.aside}>
                        <WhoToFollow />
                    </Aside>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Follower;
