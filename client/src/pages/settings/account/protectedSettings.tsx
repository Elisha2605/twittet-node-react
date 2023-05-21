import React, { useContext, useEffect, useState } from 'react';
import styles from './protectedSettings.module.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/user.context';
import Header from '../../../components/header/Header';
import HeaderTitle from '../../../components/header/HeaderTitle';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';

const ProtectedSettings: React.FC<{}> = () => {
    const [user, setUser] = useState<any>(null);

    const navigate = useNavigate();

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
                        <ArrowLeftIcon
                            onClick={() => {
                                navigate(-1);
                            }}
                        />
                        <HeaderTitle title={'Protect your account'} />
                    </div>
                </div>
            </Header>
            <div className={styles.main}>
                Protected settings
            </div>
        </React.Fragment>
    );
};

export default ProtectedSettings;
