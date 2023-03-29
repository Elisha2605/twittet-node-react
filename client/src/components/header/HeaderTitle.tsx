import React, { FC } from "react";
import styles from "./HeaderTitle.module.css";

interface HeaderTitleProps {
    title: string | undefined;
    subTitle?: string | undefined;
    className?: string;
}

const HeaderTitle: FC<HeaderTitleProps> = ({ 
    title,
    subTitle,
    className
}) => {

    return (
        <React.Fragment>
            {subTitle ? (
                <div className={`${styles.container} ${className}`}>
                    <p className={styles.title}>{title}</p>
                    <p className={styles.subtitle}>{subTitle}</p>
                </div>
            ): (
                <div className={`${styles.container} ${className}`}>
                    <p className={styles.title}>{title}</p>
                </div>
            )}
        </React.Fragment>
    )
}

export default HeaderTitle;

