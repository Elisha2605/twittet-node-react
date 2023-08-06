import React, { FC, useContext, useEffect, useState } from 'react';
import styles from './ContactModal.module.css';

import Modal from '../../../components/ui/Modal';
import XmarkIcon from '../../../components/icons/XmarkIcon';
import { ModalContext } from '../../../context/modal.context';
import SearchBar from '../../../components/ui/SearchBar';
import {
    addContact,
    getAllContacts,
    removeContact,
} from '../../../api/contact.api';
import AuthContext, { StoredContext } from '../../../context/user.context';
import { contactIcon, contactOption } from '../../../data/menuOptions';
import { CONTACT_OPTION } from '../../../constants/common.constants';
import { useMessage } from '../../../context/successMessage.context';
import ChatBoxUserContact from './ChatBoxUserContact';


interface ContactModalProps {
    onAddContact: (contatcId: string) => void;
    onDeletContact: (contactId: string) => void;
}

const ContactModal: FC<ContactModalProps> = ({ onAddContact, onDeletContact }) => {
    const [contacts, setContacts] = useState<any[]>([]);

    const { showMessage } = useMessage();
    const { closeModal } = useContext(ModalContext);

    const context = useContext(AuthContext);
    let ctx: StoredContext = context.getUserContext();

    useEffect(() => {
        const fetchAllContacts = async () => {
            const { contacts } = await getAllContacts();
            const reversedContacts = contacts;
            setContacts(reversedContacts);
        };
        fetchAllContacts();
    }, []);

    const handleSearchClick = async (newContact: any) => {
        setContacts((prevState: any) => [newContact, ...prevState]);
        onAddContact(newContact);
        await addContact(newContact?._id);
    };

    const contactOnclikOption = async (option: any, contactId: any) => {
        if (option === CONTACT_OPTION.delete) {
            await removeContact(contactId);
            setContacts((prevState: any) =>
                prevState.filter((c: any) => c?._id !== contactId)
            );
            onDeletContact(contactId)
            showMessage('Conversation deleted', 'success');
        }
    };

    return (
        <React.Fragment>
            <Modal
                smallTitle={'New Message'}
                modalName={'contact-modal'}
                isOverlay={true}
                classNameContainer={styles.modalContainer}
                classNameWrapper={styles.modalWrapper}
                isCustomeHeader={true}
            >
                <div className={styles.headerWrapper}>
                    <div className={styles.titleAndBtnWrapper}>
                        <h5>New Message</h5>
                        <XmarkIcon size={'sm'} onClick={() => closeModal('')} />
                        {/* <Button
                            value={'Next'}
                            type={ButtonType.secondary}
                            size={ButtonSize.small}
                            onClick={() => {}}
                            className={styles.button}
                        /> */}
                    </div>
                </div>
                <div className={styles.searchBarContainer}>
                    <SearchBar
                        onUserSelected={handleSearchClick}
                        classNameInput={styles.searchBarInput}
                        classNameContainer={styles.searchBar}
                        classSearchResults={styles.searchResult}
                    />
                </div>
                <div>
                    {contacts.length > 0 &&
                        contacts.map((contact: any) => (
                            <div key={contact?._id} className={''}>
                                <ChatBoxUserContact
                                    authUser={ctx?.user}
                                    contact={contact}
                                    menuOptions={contactOption}
                                    menuIcons={contactIcon}
                                    onClickOption={contactOnclikOption}
                                />
                            </div>
                        ))}
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default ContactModal;
