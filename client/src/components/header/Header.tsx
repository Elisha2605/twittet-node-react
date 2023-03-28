import React, { FC } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
    title?: string;
    children?: React.ReactNode;
    border?: boolean;
}

const Header: FC<HeaderProps> = ({ title, children, border, ...attributes }) => {
    return (
        <React.Fragment>
            <div className={`${styles.container} ${border ? styles.border : ''}`}>
                <h2 className={styles.title}>{title}</h2>
                <div {...attributes}>
                    {children}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Header;
