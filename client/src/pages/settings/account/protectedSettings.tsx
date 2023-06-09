import React, { useContext, useEffect, useState } from 'react';
import styles from './protectedSettings.module.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/user.context';
import Header from '../../../components/header/Header';
import HeaderTitle from '../../../components/header/HeaderTitle';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import { editProtected } from '../../../api/user.api';

const ProtectedSettings: React.FC<{}> = () => {
    const [user, setUser] = useState<any>(null);
    const [isUserProtected, setIsUserProtected] = useState(false);
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

    const handleIsProtectedClick = (settingName: string) => {
        navigate(`/settings/${settingName}`);
    };

    const handleToggle = async (value: boolean) => {
        setIsUserProtected(value)
        
        if (user) {
            await editProtected(value);
            handleIsProtectedClick('protected'); //this will update the protected icon in the nav
            navigate(-1); // prevents pushing the history forward
        }
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
                                <span>{isUserProtected ? 'On' : 'Off'}</span>
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
