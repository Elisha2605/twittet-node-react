import React, { FC } from "react";
import styles from "./HorizontalNavBar.module.css";

interface HorizontalNavBarProps {
    className?: string;
    children: React.ReactNode;
}

const HorizontalNavBar: FC<HorizontalNavBarProps> = ({ 
     className,
     children
}) => {

    return (
        <React.Fragment>
            <div className={`${styles.container} ${className}`}>
                {children}
            </div>
        </React.Fragment>
    )
}

export default HorizontalNavBar;

