import React, { FC, useEffect, useRef, useState } from 'react';
import MenuIcon from '../icons/MenuIcon';
import styles from './PopUpMenu.module.css';

interface MenuPopUpProps {
    id?: string;
    title?: string;
    options: string[];
    onClick: (option: string, id: string) => void;
    icons?: Record<string, React.ReactNode>;
    className?: string;
    classNameWithTitle?: string;
    isMenuIcon?: boolean;
    children?: React.ReactNode;
}

const MenuPopUp: FC<MenuPopUpProps> = ({
    id,
    title,
    options,
    onClick,
    icons,
    className,
    classNameWithTitle,
    isMenuIcon = true,
    children,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLUListElement>(null);

    const handleButtonClick = () => {
        setShowMenu(!showMenu);
    };

    const handleOptionClick = (option: string, id: string) => {
        setShowMenu(false);
        onClick(option, id);
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
                                        handleOptionClick(option, id!)
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
