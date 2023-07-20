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
import { getConversation } from '../../../api/message.api';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import AsideUserInfo from '../AsideUserInfo';
import FormMessage from '../FormMessage';
import Conversation from '../conversation';
import ChatBoxUserContact from './ChatBoxUserContact';

interface ChatBoxProps {
    socket: any;
    addedContact: string;
    deleteContactId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ socket, addedContact, deleteContactId }) => {
    const [isRolledUp, setIsRolledUp] = useState(false);
    const [contacts, setContacts] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<any>();
    const [clickedUser, setClickedUser] = useState<any>(null);
    const [conversations, setConversations] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [replyMessage, setReplyMessage] = useState<any | null>();


    const { openModal } = useContext(ModalContext);

    const context = useContext(AuthContext);
    let ctx: StoredContext = context.getUserContext();
    const authUser = ctx.user;

    const { showMessage } = useMessage();

    const handleHeaderClick = () => {
        setIsRolledUp(!isRolledUp);
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

    // fetch conversations
    useEffect(() => {
        const fetchAllContactAndConversation = async () => {
            setIsLoading(true);

            if (clickedUser!) {
                const { conversation } = await getConversation(
                    clickedUser?._id!
                );
                setConversations(conversation)
            }
            setIsLoading(false);
        };
        fetchAllContactAndConversation();
    }, [clickedUser]);

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

    const handleUserClick = (user: any) => {
        setClickedUser(user);
    };

    const navigateToConversation = () => {
        // Perform navigation logic here
        // You can use the clickedUser to render the appropriate conversation
    };

    const goBack = (e: React.MouseEvent) => {
        e.stopPropagation();
        setClickedUser(null);
    };

    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (clickedUser) {
            scrollToBottom();
        }
    }, [conversations]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTop =
                scrollHeight - clientHeight;
        }
    };;

    
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
            console.log(message);
            if (sender?._id === clickedUser?._id) {
                setConversations((prevState: any) => [...prevState, message]);
                scrollToBottom();
            }
            updateContactState(message, sender);
        });
        return () => {
            socket?.off('getMessage');
        };
    }, [socket, clickedUser]);

    const onSendMessage = (message: any) => {
        console.log(message);
        setConversations((prevState: any) => [...prevState, message]);
        updateContactState(message);
        scrollToBottom();
    };

    const onMessageReply = (replyMessage: any) => {
        setReplyMessage(replyMessage);
    }

    return (
        <div className={`${styles.chatBox} ${isRolledUp ? styles.rollUp : ''}`}>
            {clickedUser ? (
                <>
                    <div
                        className={styles.chatBoxConversationHeader}
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
                                    {clickedUser?.name}
                                </div>
                                <div className={styles.username}>
                                    @{clickedUser?.username}
                                </div>
                            </div>
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
                    {!isLoading && (
                        <div className={styles.messages} ref={messagesContainerRef}>
                            <AsideUserInfo user={clickedUser} />
                            <div className={styles.messagesContainer}>
                                    {clickedUser &&
                                        conversations
                                            .slice()
                                            .map((conversation: any) => (
                                                <div key={conversation?._id}>
                                                    <Conversation
                                                        socket={socket}
                                                        contacts={contacts}
                                                        otherUser={clickedUser}
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
                                currentUser={clickedUser}
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
                        className={styles.chatBoxHeader}
                        onClick={handleHeaderClick}
                    >
                        <div className={styles.chatBoxTitle}>Messages</div>
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
                                        navigateToConversation={
                                            navigateToConversation
                                        }
                                    />
                                </div>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatBox;
