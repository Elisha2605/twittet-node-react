import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import MenuIcon from '../icons/MenuIcon';
import styles from './PopUpMenu.module.css';
import useClickOutSide from '../../hooks/useClickOutSide';
import { TWEET_AUDIENCE, TWEET_MENU, TWEET_TYPE } from '../../constants/common.constants';
import { ModalContext } from '../../context/modal.context';

interface MenuPopUpProps {
    itemId?: string;
    value?: any;
    title?: string;
    options: string[];
    icons?: Record<string, React.ReactNode>;
    className?: string;
    classNameWithTitle?: string;
    classNameMenuItemList?  : string;
    isMenuIcon?: boolean;
    isDisable?: boolean;
    children?: React.ReactNode;
    onClick: (option: string, id: string, value?: any) => void;
}

const MenuPopUp: FC<MenuPopUpProps> = ({
    itemId,
    value,
    title,
    options,
    icons,
    className,
    classNameWithTitle,
    classNameMenuItemList,
    isMenuIcon = true,
    isDisable,
    children,
    onClick,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLUListElement>(null);

    const { openModal } = useContext(ModalContext);

    const handleButtonClick = () => {
        if (isDisable) {
            return;
        }
        setShowMenu(!showMenu);
    };

    const handleOnClickOptionMenu = (option: string, id: string, value?: any) => {
        setShowMenu(false);
        onClick(option, id, value);
    };

    const handleRetweetClick = (option: string, value?: any) => {
        setShowMenu(false);
        onClick(option, value);
    };

    useClickOutSide(menuRef, setShowMenu)

    const onEditTwitterCircle = (e: React.MouseEvent<HTMLDivElement>) => {
        openModal('home-edit-twitterCircle-modal');
    }

    return (
        <div className={`${styles.container}`}>
            {isMenuIcon && (
                <button className={styles.menuBtn} onClick={handleButtonClick}>
                    <MenuIcon />
                </button>
            )}
            {!isMenuIcon && (
                <div onClick={handleButtonClick}>{children}</div>
            )}
            {showMenu && (
                <>
                    <div
                        className={styles.overlay}
                        onClick={() => setShowMenu(false)}
                    />
                    <div className={className}>
                        <ul
                            className={`
                                ${styles.menuList} ${title ? 
                                    `${styles.popUpWithTitle} ${classNameWithTitle} ` : styles.popUpWithTitle}`}
                            ref={menuRef}
                        >
                            {title && <h1>{title}</h1>}
                            {options.map((option) => (
                                <li
                                    key={option}
                                    className={`${styles.menuItemList} ${classNameMenuItemList} ${
                                        icons &&
                                        icons[option] === icons['Delete']
                                            ? styles.delete
                                            : ''
                                    } ${options.includes(TWEET_AUDIENCE.twitterCircle) ? styles.test : ''}`}
                                    onClick={() => {
                                            if (option === TWEET_MENU.retweet || option === TWEET_MENU.quoteTweet) {
                                                handleRetweetClick(option, value);
                                            } else {
                                                handleOnClickOptionMenu(option, itemId!, value!);
                                            }
                                        }
                                    }
                                >
                                    {icons && icons[option]}
                                    {option}

                                    {option === TWEET_AUDIENCE.twitterCircle && (
                                        <div className={styles.editTwitterCircle}>
                                            <p><span>1</span>person</p>
                                            <div onClick={onEditTwitterCircle}>Edit</div>
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

export default MenuPopUp;
