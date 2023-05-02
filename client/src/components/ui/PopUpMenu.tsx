import React, { FC, useEffect, useRef, useState } from 'react';
import MenuIcon from '../icons/MenuIcon';
import styles from './PopUpMenu.module.css';

interface MenuPopUpProps {
    itemId?: string;
    value?: any;
    title?: string;
    options: string[];
    icons?: Record<string, React.ReactNode>;
    className?: string;
    classNameWithTitle?: string;
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
    isMenuIcon = true,
    isDisable,
    children,
    onClick,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLUListElement>(null);

    const handleButtonClick = () => {
        if (isDisable) {
            return;
        }
        setShowMenu(!showMenu);
    };

    const handleOptionClick = (option: string, id: string, value?: any) => {
        setShowMenu(false);
        onClick(option, id, value);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className={styles.container}>
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
                            className={`${styles.menuList} ${title && `${styles.popUpWithTitle} ${classNameWithTitle}`}`}
                            ref={menuRef}
                        >
                            {title && <h1>{title}</h1>}
                            {options.map((option) => (
                                <li
                                    key={option}
                                    className={`${styles.menuItemList} ${
                                        icons &&
                                        icons[option] === icons['Delete']
                                            ? styles.delete
                                            : ''
                                    }`}
                                    onClick={() =>
                                        handleOptionClick(option, itemId!, value!)
                                    }
                                >
                                    {icons && icons[option]}
                                    {option}
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
