import React, { useEffect, useState } from 'react';
import styles from './UserContactInfo.module.css';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_AVATAR_DEFAULT,
} from '../../constants/common.constants';
import PopUpMenu from '../../components/ui/PopUpMenu';
import { getTimeDifference } from '../../utils/helpers.utils';
import { updateMessageStatus } from '../../api/message.api';
import { useNavigate } from 'react-router-dom';

interface UserContactInfoProps {
    authUser: any;
    contact: any;
    menuOptions?: string[];
    menuIcons?: Record<string, React.ReactNode>;
    onClickOption?: Function;
    newMessage: any;
}

const UserContactInfo: React.FC<UserContactInfoProps> = ({
    authUser,
    contact,
    menuOptions,
    menuIcons,
    onClickOption,
    newMessage,
}) => {

    const [isRead, setIsRead] = useState<boolean>(true);


    const lastMessageSubStringed = (text: string) => {
        const msg = text?.length > 30 ? text.substring(0, 30) + '...' : text;
        return msg;
    };

    const navigate = useNavigate();

    const lastMessage = contact?.lastMessage?.text;

    const lastMessageTime = getTimeDifference(
        new Date(contact?.lastMessage?.createdAt).getTime()
    );

    const updateStatus = async () => {
        if (
            contact?.lastMessage?.receiver === authUser?._id &&
            contact?.lastMessage?.read === false
        ) {
            await updateMessageStatus();
        }
    };

    const navigateToConversation = (e: React.MouseEvent) => {
        e.stopPropagation()
        updateStatus();
        setIsRead(true);
        navigate(`/message/${contact?._id}`);
    };

    useEffect(() => {
        if (newMessage && newMessage?.sender === contact?._id) {
            setIsRead(false);
        }
    }, [contact?._id, newMessage])

    const containerClassName = `${styles.contactsContainer} ${
        newMessage && newMessage?.sender === contact?._id && !isRead
          ? styles.notification
          : ''
    }`;

    const notificationDot = `${
        newMessage && newMessage?.sender === contact?._id && !isRead
          ? styles.notificationDot
          : ''
    }`;

    return (
        <div
            className={`${!contact?.lastMessage?.read && contact?._id === contact?.lastMessage?.sender ? styles.notification : ''} ${containerClassName}`}
            onClick={navigateToConversation}
        >
            <div className={styles.contactWrapper}>
                <div className={styles.avatar}>
                    <img
                        src={
                            contact?.avatar
                                ? `${IMAGE_AVATAR_BASE_URL}/${contact?.avatar}`
                                : `${IMAGE_AVATAR_BASE_URL}/${IMAGE_AVATAR_DEFAULT}`
                        }
                        alt=""
                    />
                </div>
                <div className={styles.contactInfoWrapper}>
                    <div className={styles.contactInfo}>
                        <p className={styles.contactName}>{contact?.name}</p>
                        <p className={styles.contactUserName}>
                            @{contact?.username}
                        </p>{' '}
                        <p className={styles.contactLastMsgTime}>
                            {lastMessage && '· ' + lastMessageTime}
                        </p>
                        <div className={styles.menuIcon}>
                            <p className={!contact?.lastMessage?.read && contact?._id === contact?.lastMessage?.sender ? styles.notificationDot : ''}></p>
                            <p className={notificationDot}></p>
                            <PopUpMenu
                                itemId={contact?._id}
                                options={menuOptions!}
                                icons={menuIcons!}
                                onClick={(menuOptions, id) =>
                                    onClickOption!(menuOptions, id)
                                }
                                className={styles.menuOption}
                            />
                        </div>
                    </div>
                    {contact && (
                        <div className={styles.lastMessage}>
                            {lastMessageSubStringed(lastMessage)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserContactInfo;
