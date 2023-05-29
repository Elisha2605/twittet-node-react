import React, { useEffect, useState } from 'react';
import Button, { ButtonSize, ButtonType } from './Button';
import UserInfo from './UserInfo';

import styles from './WhoToFollow.module.css';
import { getAllUsers } from '../../api/user.api';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import { useNavigate } from 'react-router-dom';

const WhoToFollow = () => {
    const [users, setUsers] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const { users } = await getAllUsers();
            setUsers(users);
        };
        fetchUsers();
    }, []);

    return (
        <React.Fragment>
            <div className={styles.container}>
                <h2 className={styles.title}>Who to follow</h2>
                {users.length > 0 &&
                    users.map((user: any) => (
                        <div key={user?._id} className={styles.userInfo} onClick={() => navigate(`/profile/${user?._id}`)}>
                            <UserInfo
                                user={user}
                                userId={user?._id}
                                avatar={
                                    user?.avatar
                                        ? `${IMAGE_AVATAR_BASE_URL}/${user?.avatar}`
                                        : undefined
                                }
                                name={user?.name}
                                username={user?.username}
                                isNavigate={true}
                                isVerified={user?.isVerified}
                                isProtected={user?.isProtected}
                            >
                                {/* <Button value={'Follow'} type={ButtonType.secondary} size={ButtonSize.small}  onClick={onFollow} />     */}
                            </UserInfo>
                        </div>
                    ))}
            </div>
        </React.Fragment>
    );
};

export default WhoToFollow;
