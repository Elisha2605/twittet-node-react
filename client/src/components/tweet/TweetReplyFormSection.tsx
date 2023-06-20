import React, { FC } from 'react';
import styles from './TweetReplyFormSection.module.css';
import { IMAGE_AVATAR_BASE_URL, TWEET_AUDIENCE, TWEET_REPLY } from '../../constants/common.constants';
import Avatar, { Size } from '../ui/Avatar';
import UserIcon from '../icons/UserIcon';
import AtIcon from '../icons/AtIcon';
import LoadingRing from '../ui/LoadingRing';


interface TweetReplyFormSectionProps {
    tweet: any;
    authUser: any;
    isOnlyPeopleYouFollow: Function;
    isMention: Function;
    isTwitterCircle: Function;
    children: React.ReactNode;
    isLoading: boolean;
}

const TweetReplyFormSection: FC<TweetReplyFormSectionProps> = ({
    tweet,
    authUser,
    isOnlyPeopleYouFollow,
    isMention,
    isTwitterCircle,
    children,
    isLoading
}) => {

    const renderFormSection = () => {
        if (
            isOnlyPeopleYouFollow(tweet & authUser?._id) &&
            tweet?.reply === TWEET_REPLY.peopleYouFollow
        ) {
            return (
                <div className={styles.formSection}>
                    <Avatar
                        path={
                            authUser?.avatar
                                ? `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`
                                : undefined
                        }
                        size={Size.small}
                        className={''}
                    />
                    {children}
                </div>
            );
        } else if (
            isMention(tweet && authUser?._id) &&
            tweet?.reply === TWEET_REPLY.onlyPeopleYouMention
        ) {
            return (
                <div className={styles.formSection}>
                    <Avatar
                        path={
                            authUser?.avatar
                                ? `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`
                                : undefined
                        }
                        size={Size.small}
                        className={''}
                    />
                    {children}
                </div>
            );
        } else if (
            isTwitterCircle(tweet && authUser?._id) &&
            tweet?.audience === TWEET_AUDIENCE.twitterCircle
        ) {
            return (
                <div className={styles.formSection}>
                    <Avatar
                        path={
                            authUser?.avatar
                                ? `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`
                                : undefined
                        }
                        size={Size.small}
                        className={''}
                    />
                    {children}
                </div>
            );
        } else if (
            !isOnlyPeopleYouFollow(tweet && tweet?.user?._id) &&
            tweet?.reply === TWEET_REPLY.peopleYouFollow
        ) {
            if (!isLoading) {
                return (
                    <div className={styles.whoCanReply}>
                        <div className={styles.replyMsgWrapper}>
                            <UserIcon isMedium={true} />
                            <div className={styles.replyMsg}>
                                <h4>Who can reply?</h4>
                                <p>
                                    People @{tweet?.user?.username} follows can
                                    reply
                                </p>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return <LoadingRing size={'small'} className={styles.loadingRing} />
            }
        } else if (
            !isMention(tweet && authUser?._id) &&
            tweet?.reply === TWEET_REPLY.onlyPeopleYouMention
        ) {
            return (
                <div className={styles.whoCanReply}>
                    <div className={styles.replyMsgWrapper}>
                        <AtIcon isMedium={true} />
                        <div className={styles.replyMsg}>
                            <h4>Who can reply?</h4>
                            <p>
                                People @{tweet?.user?.username} mentioned can
                                reply
                            </p>
                        </div>
                    </div>
                </div>
            );
        } else if (
            !isTwitterCircle(tweet && tweet?.user?._id) &&
            tweet?.audience === TWEET_AUDIENCE.twitterCircle
        ) {
            if (!isLoading) {
                return (
                    <div className={styles.whoCanReply}>
                        <div className={styles.replyMsgWrapper}>
                            <AtIcon isMedium={true} />
                            <div className={styles.replyMsg}>
                                <h4>Who can reply?</h4>
                                <p>
                                    People in Twitter Circle who follow @
                                    {tweet?.user?.username} can reply
                                </p>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return <LoadingRing size={'small'} className={styles.loadingRing} />
            }
        } else {
            return (
                <div className={styles.formSection}>
                    <Avatar
                        path={
                            authUser?.avatar
                                ? `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`
                                : undefined
                        }
                        size={Size.small}
                        className={''}
                    />
                    {children}
                </div>
            );
        }
    };

    return renderFormSection()

};

export default TweetReplyFormSection;
