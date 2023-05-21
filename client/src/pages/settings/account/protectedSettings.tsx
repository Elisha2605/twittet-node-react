import React, { useContext, useEffect, useState } from 'react';
import styles from './protectedSettings.module.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/user.context';
import Header from '../../../components/header/Header';
import HeaderTitle from '../../../components/header/HeaderTitle';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';

const ProtectedSettings: React.FC<{}> = () => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);


    const navigate = useNavigate();

    // get auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            setIsLoading(true);
            const { user } = ctx.getUserContext();
                setUser(user);
            setIsLoading(false);
        };
        getAuthUser();

    }, [ctx]);

    const handleToggle = (value: boolean) => {
        console.log('Toggle value:', value);
    };

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
                <p className={styles.message}>
                    If you protect your account, you’ll receive a request when 
                    new people want to follow you, which you can approve or deny.
                </p>
                <div className={styles.switchInput}>
                    {!isLoading && user && (
                        <>     
                            <div className={styles.item}>
                                <p>Protect your account</p>
                                <span>{user?.isProtected ? 'On' : 'Off'}</span>
                            </div>
                                <ToggleSwitch
                                onToggle={handleToggle}
                                defaultChecked={user?.isProtected}
                            />
                        </>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProtectedSettings;
