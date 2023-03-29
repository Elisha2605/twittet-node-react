import React from 'react';
import Header from '../components/header/Header';
import styles from './Message.module.css';
import Layout from '../Layout.module.css';


const Message = () => {
    
    return (
        <React.Fragment>
            <div className={Layout.mainSectionContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                        <Header>
                            
                        </Header>
                    {/* Home page - start */}
                    <div className={styles.main}>
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

export default Message;
