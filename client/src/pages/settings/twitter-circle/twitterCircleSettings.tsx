import React, { useContext, useEffect, useState } from 'react';
import styles from './twitterCircleSettings.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../../context/user.context';
import Header from '../../../components/header/Header';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import HeaderTitle from '../../../components/header/HeaderTitle';
import {
    addUserToTwitterCircle,
    getAuthUserTwitterCircleMembers,
} from '../../../api/twitterCircle.api';
import { getAuthUserFollows } from '../../../api/follow.api';
import UserInfo from '../../../components/ui/UserInfo';
import { IMAGE_AVATAR_BASE_URL } from '../../../constants/common.constants';
import Button, { ButtonSize, ButtonType } from '../../../components/ui/Button';

const TwitterCircleSettings: React.FC<{}> = () => {
    const [followings, setFollowings] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    // get auth user
    useEffect(() => {
        const fetchTwitterCircleMembers = async () => {
            setIsLoading(true);
            const res = await getAuthUserTwitterCircleMembers();
            setMembers(res.user?.members);
            const { followings } = await getAuthUserFollows();
            setFollowings(followings);
            setIsLoading(false);
        };
        fetchTwitterCircleMembers();
    }, []);

    const onRemoveTwitterCircle = async (
        e: React.MouseEvent<HTMLButtonElement>,
        userId: string
    ) => {
        e.stopPropagation();
        const res = await addUserToTwitterCircle(userId);
        setMembers((prevMembers: any) =>
            prevMembers.filter((member: any) => member?._id !== userId)
        );
        console.log(res);
    };

    const onAddTwitterCircle = async (
        e: React.MouseEvent<HTMLButtonElement>,
        addedUser: any
    ) => {
        e.stopPropagation();
        const userId = addedUser?.user?._id;
        const alreadyInCircle = isTwitterCircle(userId);

        if (alreadyInCircle) {
            // User is already in the circle, so remove them
            const res = await addUserToTwitterCircle(userId);
            setMembers((prevMembers: any) => {
                if (!Array.isArray(prevMembers)) {
                    return [];
                }
                return prevMembers.filter(
                    (member: any) => member?._id !== userId
                );
            });
            console.log(res);
        } else {
            // User is not in the circle, so add them
            const res = await addUserToTwitterCircle(userId);
            setMembers((prevMembers: any) => [
                addedUser?.user,
                ...(Array.isArray(prevMembers) ? prevMembers : []),
            ]);
            console.log(res);
        }
    };

    const isTwitterCircle = (userId: string): boolean => {
        return members && members.some((member: any) => member?._id === userId);
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
                        <HeaderTitle title={'Manage your Twitter Circle'} />
                    </div>
                </div>
            </Header>
            <div className={styles.main}>
                <p className={styles.twitterCircleMsg}>
                    People won’t be notified when you edit your Twitter Circle.
                    Anyone you add will be able to see your previous Twitter
                    Circle Tweets
                </p>

                {!isLoading && members && members.length > 0 && (
                    <div className={styles.members}>
                        <div className={styles.title}>
                            Twitter Circle members
                        </div>
                        {members &&
                            members.map((member: any) => (
                                <div
                                    key={member?._id}
                                    className={styles.followingItem}
                                    onClick={() =>
                                        navigate(`/profile/${member?._id}`)
                                    }
                                >
                                    <UserInfo
                                        user={member}
                                        avatar={
                                            member?.avatar &&
                                            `${IMAGE_AVATAR_BASE_URL}/${member?.avatar}`
                                        }
                                        isVerified={member?.isVerified}
                                        name={member?.name}
                                        username={member?.username}
                                        className={styles.userInfoWrapper}
                                    >
                                        <Button
                                            type={ButtonType.tietary}
                                            size={ButtonSize.small}
                                            value={'Remove'}
                                            onClick={(e: any) =>
                                                onRemoveTwitterCircle(
                                                    e,
                                                    member?._id
                                                )
                                            }
                                        />
                                    </UserInfo>
                                </div>
                            ))}
                    </div>
                )}

            {!isLoading  && followings && followings.length > 0 && (
                <div className={styles.recommendation}>
                    <div className={styles.title}>Recommended</div>

                    {followings.map((following: any) => (
                        <div
                            key={following?._id}
                            className={styles.followingItem}
                            onClick={() =>
                                navigate(`/profile/${following.user._id}`)
                            }
                        >
                            <UserInfo
                                userId={following?._id}
                                avatar={
                                    following?.user?.avatar &&
                                    `${IMAGE_AVATAR_BASE_URL}/${following?.user?.avatar}`
                                }
                                isVerified={following?.user?.isVerified}
                                name={following?.user?.name}
                                username={following?.user?.username}
                                className={styles.userInfoWrapper}
                            >
                                <div>
                                    {isTwitterCircle(following?.user?._id) ? (
                                        <Button
                                            type={ButtonType.tietary}
                                            size={ButtonSize.small}
                                            value={'Remove'}
                                            onClick={(e: any) =>
                                                onAddTwitterCircle(e, following)
                                            }
                                        />
                                    ) : (
                                        <Button
                                            type={ButtonType.secondary}
                                            size={ButtonSize.small}
                                            value={'Add'}
                                            onClick={(e: any) =>
                                                onAddTwitterCircle(e, following)
                                            }
                                        />
                                    )}
                                </div>
                            </UserInfo>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </React.Fragment>
    );
};

export default TwitterCircleSettings;
