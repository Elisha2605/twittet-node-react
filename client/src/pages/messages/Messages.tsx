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
import { getConversation } from '../../api/message.api';
import Conversation from './conversation';
import AsideUserInfo from './AsideUserInfo';
import FormMessage from './FormMessage';
import AuthContext, { StoredContext } from '../../context/user.context';

interface MessageProps {
    socket: any;
}

const Message: FC<MessageProps> = ({
    socket
}) => {
    const { path } = useParams<{ path: string }>();

    const [contacts, setContacts] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>();
    const [conversations, setConversations] = useState<any>([]);

    const { showMessage } = useMessage();
    const navigate = useNavigate();

    const context = useContext(AuthContext);
    let ctx: StoredContext = context.getUserContext();


    useEffect(() => {
        const fetchAllContacts = async () => {
            const { contacts } = await getAllContacts();
            const reversedContacts = contacts.contactList.reverse();
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
                const { user } = await getUserById(path!);
                const { conversation } = await getConversation(path!);
                setCurrentUser(user);
                setConversations(conversation);
            } else if (contacts.length === 0) {
                navigate('/message');
            }
        };
        fetchAllContactAndConversation();
    }, [contacts.length, navigate, path]);

    const contactOnclikOption = async (option: any, contactId: any) => {
        if (option === CONTACT_OPTION.delete) {
            await removeContact(contactId);
            setContacts((prevState: any) =>
                prevState.filter((c: any) => c?._id !== contactId)
            );
            setCurrentUser(null);
            if (contacts.length > 1) {
                navigate(`/message/${contacts[1]?._id}`);
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
            localStorage.setItem('lastMessageContactId', newContact?._id);
        }
    };

    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom(); // Scroll to the bottom initially
    }, [path, currentUser]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTop =
                scrollHeight - clientHeight;
        }
    };

    const onSendMessage = (message: string) => {
        setConversations((prevState: any) => [...prevState, message]);
        scrollToBottom();
    };

    useEffect(() => {
        socket?.on('getMessage', (obj: any) => {
            const { sender, message } = obj;
            if (sender._id === path) {
                console.log(obj);
                setConversations((prevState: any) => [...prevState, message]);
                scrollToBottom();
            }
        });
        return () => {
            socket?.off('getMessage');
        };
    }, [socket, path])


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
                            <SearchBar onUserSelected={handleSearchClick} width={95} center={true} />

                            {contacts.length > 0 &&
                                contacts.map((contact: any) => (
                                    <div
                                        key={contact?._id}
                                        className={`${
                                            path === contact?._id
                                                ? styles.active
                                                : ''
                                        }`}
                                        onClick={() => {
                                            navigate(
                                                `/message/${contact?._id}`
                                            );
                                        }}
                                    >
                                        <UserContactInfo
                                            contact={contact}
                                            menuOptions={messageOption}
                                            menuIcons={messageIcon}
                                            onClickOption={contactOnclikOption}
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
                                                otherUser={currentUser}
                                                conversation={conversation}
                                            />
                                        </div>
                                    ))}
                        </div>
                        <FormMessage
                            socket={socket}
                            authUser={ctx.user}
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
