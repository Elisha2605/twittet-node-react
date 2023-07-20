import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import MenuIcon from '../icons/MenuIcon';
import styles from './PopUpMenu.module.css';
import useClickOutSide from '../../hooks/useClickOutSide';
import { TWEET_AUDIENCE, TWEET_MENU } from '../../constants/common.constants';
import { ModalContext } from '../../context/modal.context';
import AuthContext from '../../context/user.context';

interface MenuPopUpProps {
    itemId?: string;
    value?: any;
    title?: string;
    options: string[];
    icons?: Record<string, React.ReactNode>;
    className?: string;
    classNameContainer?: string;
    classNameWithTitle?: string;
    classNameMenuItemList?: string;
    classNamePopUpBox?: string;
    classNameMenuIcon?: any;
    isMenuIcon?: boolean;
    isDisable?: boolean;
    children?: React.ReactNode;
    isOnClickWithEvent?: boolean;
    onClickWithEvent?: (event: React.MouseEvent, option: string, id: string, value?: any) => void;
    onClick?: (option: string, id: string, value?: any) => void;
}

const PopUpMenu: FC<MenuPopUpProps> = ({
    itemId,
    value,
    title,
    options,
    icons,
    className,
    classNameContainer,
    classNameWithTitle,
    classNameMenuItemList,
    classNameMenuIcon,
    classNamePopUpBox,
    isMenuIcon = true,
    isDisable,
    children,
    isOnClickWithEvent,
    onClick,
    onClickWithEvent,
}) => {
    const [authUser, setAuthUser] = useState<any>(null);
    const [showMenu, setShowMenu] = useState(false);

    const menuRef = useRef<HTMLUListElement>(null);

    const { openModal } = useContext(ModalContext);

    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setAuthUser(user);
        };
        getAuthUser();
    }, []);

    const contextStr = localStorage.getItem('context');
    useEffect(() => {
        if (contextStr) {
            const context = JSON.parse(contextStr);
            const user = context?.user;
            setAuthUser((prevUser: any) => ({ ...prevUser, ...user }));
        }
    }, [contextStr]);

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDisable) {
            return;
        }
        setShowMenu(!showMenu);
    };

    const handleOnClickOptionMenu = (
        option: string,
        id: string,
        value?: any
    ) => {
        setShowMenu(false);
        onClick!(option, id, value);
    };

    const handleRetweetClick = (option: string, value?: any) => {
        setShowMenu(false);
        onClick!(option, value);
    };

    const HandleOnClickWithEvent = (event: React.MouseEvent, option: string, id: string, value?: any) => {
        setShowMenu(false);
        onClickWithEvent!(event, option, id, value);
    };

    useClickOutSide(menuRef, setShowMenu);

    const onEditTwitterCircle = (e: React.MouseEvent<HTMLDivElement>) => {
        openModal('home-edit-twitterCircle-modal');
    };

    return (
        <div className={`${styles.container} ${classNameContainer}`}>
            {isMenuIcon && (
                <button className={`${styles.menuBtn} ${classNameMenuIcon}`} onClick={handleButtonClick}>
                    <MenuIcon />
                </button>
            )}
            {!isMenuIcon && <div onClick={handleButtonClick}>{children}</div>}
            {showMenu && (
                <>
                    <div
                        className={styles.overlay}
                        onClick={() => setShowMenu(false)}
                    />
                    <div className={className}>
                        <ul
                            className={`
                                ${styles.menuList} ${classNamePopUpBox} ${
                                title
                                    ? `${styles.popUpWithTitle} ${classNameWithTitle} `
                                    : styles.popUpWithTitle
                            }`}
                            ref={menuRef}
                        >
                            {title && <h1>{title}</h1>}
                            {options.map((option) => (
                                <li
                                    key={option}
                                    className={`${
                                        styles.menuItemList
                                    } ${classNameMenuItemList} ${
                                        icons &&
                                        icons[option] === icons['Delete']
                                            ? styles.delete
                                            : ''
                                    } ${
                                        options.includes(
                                            TWEET_AUDIENCE.twitterCircle
                                        )
                                            ? styles.test
                                            : ''
                                    }`}
                                    onClick={(event: React.MouseEvent) => {
                                        if (
                                            option === TWEET_MENU.retweet || option === TWEET_MENU.undoRetweet ||
                                            option === TWEET_MENU.quoteTweet
                                        ) {
                                            handleRetweetClick(option, value);
                                        } else if (isOnClickWithEvent) {
                                            HandleOnClickWithEvent(
                                                event,
                                                option,
                                                itemId!,
                                                value,
                                            )
                                        }else {
                                            handleOnClickOptionMenu(
                                                option,
                                                itemId!,
                                                value!
                                            );
                                        }
                                    }}
                                >
                                    {icons && icons[option]}
                                    {option}

                                    {option ===
                                        TWEET_AUDIENCE.twitterCircle && (
                                        <div
                                            className={styles.editTwitterCircle}
                                        >
                                            <p>
                                                <span>
                                                    {
                                                        authUser?.twitterCircleCount
                                                    }
                                                </span>
                                                {authUser?.tweetAudience === 1
                                                    ? 'person'
                                                    : 'persons'}
                                            </p>
                                            <div onClick={onEditTwitterCircle}>
                                                Edit
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default PopUpMenu;
