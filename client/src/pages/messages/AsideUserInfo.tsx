import React from 'react';
import styles from './AsideUserInfo.module.css';
import Avatar, { Size } from '../../components/ui/Avatar';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import { getMonthName, getYear } from '../../utils/helpers.utils';
import { useNavigate } from 'react-router-dom';

interface AsideUserInfoProps {
    user: any;
}

const AsideUserInfo: React.FC<AsideUserInfoProps> = ({ user }) => {

    const navigate = useNavigate();

    return (
        <div className={styles.userToInfo} onClick={() => navigate(`/profile/${user?._id}`)}>
        <Avatar
            size={Size.medium}
            path={
                user?.avatar
                    ? `${IMAGE_AVATAR_BASE_URL}/${user?.avatar}`
                    : `${IMAGE_AVATAR_BASE_URL}/default-avatar.jpg`
            }
            className={''}
        />
        <p className={styles.fullname}>
            {user?.name}
        </p>
        <p className={styles.username}>
            @{user?.username}
        </p>
        <p className={styles.moreInfo}>
            Joined{' '}
            {getMonthName(user?.createdAt)}{' '}
            {getYear(user?.createdAt)} ·{' '}
            {user?.followerCount} Followers
        </p>
    </div>
    );
};

export default AsideUserInfo;
