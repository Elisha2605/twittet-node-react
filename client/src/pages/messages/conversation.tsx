import React, { useEffect, useRef, useState } from 'react';
import styles from './conversation.module.css';
import AuthUserChat from './AuthUserChat';
import OtherUserChat from './OtherUserChat';
import { messageIcon, messageOption } from '../../data/menuOptions';
import { MESSAGE_OPTION } from '../../constants/common.constants';
import { deleteMessage } from '../../api/message.api';

interface ConversationProps {
    socket: any;
    otherUser: any;
    conversation: any;
    contacts: any;
    isLoading: boolean;
    onDeleteMessage: (messageId: string) => void;
}

const Conversation: React.FC<ConversationProps> = ({
    socket,
    conversation,
    otherUser,
    contacts,
    isLoading,
    onDeleteMessage,
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
            setIsMessageRead(true);
            return `${'· Seen'}`
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

    const onClickMessageOption = async (option: any, messageId: any) => {

        if (option === MESSAGE_OPTION.reply) {
            console.log(messageId);
            console.log('reply clicked');
        } 
        if (option === MESSAGE_OPTION.copyMessage) {
            console.log('copy message cliked');
        }
        if (option === MESSAGE_OPTION.delete) {
            const res = await deleteMessage(messageId)
            if (res.success) {
                onDeleteMessage(messageId)
            }
        }
    }

    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.conversationWrapper}>
                    {conversation?.sender !== otherUser?._id ? (
                        <AuthUserChat
                            conversation={conversation}
                            imgRef={imgRef}
                            handleImageLoad={handleImageLoad}
                            messageStatus={messageStatus}
                            isLoading={isLoading}
                            messageOption={messageOption}
                            messageIcon={messageIcon}
                            onClickMessageOption={onClickMessageOption}
                            isMessageRead={isMessageRead}
                        />
                    ) : (
                        <OtherUserChat
                            conversation={conversation}
                            imgRef={imgRef}
                            handleImageLoad={handleImageLoad}
                            messageStatus={messageStatus}
                            isLoading={isLoading}
                            messageOption={messageOption}
                            messageIcon={messageIcon}
                            onClickMessageOption={onClickMessageOption}
                        />
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Conversation;
