import React, { useContext, useEffect, useState } from 'react';
import styles from './passwordChangeSettings.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../../context/user.context';

const PasswordChangeSettings: React.FC<{}> = () => {

    return (
        <React.Fragment>
            <div className={styles.main}>
                Password change settings
            </div>
        </React.Fragment>
    );
};

export default PasswordChangeSettings;
