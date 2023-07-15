// ChatBox.tsx

import React, { useContext, useEffect, useState } from 'react';
import styles from './chatBox.module.css';
import { getAllContacts } from '../../../api/contact.api';
import UserContactInfo from '../UserContactInfo';
import { contactIcon, contactOption } from '../../../data/menuOptions';
import AuthContext, { StoredContext } from '../../../context/user.context';

interface ChatBoxProps {

}

const ChatBox: React.FC<ChatBoxProps> = ({

}) => {
    const [isRolledUp, setIsRolledUp] = useState(false);
    const [contacts, setContacts] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<any>();
    
    const context = useContext(AuthContext);
    let ctx: StoredContext = context.getUserContext();

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
       
    };

    return (
        <div className={`${styles.chatBox} ${isRolledUp ? styles.rollUp : ''}`}>
            <div className={styles.chatBoxHeader} onClick={handleHeaderClick}>
                <div className={styles.chatBoxTitle}>Messages</div>
            </div>
            <div className={styles.chatBoxContent}>
                {contacts.length > 0 &&
                    contacts.map((contact: any) => (
                        <div
                            key={contact?._id}
                            className={''}
                        >
                            <UserContactInfo
                                authUser={ctx?.user}
                                contact={contact}
                                menuOptions={contactOption}
                                menuIcons={contactIcon}
                                onClickOption={contactOnclikOption}
                                newMessage={newMessage}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ChatBox;
