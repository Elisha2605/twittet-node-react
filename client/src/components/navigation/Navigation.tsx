import React, { useContext, useRef, useState } from 'react';
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
import Modal from '../ui/Modal';
import { logout } from '../../api/auth.api';
import useAuthUser from '../../hooks/userAuth.hook';
import { navUseMenuIcons, navUserMenuOptions } from '../../data/menuOptions';
import { IMAGE_AVATAR_BASE_URL } from '../../constants/common.constants';
import { ModalContext } from '../../context/modal.context';
import NavigationTweet from './NavigationTweet';

interface Navigation {
    onAddTweet: (tweet: any) => void;
}

const Navigation: React.FC<Navigation> = ({ onAddTweet }) => {

    const { openModal, closeModal } = useContext(ModalContext);

    // Get auth user
    const authUser: any = useAuthUser();

    // logout
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
                        path="/profile"
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
                <Modal
                    modalName={'Nav-tweet'}
                    isOverlay={true}
                    className={styles.modal}
                >
                    <NavigationTweet onAddTweet={onAddTweet} />
                </Modal>
                <NavigationUserInfo
                    id={authUser?.id}
                    menuOptions={navUserMenuOptions}
                    menuIcons={navUseMenuIcons}
                    onClickOption={handleMenuOptionClick}
                    avatar={authUser?.avatar && `${IMAGE_AVATAR_BASE_URL}/${authUser?.avatar}`}
                    name={authUser?.name}
                    username={authUser?.username}
                />
            </div>
        </React.Fragment>
    );
};

export default Navigation;
