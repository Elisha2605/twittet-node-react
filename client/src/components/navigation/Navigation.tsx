import React, { useContext, useEffect, useRef, useState } from "react";
import { faHashtag, faHome} from "@fortawesome/free-solid-svg-icons";
import { faBell, faBookmark, faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from './Navigation.module.css';
import NavigationItem from "./NavigationItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Button, { ButtonSize, ButtonType } from "../ui/Button";
import NavigationUserInfo from "./NavigationUserInfo";
import Modal from "../ui/Modal";
import PageUnderConstruction from "../ui/PageUnderConstruction";
import { logout } from "../../api/auth.api";
import AuthContext from "../../context/user.context";

const Navigation = () => {
    const [modalOpen, setMadalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const modalRef = useRef<HTMLDivElement>(null);

    

    useEffect(() => {
        document.addEventListener('mousedown', hadleClikOUtside );
        return () => {
            document.removeEventListener('mousedown', hadleClikOUtside);
        };
    }, [modalRef])

    const hadleClikOUtside = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setMadalOpen(false);
        }
    }

    const handleOpenModal = () => {
        setMadalOpen(true);
    };
    
    // temp
    const onLogout = async (e: React.MouseEvent) => {
        await logout();
    }

    // Auth user info
    const { me } = useContext(AuthContext);
    useEffect(() => {
        if (me) {
            me().then((user) => setUser(user))
        }
    }, [me]);
    if (!user) {
        return null;
    };
    const { email } = user;


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
                    <NavigationItem
                        icon={faHome} 
                        label={"Home"} 
                        path='/' 
                    />
                    <NavigationItem
                        icon={faHashtag} 
                        label={"Explore"} 
                        path='/explore' 
                    />
                    <NavigationItem
                        icon={faBell} 
                        label={"Notifications"} 
                        path='/notification' 
                    />
                    <NavigationItem
                        icon={faEnvelope} 
                        label={"Message"} 
                        path='/message' 
                    />
                    <NavigationItem
                        icon={faBookmark} 
                        label={"Bookmarks"} 
                        path='/bookmarks'
                        className={styles.bookmarks} 
                    />
                    <NavigationItem
                        icon={faUser} 
                        label={"Profile"} 
                        path='/profile' 
                    />
                    <NavigationItem
                        icon={faEllipsisH} 
                        label={"More"} 
                        path='#' 
                        className={styles.ellipsis}
                    />
                </div>
                <Button value={'Tweet'} type={ButtonType.primary} size={ButtonSize.medium} onClick={handleOpenModal} />
                <Modal 
                    modalRef={modalRef}
                    isOpen={modalOpen} 
                    onClose={() => setMadalOpen(false)} 
                    isOverlay={true} 
                    >
                        <PageUnderConstruction />
                        <button onClick={() => setMadalOpen(false)}>Close Modal</button>
                </Modal>
                <button onClick={(e) => onLogout(e)}>logout</button>
                <NavigationUserInfo 
                    avatar={"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"} 
                    firstName={email} 
                    username={"alvin40900"}
                />
            </div>
        </React.Fragment>
    )
}

export default Navigation;