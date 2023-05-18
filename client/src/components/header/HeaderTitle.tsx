import React, { FC } from "react";
import styles from "./HeaderTitle.module.css";
import faLockSolid from "../../assets/faLock-solid.svg"

interface HeaderTitleProps {
    title: string | undefined;
    subTitle?: string | number | undefined;
    className?: string;
    isProtected?: string;
}

const HeaderTitle: FC<HeaderTitleProps> = ({ 
    title,
    subTitle,
    className,
    isProtected,
}) => {

    return (
        <React.Fragment>
            {subTitle ? (
                <div className={`${styles.container} ${className}`}>
                    {!isProtected ? (
                        <p className={styles.title}>{title}</p>
                    ): (
                        <div className={styles.isProtectedTitle}>
                            <p className={styles.title}>{title}</p>
                            <img src={faLockSolid} alt="" />
                        </div>
                    )}
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

