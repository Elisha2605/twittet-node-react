import React, { useContext, useEffect, useState } from 'react';
import styles from './accountSettings.module.css';
import AuthContext from '../../../context/user.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getMonthName, getYear } from '../../../utils/helpers.utils';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/header/Header';
import HeaderTitle from '../../../components/header/HeaderTitle';

const AccountSettings: React.FC<{ }> = ({ }) => {
    const [user, setUser] = useState<any>(null);

    const navigate = useNavigate();

    const handleEmailClick = (settingName: string) => {
        navigate(`/settings/${settingName}`);
      };
    

    // get auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setUser(user);
        };
        getAuthUser();
    }, []);

    return (
        <React.Fragment>
            <Header>
                <div className={styles.headerContainerRight}>
                    <div className={styles.headerWrapper}>
                        <HeaderTitle title={'Your Account'} />
                    </div>
                </div>
            </Header>
            <div className={styles.main}>
                <div className={styles.itemWrapper} onClick={() => handleEmailClick('username')}>
                    <div className={styles.item}>
                        <p>Username</p>
                        <span>@{user?.username}</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className={styles.itemWrapper} onClick={() => handleEmailClick('email')}>
                    <div className={styles.item}>
                        <p>Email</p>
                        <span>{user?.email}</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className={styles.itemWrapper}>
                    <div className={styles.item}>
                        <p>Verified</p>
                        <span>{user?.isVerified ? 'Yes' : 'No'}</span>
                    </div>
                </div>
                <div className={styles.itemWrapper} onClick={() => handleEmailClick('protected')}>
                    <div className={styles.item}>
                        <p>Protected</p>
                        <span>{user?.isProtected ? 'Yes' : 'No'}</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className={styles.itemWrapper}>
                    <div className={styles.item}>
                        <p>Account creation</p>
                        <span>
                            {getMonthName(user?.createdAt)}{' '} 
                            {getYear(user?.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AccountSettings;
