import React, { FC } from "react";
import styles from "./Avatar.module.css";

export enum Size {
    small = 'small',
    medium = 'medium',
    big = 'big'
}

interface AvatarProps {
    size: Size;
    path?: string | null;
    alt?: string;
    link?: string;
    className: string;
}

const Avatar: FC<AvatarProps> = ({ 
    size,
    path,
    alt,
    link,
    className
}) => {

    let allSizes = styles.small;

    if (size === Size.medium) {
        allSizes = styles.medium;
    }

    return (
        <React.Fragment>
            <div className={`${className} ${allSizes} ${styles[size]}`}>
                <img src={path ? path : undefined} alt={alt} />
            </div>
        </React.Fragment>
    )
}

export default Avatar;