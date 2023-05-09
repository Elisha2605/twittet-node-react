import React, { FC, useContext, useEffect, useState } from 'react';
import styles from './FollowButton.module.css';
import LoadingRing from './LoadingRing';
import { getAuthUserFollows, sendFollowRequest } from '../../api/follow.api';
import AuthContext from '../../context/user.context';

export enum ButtonType {
    primary = 'primary',
    secondary = 'secondary',
    tietary = 'tietary',
}

export enum ButtonSize {
    big = 'big',
    medium = 'medium',
    small = 'small',
}

interface FollowButtonProps {
    userId?: string;
    value?: any;
    type?: ButtonType;
    size: ButtonSize;
    loading?: Boolean;
    isDisabled?: boolean;
    className?: string;
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
    onClick?: Function;
}

const FollowButton: FC<FollowButtonProps> = ({
    userId,
    value,
    type,
    size,
    loading = false,
    isDisabled = false,
    className,
    onMouseEnter,
    onMouseLeave,
    onClick,
}) => {
    const [authUser, setAuthUser] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>();

    let allStyles = styles.primary;

    if (type === ButtonType.primary && size === ButtonSize.small) {
        allStyles = styles.primarySmall;
    }

    if (type === ButtonType.primary && size === ButtonSize.medium) {
        allStyles = styles.primaryMedium;
    }

    if (type === ButtonType.secondary && size === ButtonSize.small) {
        allStyles = styles.secondarySmall;
    }

    if (type === ButtonType.tietary && size === ButtonSize.small) {
        allStyles = styles.tietary;
    }
    if (type === ButtonType.tietary && size === ButtonSize.big) {
        allStyles = styles.tietaryBig;
    }

    // get auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
        getAuthUser();
    }, []);

    const getAuthUserFollowStatus = async () => {
        const { followings } = await getAuthUserFollows(authUser?._id!);
        if (
            followings &&
            followings.some((following: any) => following.user._id === userId)
        ) {
            setIsFollowing(true);
        }
    };

    useEffect(() => {
        if (authUser) {
            getAuthUserFollowStatus();
        }
    }, [authUser, userId]);

    const handleFollowRequest = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation();
        const res = await sendFollowRequest(authUser?._id, userId!);
        console.log(res);

        setIsFollowing(!isFollowing);
    };

    return (
        <React.Fragment>
            <button
                className={`${className} ${allStyles} ${styles[type!]} ${
                    loading ? styles.loading : ''
                } ${isDisabled && styles.disabled}
                ${isFollowing ? styles.followBtn : ''}
                `}
                onClick={(e: any) => handleFollowRequest(e)}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                disabled={isDisabled}
            >
                {isFollowing ? 'Following' : 'Follow'}
            </button>
        </React.Fragment>
    );
};

export default FollowButton;
