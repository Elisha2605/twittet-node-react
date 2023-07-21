import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './ChatBox.module.css';
import { getAllContacts, removeContact } from '../../../api/contact.api';
import UserContactInfo from '../UserContactInfo';
import { contactIcon, contactOption } from '../../../data/menuOptions';
import AuthContext, { StoredContext } from '../../../context/user.context';
import { CONTACT_OPTION } from '../../../constants/common.constants';
import { useMessage } from '../../../context/successMessage.context';
import faAdd from '../../../assets/faAdd-regular.svg';
import faChevronsUp from '../../../assets/faChevronsUp.svg';
import faChevronsDown from '../../../assets/faChevronsDown.svg';
import { ModalContext } from '../../../context/modal.context';
import { getConversation, updateMessageStatus } from '../../../api/message.api';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import AsideUserInfo from '../AsideUserInfo';
import FormMessage from '../FormMessage';
import Conversation from '../conversation';
import ChatBoxUserContact from './ChatBoxUserContact';
import { getMessageNotification, removeMessageNotification } from '../../../api/notification.api';
import { useLocation } from 'react-router-dom';

interface ChatBoxProps {
    socket: any;
    addedContact: string;
    deleteContactId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ socket, addedContact, deleteContactId }) => {
    const [isRolledUp, setIsRolledUp] = useState(false);
    const [contacts, setContacts] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<any>();
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [conversations, setConversations] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [replyMessage, setReplyMessage] = useState<any | null>();
    
    const [boxHighlight, setBoxHighlight] = useState(false);
    const [notificationDot, setNotificationDot] = useState<boolean>(false);

    const [contactNotificationDot, setContactNotificationDot] = useState<boolean>(false);

    const [showConversation, setShowConversation] = useState<boolean>(false);


    const { openModal } = useContext(ModalContext);

    const context = useContext(AuthContext);
    let ctx: StoredContext = context.getUserContext();
    const authUser = ctx.user;

    const location = useLocation();
    const currentPath = location.pathname;
    const isMessagePage = currentPath.startsWith('/message');

    const { showMessage } = useMessage();

    const handleHeaderClick = async () => {
        await removeMessageNotification();
        setIsRolledUp(!isRolledUp);
        setNotificationDot(false)
    };

    const handleUserClick = async (user: any) => {
        
        await updateMessageStatus(user?._id);
        setSelectedContact(user);
        setShowConversation(true);
    };

    // fetch contacts
    useEffect(() => {
        const fetchAllContacts = async () => {
            const { contacts } = await getAllContacts();
            const reversedContacts = contacts;
            setContacts(reversedContacts);
        };
        fetchAllContacts();
    }, []);

    const goBack = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConversation(false);
    };

    // fetch conversations
    useEffect(() => {
        const fetchAllContactAndConversation = async () => {
            setIsLoading(true);

            if (selectedContact!) {
                const { conversation } = await getConversation(
                    selectedContact?._id!
                );
                setConversations(conversation)
            }
            setIsLoading(false);
        };
        fetchAllContactAndConversation();
    }, [selectedContact]);

    const contactOnclikOption = async (e: React.MouseEvent, option: any, contactId: any) => {
        e.stopPropagation();
        if (option === CONTACT_OPTION.delete) {
            await removeContact(contactId);
            setContacts((prevState: any) =>
                prevState.filter((c: any) => c?._id !== contactId)
            );
            showMessage('Conversation deleted', 'success');
        }
    };

    useEffect(() => {
        setContacts((prevState: any) => [addedContact, ...prevState]);
    }, [addedContact]);

    useEffect(() => {
        setContacts((prevState: any) =>
            prevState.filter((c: any) => c?._id !== deleteContactId)
        );
    }, [deleteContactId]);

    const onAddContact = (e: React.MouseEvent) => {
        e.stopPropagation();
        openModal('contact-modal');
    };

    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedContact) {
            scrollToBottom();
        }
    }, [conversations]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTop =
                scrollHeight - clientHeight;
        }
    };

    useEffect(() => {
        socket?.on('getMessageNotification', async (obj: any) => {
            const { msgNotification } = await getMessageNotification();
            setNewMessage(msgNotification);
            setNewMessage(obj);

            setBoxHighlight(true);
            setNotificationDot(true);

            // Set a timeout to make boxHighlight false after 3000 milliseconds (3 seconds)
            setTimeout(() => {
                setBoxHighlight(false);
            }, 3000);

        });
    }, [socket]);

    
    const updateContactState = (message: any, contactUser?: any) => {
        setContacts((prevContacts) =>
            prevContacts.map((contact) => {
                if (
                    contact._id ===
                    (contactUser ? contactUser._id : message.receiver)
                ) {
                    return {
                        ...contact,
                        lastMessage: {
                            text: message.text,
                            read: true,
                            createdAt: message.createdAt,
                        },
                    };
                }
                return contact;
            })
        );
    };

    // socket
    useEffect(() => {
        socket?.on('getMessage', (obj: any) => {
            const { sender, message } = obj;
            if (sender?._id === selectedContact?._id) {
                setConversations((prevState: any) => [...prevState, message]);
                scrollToBottom();
            }
            updateContactState(message, sender);
        });
        return () => {
            socket?.off('getMessage');
        };
    }, [socket, selectedContact]);

    const onSendMessage = (message: any) => {
        console.log(message);
        setConversations((prevState: any) => [...prevState, message]);
        updateContactState(message);
        scrollToBottom();
    };

    const onMessageReply = (replyMessage: any) => {
        setReplyMessage(replyMessage);
    }

    const boxBlueHighlight = !isMessagePage && boxHighlight && isRolledUp ? styles.boxHighlight : ''

    const dotHighlight = !isMessagePage && notificationDot && isRolledUp || contacts.some((contact: any) => contact.lastMessage?.visited === false) ? styles.dot : ''

    return (
        <>
            {!isMessagePage && (

                <div className={`${styles.chatBox} ${isRolledUp ? styles.rollUp : ''}`}>
                    {showConversation ? (
                        <>
                            <div
                                className={`${styles.chatBoxConversationHeader} ${boxBlueHighlight}`}
                                onClick={handleHeaderClick}
                            >
                                <div className={styles.userContactInfo}>
                                    {!isRolledUp && (
                                        <div onClick={goBack}>
                                            <ArrowLeftIcon className={styles.backBtn} />
                                        </div>
                                    )}
                                    <div>
                                        <div className={styles.name}>
                                            {selectedContact?.name}
                                        </div>
                                        <div className={styles.username}>
                                            @{selectedContact?.username}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.headerIcons}>
                                    <div
                                        className={`${styles.iconItem} ${styles.chevronsIcon}`}
                                    >
                                        <img
                                            src={
                                                isRolledUp
                                                    ? faChevronsUp
                                                    : faChevronsDown
                                            }
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                            {!isLoading && (
                                <div className={styles.messages} ref={messagesContainerRef}>
                                    <AsideUserInfo user={selectedContact} />
                                    <div className={styles.messagesContainer}>
                                            {selectedContact &&
                                                conversations
                                                    .slice()
                                                    .map((conversation: any) => (
                                                        <div key={conversation?._id}>
                                                            <Conversation
                                                                socket={socket}
                                                                contacts={contacts}
                                                                otherUser={selectedContact}
                                                                conversation={conversation}
                                                                onDeleteMessage={() => {}}
                                                                onReplyMessage={onMessageReply}
                                                            />
                                                        </div>
                                                    ))}
                                        </div>
                                    <FormMessage
                                        socket={socket}
                                        authUser={authUser}
                                        currentUser={selectedContact}
                                        replyMessage={replyMessage}
                                        setReplyMessage={setReplyMessage}
                                        onSendMessage={onSendMessage}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div
                                className={`${styles.chatBoxHeader} ${boxBlueHighlight}`}
                                onClick={handleHeaderClick}
                            >
                                <div className={styles.chatBoxTitle}>
                                    <p>Messages</p>
                                    <span className={`${boxBlueHighlight ? styles.whiteDot : dotHighlight}`}></span>
                                </div>
                                <div className={styles.headerIcons}>
                                    <div
                                        className={`${styles.iconItem} ${styles.addIcon}`}
                                        onClick={onAddContact}
                                    >
                                        <img src={faAdd} alt="" />
                                    </div>
                                    <div
                                        className={`${styles.iconItem} ${styles.chevronsIcon}`}
                                    >
                                        <img
                                            src={
                                                isRolledUp
                                                    ? faChevronsUp
                                                    : faChevronsDown
                                            }
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.chatBoxContent}>
                                {contacts.length > 0 &&
                                    contacts.map((contact: any) => (
                                        <div
                                            key={contact?._id}
                                            className={''}
                                            onClick={() => handleUserClick(contact)}
                                        >
                                            <ChatBoxUserContact
                                                authUser={authUser}
                                                contact={contact}
                                                menuOptions={contactOption}
                                                menuIcons={contactIcon}
                                                onClickOption={contactOnclikOption}
                                                newMessage={newMessage}
                                                chatBoxUser={selectedContact}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default ChatBox;
