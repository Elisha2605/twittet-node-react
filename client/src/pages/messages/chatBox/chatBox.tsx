// ChatBox.tsx

import React, { useContext, useEffect, useState } from 'react';
import styles from './ChatBox.module.css';
import { getAllContacts, removeContact } from '../../../api/contact.api';
import UserContactInfo from '../UserContactInfo';
import { contactIcon, contactOption } from '../../../data/menuOptions';
import AuthContext, { StoredContext } from '../../../context/user.context';
import { CONTACT_OPTION } from '../../../constants/common.constants';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../../../context/successMessage.context';
import faAdd from '../../../assets/faAdd-regular.svg';
import faChevronsUp from '../../../assets/faChevronsUp.svg';
import faChevronsDown from '../../../assets/faChevronsDown.svg';
import { ModalContext } from '../../../context/modal.context';

interface ChatBoxProps {
    addedContact: string;
    deleteContactId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
    addedContact,
    deleteContactId,
}) => {
    const [isRolledUp, setIsRolledUp] = useState(false);
    const [contacts, setContacts] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<any>();

    const { openModal } = useContext(ModalContext);

    const context = useContext(AuthContext);
    let ctx: StoredContext = context.getUserContext();

    const navigate = useNavigate();
    const { showMessage } = useMessage();

    const handleHeaderClick = () => {
        setIsRolledUp(!isRolledUp);
    };

    useEffect(() => {
        const fetchAllContacts = async () => {
            const { contacts } = await getAllContacts();
            const reversedContacts = contacts;
            setContacts(reversedContacts);
        };
        fetchAllContacts();
    }, []);

    const contactOnclikOption = async (option: any, contactId: any) => {
        if (option === CONTACT_OPTION.delete) {
            await removeContact(contactId);
            setContacts((prevState: any) =>
                prevState.filter((c: any) => c?._id !== contactId)
            );
            showMessage('Conversation deleted', 'success');
        }
    };

    useEffect(() => {
        setContacts((prevState: any) =>
            [addedContact, ...prevState]
        );
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

    return (
        <div className={`${styles.chatBox} ${isRolledUp ? styles.rollUp : ''}`}>
            <div className={styles.chatBoxHeader} onClick={handleHeaderClick}>
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
                            src={isRolledUp ? faChevronsUp : faChevronsDown}
                            alt=""
                        />
                    </div>
                </div>
            </div>
            <div className={styles.chatBoxContent}>
                {contacts.length > 0 &&
                    contacts.map((contact: any) => (
                        <div key={contact?._id} className={''}>
                            <UserContactInfo
                                authUser={ctx?.user}
                                contact={contact}
                                menuOptions={contactOption}
                                menuIcons={contactIcon}
                                onClickOption={contactOnclikOption}
                                newMessage={newMessage}
                                navigateToConversation={() => {}}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ChatBox;
