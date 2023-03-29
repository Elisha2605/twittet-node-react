import React, { FC } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
    children?: React.ReactNode;
    border?: boolean;
    clasName?: string;
}

const Header: FC<HeaderProps> = ({ children, border, clasName, ...attributes }) => {
    return (
        <React.Fragment>
            <div className={`${styles.container} ${border ? styles.border : ''} ${clasName} `}>
                <div {...attributes}>
                    {children}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Header;
