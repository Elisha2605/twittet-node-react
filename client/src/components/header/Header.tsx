import React, { FC } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
    title: string;
    children: React.ReactNode;
}

const Header: FC<HeaderProps> = ({ title, children, ...attributes }) => {
    return (
        <React.Fragment>
            <div className={styles.container}>
                <h2>{title}</h2>
                <div {...attributes}>
                    {children}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Header;
