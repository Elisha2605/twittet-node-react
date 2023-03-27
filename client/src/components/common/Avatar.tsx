import React, { FC } from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
    size: string;
    path: string;
    alt?: string;
    link?: string;
}

const Avatar: FC<AvatarProps> = ({ 
    size,
    path,
    alt,
    link
}) => {

    return (
        <React.Fragment>
            <div className={styles.container}>
                <img src={path} alt={alt} />
            </div>
        </React.Fragment>
    )
}

export default Avatar;