import React, { FC, useEffect, useRef, useState } from 'react';
import MenuIcon from '../icons/MenuIcon';
import styles from './PopUpMenu.module.css';

interface MenuPopUpProps {
    options: string[];
    onClick: (option: string) => void;
    icons?: Record<string,React.ReactNode>;
}

const MenuPopUp: FC<MenuPopUpProps> = ({ options, onClick, icons }) => {
    
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLUListElement>(null);

    const handleButtonClick = () => {
        setShowMenu(!showMenu);
    };

    const handleOptionClick = (option: string) => {
        setShowMenu(false);
        onClick(option);
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
            <button className={styles.menuBtn} onClick={handleButtonClick}>
                <MenuIcon />
            </button>
            {showMenu && (
                <>
                    <div
                        className={styles.overlay}
                        onClick={() => setShowMenu(false)}
                    />
                    <ul className={styles.menuList} ref={menuRef}>
                        {options.map((option) => (
                            <li
                                key={option}
                                className={`${styles.menuItemList} ${icons && icons[option] === icons['Delete'] ? styles.delete : ''}`}
                                onClick={() => handleOptionClick(option)}
                            >
                                    {icons && icons[option]}
                                    {option}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default MenuPopUp;
