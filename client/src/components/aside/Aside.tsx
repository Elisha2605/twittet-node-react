import React, { FC } from "react";
import styles from "./Aside.module.css";

interface AsideProps {
    className: string;
    children: React.ReactNode;
}

const Aside: FC<AsideProps> = ({ className, children }) => {
    
    return (
        <React.Fragment>
            <div className={`${className} ${styles.container}`}>
                {children}
            </div>
        </React.Fragment>
    )
}

export default Aside;