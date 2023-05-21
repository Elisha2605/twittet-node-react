import React, { useContext, useEffect, useState } from 'react';
import styles from './passwordChangeSettings.module.css';
import Header from '../../../components/header/Header';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import HeaderTitle from '../../../components/header/HeaderTitle';
import { useNavigate } from 'react-router-dom';

const PasswordChangeSettings: React.FC<{}> = () => {

    const navigate = useNavigate();

   
    return (
        <React.Fragment>
            <div className={styles.main}>
                <Header>
                    <div className={styles.headerContainerRight}>
                        <div className={styles.headerWrapper}>
                            <ArrowLeftIcon
                                onClick={() => {
                                    navigate(-1);
                                }}
                            />
                            <HeaderTitle title={'Change password'} />
                        </div>
                    </div>
                </Header>
            </div>
        </React.Fragment>
    );
};

export default PasswordChangeSettings;
