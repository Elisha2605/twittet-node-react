import React, { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import styles from './Messages.module.css';
import Layout from '../../Layout.module.css';
import HeaderTitle from '../../components/header/HeaderTitle';
import GearIcon from '../../components/icons/GearIcon';
import EnvelopeIcon from '../../components/icons/EnvelopeIcon';
import SearchBar from '../../components/ui/SearchBar';
import Aside from '../../components/aside/Aside';
import DetailIcon from '../../components/icons/DetailIcon';
import Avatar, { Size } from '../../components/ui/Avatar';
import {
    CONTACT_OPTION,
    IMAGE_AVATAR_BASE_URL,
} from '../../constants/common.constants';
import {
    addContact,
    getAllContacts,
    removeContact,
} from '../../api/contact.api';
import UserContactInfo from './UserContactInfo';
import { messageIcon, messageOption } from '../../data/menuOptions';
import { useMessage } from '../../context/successMessage.context';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../../api/user.api';
import { getMonthName, getYear } from '../../utils/helpers.utils';
import { getConversation } from '../../api/message.api';
import Conversation from './conversation';

const Message = () => {
    const { path } = useParams<{ path: string }>();

    const [contacts, setContacts] = useState<any[]>([]);
    // const [currentPath, setCurrentPath] = useState<string>();
    const [currentUser, setCurrentUser] = useState<any>();
    const [conversations, setConversations] = useState<any>([]);

    const { showMessage } = useMessage();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllContacts = async () => {
            const { contacts } = await getAllContacts();
            setContacts(contacts.contactList);
        };
        fetchAllContacts();
    }, [currentUser]);

    const contactOnclikOption = async (option: any, contactId: any) => {
        if (option === CONTACT_OPTION.delete) {
            await removeContact(contactId);
            setContacts((prevState: any) =>
                prevState.filter((c: any) => c?._id !== contactId)
            );
            setCurrentUser(null);
            if (contacts.length > 1) {
                navigate(`/message/${contacts[1]?._id}`);
                const updatedLastMessageContactId = contacts[1]._id;
                localStorage.setItem(
                    'lastMessageContactId',
                    updatedLastMessageContactId
                );
            } else {
                navigate('/message');
                localStorage.removeItem('lastMessageContactId');
            }
            showMessage('Conversation deleted', 'success');
        }
    };

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
    }, [path]);

    const handleSearchClick = async (newContact: any) => {
        setContacts((prevState: any) => [newContact, ...prevState]);
        await addContact(newContact?._id);
        if (contacts) {
            navigate(`/message/${newContact._id}`);
            localStorage.setItem(
                'lastMessageContactId',
                newContact?._id
            );
        }
    };

    const handleContactClick = async (contactId: string) => {
        navigate(`/message/${contactId}`);
    };

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
                            <SearchBar onUserSelected={handleSearchClick} />

                            {contacts.length > 0 &&
                                contacts.map((contact: any) => (
                                    <div
                                        key={contact?._id}
                                        className={`${
                                            path === contact?._id
                                                ? styles.active
                                                : ''
                                        }`}
                                        onClick={() =>
                                            handleContactClick(contact?._id)
                                        }
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

                    {/* Home page - end */}
                </div>

                {/* Aside - start */}
                <div>
                    <Aside className={styles.aside}>
                        <Header border={false} clasName={styles.asideHeader}>
                            <DetailIcon className={styles.detailIcon} />
                        </Header>
                        {path && currentUser && (
                            <div className={styles.userToInfo}>
                                <Avatar
                                    size={Size.medium}
                                    path={
                                        currentUser?.avatar
                                            ? `${IMAGE_AVATAR_BASE_URL}/${currentUser?.avatar}`
                                            : `${IMAGE_AVATAR_BASE_URL}/default-avatar.jpg`
                                    }
                                    className={''}
                                />
                                <p className={styles.fullname}>
                                    {currentUser?.name}
                                </p>
                                <p className={styles.username}>
                                    @{currentUser?.username}
                                </p>
                                <p className={styles.moreInfo}>
                                    Joined{' '}
                                    {getMonthName(currentUser?.createdAt)}{' '}
                                    {getYear(currentUser?.createdAt)} ·{' '}
                                    {currentUser?.followerCount} Followers
                                </p>
                            </div>
                        )}
                        {/* Display Messages - start */}
                        <div className={styles.messages}>
                            {path &&
                                conversations.map((conversation: any) => (
                                    <div key={conversation?._id}>
                                        <Conversation
                                            otherUser={currentUser}
                                            conversation={conversation}
                                        />
                                    </div>
                                ))}
                        </div>
                        {/* Display Messages - end */}
                    </Aside>
                </div>
                {/* Aside - end */}
            </div>
        </React.Fragment>
    );
};

export default Message;
