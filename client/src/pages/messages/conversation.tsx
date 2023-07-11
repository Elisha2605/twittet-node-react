import React, { useEffect, useRef, useState } from 'react';
import styles from './conversation.module.css';
import { getTimeAMPM } from '../../utils/helpers.utils';
import { IMAGE_MESSAGE_BASE_URL } from '../../constants/common.constants';

interface ConversationProps {
    socket: any;
    otherUser: any;
    conversation: any;
    contacts: any;
}

const Conversation: React.FC<ConversationProps> = ({
    socket,
    conversation,
    otherUser,
    contacts,
}) => {
    const [isMessageRead, setIsMessageRead] = useState<any>(false);
    const [msgStatus, setMsgStatus] = useState<any>();

    const imgRef = useRef<HTMLImageElement>(null);

    const messageStatus = () => {
        if (
            contacts.some(
                (contact: any) =>
                    contact?.lastMessage?.sender === conversation?.sender &&
                    contact?.lastMessage?._id === conversation?._id
            ) &&
            conversation?.read === true
        ) {
            return '· Seen';
        }
    };

    useEffect(() => {
        socket?.on('getMessageStatus', (data: any) => {
            setIsMessageRead(data.isMessageRead);
            setMsgStatus(data);
        });
        return () => {
            socket?.off('getMessageStatus');
        };
    }, [socket]);

    const handleImageLoad = () => {
        if (imgRef.current) {
            // Check if the image height exceeds the threshold
            if (imgRef.current.offsetHeight > 200) {
                // Set your desired threshold here
                // Add the 'imageFixedHeight' class to limit the image height
                const parentElement = imgRef.current.parentNode as HTMLElement;
                parentElement.classList.add(styles.imageFixedHeight);
            }
        }
    };

    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.conversationWrapper}>
                    {conversation?.sender !== otherUser?._id ? (
                        <>
                            {conversation?.image && (
                                <div>
                                    <div
                                        className={`${styles.imageAuthUser} ${
                                            !conversation?.text
                                                ? styles.textStatusAndTimeAuthUserNoImage
                                                : ''
                                        }`}
                                    >
                                        <img
                                            ref={imgRef}
                                            src={
                                                conversation.image
                                                    ? `${IMAGE_MESSAGE_BASE_URL}/${conversation.image}`
                                                    : undefined
                                            }
                                            alt=""
                                            onLoad={handleImageLoad}
                                        />
                                        {!conversation?.text && (
                                            <p
                                                className={
                                                    styles.textStatusAndTimeAuthUserNoImage
                                                }
                                            >
                                                <span>
                                                    {getTimeAMPM(
                                                        conversation?.createdAt
                                                    )}
                                                </span>{' '}
                                                {messageStatus()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {conversation?.text && (
                                <div className={styles.authUser}>
                                    <p className={styles.authUserText}>
                                        {conversation?.text}
                                    </p>
                                    <p
                                        className={
                                            styles.textStatusAndTimeAuthUser
                                        }
                                    >
                                        <span>
                                            {getTimeAMPM(
                                                conversation?.createdAt
                                            )}
                                        </span>{' '}
                                        {messageStatus()}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {conversation?.image && (
                                <div>
                                    <div
                                        className={`${styles.imageOtherUser} ${
                                            !conversation?.text
                                                ? styles.otherUserWithNoText
                                                : null
                                        }`}
                                    >
                                        <img
                                            ref={imgRef}
                                            src={
                                                conversation.image
                                                    ? `${IMAGE_MESSAGE_BASE_URL}/${conversation.image}`
                                                    : undefined
                                            }
                                            alt=""
                                            onLoad={handleImageLoad}
                                        />
                                        {!conversation?.text && (
                                            <p
                                                className={
                                                    styles.textStatusAndTimeOtherUserNoImage
                                                }
                                            >
                                                <span>
                                                    {getTimeAMPM(
                                                        conversation?.createdAt
                                                    )}
                                                </span>{' '}
                                                {messageStatus()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {conversation?.text && (
                                <>
                                    <div className={styles.otherUserText}>
                                        <p>{conversation?.text}</p>
                                    </div>
                                    <p
                                        className={
                                            styles.textStatusAndTimeOtherUser
                                        }
                                    >
                                        <span>
                                            {getTimeAMPM(
                                                conversation?.createdAt
                                            )}
                                        </span>
                                    </p>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Conversation;
