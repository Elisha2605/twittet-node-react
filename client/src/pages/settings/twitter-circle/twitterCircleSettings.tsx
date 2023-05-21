import React, { useContext, useEffect, useState } from 'react';
import styles from './twitterCircleSettings.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../../context/user.context';

const TwitterCircleSettings: React.FC<{}> = () => {
    const { id } = useParams<{ id: string }>();
    const [authUser, setAuthUser] = useState<any>(null);

    const navigate = useNavigate();

    // get auth user
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
            <div className={styles.main}>
                Twitter Circle Settings
            </div>
        </React.Fragment>
    );
};

export default TwitterCircleSettings;
