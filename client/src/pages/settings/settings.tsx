import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import styles from './settings.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import Aside from '../../components/aside/Aside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../context/user.context';
import PasswordChangeSettings from './password/passwordChangeSettings';
import TwitterCircleSettings from './twitter-circle/twitterCircleSettings';
import AccountSettings from './account/accountSettings';
import Email from './account/email';
import Username from './account/username';
import ProtectedSettings from './account/protectedSettings';
import PassworConfirmation from './password/passwordCodeVerification';
import PasswordReset from './password/passwordReset';

const Settings = () => {
    const { path } = useParams<{ path: string }>();

    const [authUser, setAuthUser] = useState<any>(null);

    const navigate = useNavigate();

    const handleNavigationClick = (settingName: string) => {
        if (settingName === 'email') {
            // Handle navigation to the "email" path
            navigate('/settings/email');
          } else {
            // Navigate to other settings paths
            navigate(`/settings/${settingName}`);
          }
      
    };

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
        getAuthUser();
    }, []);
    

    return (
        <React.Fragment>
            <div className={Layout.mainSectionSettings}>
                <div className={Layout.mainSection}>
                    <Header>
                        <div className={styles.headerContainerLeft}>
                            <HeaderTitle title={'Settings'} />
                        </div>
                    </Header>

                    <div className={styles.main}>
                        <div
                            className={`${styles.navItem} ${path === 'account' ? styles.active : ''}`}
                            onClick={() => handleNavigationClick('account')}
                        >
                            <p>Your account</p>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                        <div
                            className={`${styles.navItem} ${path === 'password-change' ? styles.active : ''}`}
                            onClick={() =>
                                handleNavigationClick('password-change')
                            }
                        >
                            <p>Change password</p>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                        <div
                            className={`${styles.navItem} ${path === 'twitter-circle' ? styles.active : ''}`}
                            onClick={() =>
                                handleNavigationClick('twitter-circle')
                            }
                        >
                            <p>Manage Twitter Circle</p>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                    </div>
                </div>
                <div>
                    {/* Aside - start */}
                    
                    <Aside className={styles.aside}>
                    <div className={styles.test}>
                        {/* Navigation */}
                        {path === 'account' && <AccountSettings />}
                        {path === 'password-change' && <PasswordChangeSettings />}
                        {path === 'twitter-circle' && <TwitterCircleSettings />}

                        {/* Account Settings */}
                        {path === 'username' && <Username />}
                        {path === 'email' && <Email />}
                        {path === 'protected' && <ProtectedSettings />}

                        {/* Password Settings */}
                        {path === 'verification' && <PassworConfirmation />}
                        {path === 'password-reset' && <PasswordReset />}

                    </div>
                    </Aside>
                    {/* Aside - end */}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Settings;
