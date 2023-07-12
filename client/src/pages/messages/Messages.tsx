import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import Header from '../../components/header/Header';
import styles from './Messages.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import GearIcon from '../../components/icons/GearIcon';
import EnvelopeIcon from '../../components/icons/EnvelopeIcon';
import SearchBar from '../../components/ui/SearchBar';
import Aside from '../../components/aside/Aside';
import DetailIcon from '../../components/icons/DetailIcon';
import { CONTACT_OPTION } from '../../constants/common.constants';
import {
    addContact,
    getAllContacts,
    removeContact,
} from '../../api/contact.api';
import UserContactInfo from './UserContactInfo';
import { messageIcon, messageOption } from '../../data/menuOptions';
import { useMessage } from '../../context/successMessage.context';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../../api/user.api';
import { getConversation, updateMessageStatus } from '../../api/message.api';
import Conversation from './conversation';
import AsideUserInfo from './AsideUserInfo';
import FormMessage from './FormMessage';
import AuthContext, { StoredContext } from '../../context/user.context';

interface MessageProps {
    socket: any;
}

const Message: FC<MessageProps> = ({ 
    socket,
}) => {
    const { path } = useParams<{ path: string }>();

    const [contacts, setContacts] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>();
    const [conversations, setConversations] = useState<any>([]);
    const [newMessage, setNewMessage] = useState<any>();

    const [isLoading, setIsloading] = useState<boolean>(false);

    const { showMessage } = useMessage();
    const navigate = useNavigate();

    const context = useContext(AuthContext);
    let ctx: StoredContext = context.getUserContext();

    useEffect(() => {
        const fetchAllContacts = async () => {
            const { contacts } = await getAllContacts();
            const reversedContacts = contacts;
            setContacts(reversedContacts);
            if (reversedContacts.length > 0 && !path) {
                navigate(`/message/${reversedContacts[0]._id}`);
            }
        };
        fetchAllContacts();
    }, [path, navigate]);

    useEffect(() => {
        const fetchAllContactAndConversation = async () => {
            if (path!) {
                setIsloading(true);
                const { user } = await getUserById(path!);
                const { conversation } = await getConversation(path!);
                setCurrentUser(user);
                setIsloading(false);
                setConversations(conversation);
            }
        };
        fetchAllContactAndConversation();
    }, [contacts.length, path]);
    

    const contactOnclikOption = async (option: any, contactId: any) => {
        if (option === CONTACT_OPTION.delete) {
            await removeContact(contactId);
            setContacts((prevState: any) =>
                prevState.filter((c: any) => c?._id !== contactId)
            );
            setCurrentUser(null);

            // Check if there are remaining contacts
            if (contacts.length > 1) {
                // Find the index of the current contact
                const currentIndex = contacts.findIndex(
                    (c: any) => c?._id === contactId
                );

                // Navigate to the next contact in the list
                if (currentIndex === 0) {
                    navigate(`/message/${contacts[1]?._id}`);
                } else {
                    navigate(`/message/${contacts[0]?._id}`);
                    // navigate to the above contact
                    // navigate(`/message/${contacts[currentIndex - 1]?._id}`);
                }
            } else {
                navigate('/message');
            }

            showMessage('Conversation deleted', 'success');
        }
    };

    const handleSearchClick = async (newContact: any) => {
        setContacts((prevState: any) => [newContact, ...prevState]);
        await addContact(newContact?._id);
        if (contacts) {
            navigate(`/message/${newContact._id}`);
        }
    };

    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [path, currentUser]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTop =
                scrollHeight - clientHeight;
        }
    };

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

    const onSendMessage = (message: any) => {
        setConversations((prevState: any) => [...prevState, message]);
        updateContactState(message);
        scrollToBottom();
    };

    const location = useLocation();
    const currentPath = location.pathname;

    const messageStatusUpdate = async (message: any) => {
        if (
            currentPath === `/message/${message?.sender?._id}` && message?.read === false
        ) {
            await updateMessageStatus(message?.sender?._id);
        } else {
            setNewMessage(message);
        }
    }

    useEffect(() => {
        socket?.on('getMessage', (obj: any) => {
            const { sender, message } = obj;
            if (sender?._id === path) {
                setConversations((prevState: any) => [...prevState, message]);
                scrollToBottom();
            }
            updateContactState(message, sender);
            if (
                !contacts.some((contact: any) => contact?._id === sender?._id)
            ) {
                updateContactState(message, sender);
                navigate(`/message/${sender?._id}`);
            }

            // update message status
            messageStatusUpdate(message);
            
        });
        return () => {
            socket?.off('getMessage');
        };
    }, [socket, path, contacts, navigate]);

    return (
        <React.Fragment>
            <div className={Layout.mainSectionMessageContainer}>
                <div className={Layout.mainSection}>
                    {/* Home page - start */}
                    <Header>
                        <div className={styles.headerContainer}>
                            <div className={styles.headerWrapper}>
                                <HeaderTitle title={'Messages'} />
                                <div className={styles.headerIcons}>
                                    <GearIcon />
                                    <EnvelopeIcon />
                                </div>
                            </div>
                            <SearchBar
                                onUserSelected={handleSearchClick}
                                width={95}
                                center={true}
                            />

                            {contacts.length > 0 &&
                                contacts.map((contact: any) => (
                                    <div
                                        key={contact?._id}
                                        className={`${
                                            path === contact?._id
                                                ? styles.active
                                                : ''
                                        }`}
                                    >
                                        <UserContactInfo
                                            authUser={ctx?.user}
                                            contact={contact}
                                            menuOptions={messageOption}
                                            menuIcons={messageIcon}
                                            onClickOption={contactOnclikOption}
                                            newMessage={newMessage}
                                        />
                                    </div>
                                ))}
                        </div>
                    </Header>
                </div>

                {/* Aside - start */}
                <Aside className={styles.aside}>
                    <Header border={false} clasName={styles.asideHeader}>
                        <DetailIcon className={styles.detailIcon} />
                    </Header>
                    <div className={styles.messages} ref={messagesContainerRef}>
                        {path && currentUser && (
                            <AsideUserInfo user={currentUser} />
                        )}
                        <div className={styles.messagesContainer}>
                            {path &&
                                conversations
                                    .slice()
                                    .map((conversation: any) => (
                                        <div key={conversation?._id}>
                                            <Conversation
                                                socket={socket}
                                                contacts={contacts}
                                                otherUser={currentUser}
                                                conversation={conversation}
                                                isLoading={isLoading}
                                            />
                                        </div>
                                    ))}
                        </div>
                        <FormMessage
                            socket={socket}
                            authUser={ctx?.user}
                            currentUser={currentUser}
                            onSendMessage={onSendMessage}
                        />
                    </div>
                </Aside>
                {/* Aside - end */}
            </div>
        </React.Fragment>
    );
};

export default Message;
