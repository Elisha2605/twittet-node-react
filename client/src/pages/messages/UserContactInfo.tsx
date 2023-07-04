import React from 'react';
import styles from './UserContactInfo.module.css';
import {
    IMAGE_AVATAR_BASE_URL,
    IMAGE_AVATAR_DEFAULT,
} from '../../constants/common.constants';
import PopUpMenu from '../../components/ui/PopUpMenu';

interface UserContactInfoProps {
    contact: any;
    menuOptions?: string[];
    menuIcons?: Record<string, React.ReactNode>;
    onClickOption?: Function;
}

const UserContactInfo: React.FC<UserContactInfoProps> = ({
    contact,
    menuOptions,
    menuIcons,
    onClickOption,
}) => {
    return (
        <div className={styles.contactsContainer}>
            <div className={styles.contactWrapper}>
                <div className={styles.avatar}>
                    <img
                        src={
                            contact?.avatar
                                ? `${IMAGE_AVATAR_BASE_URL}/${contact?.avatar}`
                                : `${IMAGE_AVATAR_BASE_URL}/${IMAGE_AVATAR_DEFAULT}`
                        }
                        alt=""
                    />
                </div>
                <div className={styles.contactInfoWrapper}>
                    <div className={styles.contactInfo}>
                        <p className={styles.contactName}>{contact?.name}</p>
                        <p className={styles.contactUserName}>
                            @{contact?.username}
                        </p>{' '}
                        {'·'}
                        <p className={styles.contactLastMsgTime}>{'1m'}</p>

                        <div className={styles.menuIcon}>
                            <PopUpMenu 
                                itemId={contact?._id}
                                options={menuOptions!}
                                icons={menuIcons!}
                                onClick={(menuOptions, id) => 
                                    onClickOption!(menuOptions, id)
                                }
                                className={styles.menuOption}
                            />
                        </div>
                    </div>
                    <div className={styles.lastMessage}>hello</div>
                </div>
            </div>
        </div>
    );
};

export default UserContactInfo;
