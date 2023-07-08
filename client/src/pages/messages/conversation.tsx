import React, { useEffect } from 'react';
import styles from './conversation.module.css';
import { getTimeAMPM } from '../../utils/helpers.utils';

interface ConversationProps {
    otherUser: any;
    conversation: any;
    contacts: any;
}

const Conversation: React.FC<ConversationProps> = ({
    conversation,
    otherUser,
    contacts,
}) => {
    
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


    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.conversationWrapper}>
                    {conversation?.sender !== otherUser?._id ? (
                        <div className={styles.authUser}>
                            <p className={styles.authUserText}>
                                {conversation?.text}
                            </p>
                            <p className={styles.textStatusAndTimeAuthUser}>
                            <span>{getTimeAMPM(conversation?.createdAt)}</span>{' '}{messageStatus()}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.otherUser}>
                                <p>{conversation?.text}</p>
                            </div>
                            <p className={styles.textStatusAndTimeOtherUser}>
                            <span>{getTimeAMPM(conversation?.createdAt)}</span>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Conversation;
