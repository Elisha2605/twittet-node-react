import React, { useEffect, useState } from 'react';
import styles from './ChatBoxUserContact.module.css';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_AVATAR_DEFAULT,
} from '../../../constants/common.constants';
import PopUpMenu from '../../../components/ui/PopUpMenu';
import { getTimeDifference } from '../../../utils/helpers.utils';
import { updateMessageStatus } from '../../../api/message.api';
import { useLocation } from 'react-router-dom';

interface ChatBoxUserContactProps {
    authUser: any;
    contact: any;
    menuOptions?: string[];
    menuIcons?: Record<string, React.ReactNode>;
    onClickOption?: Function;
    newMessage?: any;
    chatBoxUser?: any;
    contactNotificationDot?: boolean;
}

const ChatBoxUserContact: React.FC<ChatBoxUserContactProps> = ({
    authUser,
    contact,
    menuOptions,
    menuIcons,
    onClickOption,
    newMessage,
    chatBoxUser,
    contactNotificationDot,
}) => {
    const [isRead, setIsRead] = useState<boolean>(false);
    const [incomingMsg, setIncomingMsg] = useState<boolean>(false);
    const [isMenuHovered, setIsMenuHovered] = useState<boolean>(false);

    const contactId = contact?._id;
    const lastMessage = contact?.lastMessage?.text;
    const senderId = contact?.lastMessage?.sender;
    const receiverId = contact?.lastMessage?.receiver;
    const isMessageRead = contact?.lastMessage?.read;

    const lastMessageTime = getTimeDifference(
        new Date(contact?.lastMessage?.createdAt).getTime()
    );

    const lastMessageSubStringed = (text: string) => {
        const msg = text?.length > 30 ? text.substring(0, 30) + '...' : text;
        return msg;
    };

    const contactNamesSubStringed = (name: string) => {
        const shortName =
            name?.length > 11 ? name.substring(0, 11) + '...' : name;
        return shortName;
    };

    // update Message status
    useEffect(() => {
        if (isMessageRead && receiverId === authUser?._id) {
            setIsRead(true);
        }
    }, [isMessageRead, receiverId, authUser]);

    // set the notification dot on incoming message
    useEffect(() => {
        if (newMessage && newMessage?.sender?._id === contactId) {
            setIncomingMsg(true);
        }
    }, [contactId, newMessage]);

    useEffect(() => {
        if (newMessage?.sender?._id === chatBoxUser?._id) {
            setIncomingMsg(false);
            setIsRead(true);
        }
    }, [chatBoxUser?._id]);

    const notificationHighlight = `${
        senderId === contactId && !isRead ? styles.notification : ''
    }`;

    const notificationDot = `${
        !isMessageRead && !isRead && senderId === contactId
            ? styles.notificationDot
            : ''
    }`;

    return (
        <div
            className={`${styles.container} ${notificationHighlight} ${
                incomingMsg ? styles.notification : ''
            }`}
            onMouseEnter={() => setIsMenuHovered(true)}
            onMouseLeave={() => setIsMenuHovered(false)}
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
                        <p className={styles.contactName}>
                            {contactNamesSubStringed(contact?.name)}
                        </p>
                        <p className={styles.contactUserName}>
                            @{contactNamesSubStringed(contact?.username)}
                        </p>{' '}
                        <p className={styles.contactLastMsgTime}>
                            {lastMessage && '· ' + lastMessageTime}
                        </p>
                        <div className={styles.menuIcon}>
                            <p
                                className={`${notificationDot} ${
                                    incomingMsg ? styles.notificationDot : ''
                                }`}
                            ></p>
                            {/* {isMenuHovered && ( */}
                            <PopUpMenu
                                itemId={contactId}
                                options={menuOptions!}
                                icons={menuIcons!}
                                isOnClickWithEvent={true}
                                onClickWithEvent={(
                                    event,
                                    menuOptions,
                                    id,
                                    value
                                ) =>
                                    onClickOption!(
                                        event,
                                        menuOptions,
                                        id,
                                        value
                                    )
                                }
                                classNameMenuIcon={styles.menuIcon}
                            />
                            {/* )} */}
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

export default ChatBoxUserContact;
