import React, { useContext, useEffect, useState } from 'react';
import { faHashtag, faHome } from '@fortawesome/free-solid-svg-icons';
import {
    faBell,
    faBookmark,
    faEnvelope,
    faUser,
} from '@fortawesome/free-regular-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from './Navigation.module.css';
import NavigationItem from './NavigationItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import NavigationUserInfo from './NavigationUserInfo';
import { logout } from '../../api/auth.api';
import { navUseMenuIcons, navUserMenuOptions } from '../../data/menuOptions';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import { ModalContext } from '../../context/modal.context';
import NavigationTweet from './NavigationTweet';
import AuthContext from '../../context/user.context';

interface NavigationProps {
    value: string;
    
    selectedFile: File | null
    previewImage: string | null
    
    clearTweetForm: () => void;

    handleTextAreaOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleCanselPreviewImage: () => void;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAddTweet: (tweet: any) => void;

    editTweetModal: any;
    isEdit: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
    value,
    onAddTweet, 
    
    selectedFile,
    previewImage,

    clearTweetForm,
    
    handleTextAreaOnChange,
    handleCanselPreviewImage,
    handleImageUpload, 
    
    editTweetModal,
    isEdit,
}) => {

    const [authUser, setAuthUser] = useState<any>(null);

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        }
        getAuthUser();
    }, []);

    const { openModal } = useContext(ModalContext);


    // Logout
    const handleMenuOptionClick = async (options: string) => {
        if (options === 'Logout') {
            await logout();
        }
    }

    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <FontAwesomeIcon
                        icon={faTwitter}
                        color={'var(--color-primary)'}
                        size={'2xl'}
                    />
                </div>
                <div className={styles.naviItems}>
                    <NavigationItem icon={faHome} label={'Home'} path="/" />
                    <NavigationItem
                        icon={faHashtag}
                        label={'Explore'}
                        path="/explore"
                    />
                    <NavigationItem
                        icon={faBell}
                        label={'Notifications'}
                        path="/notification"
                    />
                    <NavigationItem
                        icon={faEnvelope}
                        label={'Message'}
                        path="/message"
                    />
                    <NavigationItem
                        icon={faBookmark}
                        label={'Bookmarks'}
                        path="/bookmarks"
                        className={styles.bookmarks}
                    />
                    <NavigationItem
                        icon={faUser}
                        label={'Profile'}
                        path={`/profile/${authUser?._id}`}
                    />
                    <NavigationItem
                        icon={faEllipsisH}
                        label={'More'}
                        path="#"
                        className={styles.ellipsis}
                    />
                </div>
                <Button
                    value={'Tweet'}
                    type={ButtonType.primary}
                    size={ButtonSize.medium}
                    onClick={() => openModal('Nav-tweet')}
                />
               
                <NavigationUserInfo
                    id={authUser?.id}
                    menuOptions={navUserMenuOptions}
                    menuIcons={navUseMenuIcons}
                    onClickOption={handleMenuOptionClick}
                    avatar={authUser?.avatar && `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`}
                    name={authUser?.name}
                    username={authUser?.username}
                />
                {/* Opens tweet modal */}
                <NavigationTweet 
                    selectedFile={selectedFile}
                    previewImage={previewImage}                                    
                    value={value}
                    handleTextAreaOnChange={handleTextAreaOnChange}
                    handleCanselPreviewImage={handleCanselPreviewImage}
                    handleImageUpload={handleImageUpload}
                    onAddTweet={onAddTweet} 
                    clearTweetForm={clearTweetForm}

                    editTweetModal={editTweetModal}
                    isEdit={isEdit}
                />
            </div>
        </React.Fragment>
    );
};

export default Navigation;
