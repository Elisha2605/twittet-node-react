import React, { FC } from "react";
import styles from "./Button.module.css";

export enum ButtonType {
    primary = 'primary',
    secondary = 'secondary',
    tietary = 'tietary'
}

export enum ButtonSize {
    big = 'big',
    medium = 'medium',
    small = 'small',
}

interface ButtonProps {
    value: any;
    type: ButtonType;
    size: ButtonSize;
    loading?: Boolean;
    className?: string;
    onClick: Function;
}

const Button: FC<ButtonProps> = ({ 
    value,
    type,
    size,
    loading = false,
    className,
    onClick
}) => {

    let allStyles = styles.primary;
    
    if (type === ButtonType.primary && size === ButtonSize.small ) {
        allStyles = styles.primarySmall
    }

    if (type === ButtonType.primary && size === ButtonSize.medium ) {
        allStyles = styles.primaryMedium
    }

    if (type === ButtonType.secondary && size === ButtonSize.small) {
        allStyles = styles.secondarySmall
    }

    if (type === ButtonType.tietary && size === ButtonSize.small) {
        allStyles = styles.tietary
    }
    if (type === ButtonType.tietary && size === ButtonSize.big) {
        allStyles = styles.tietaryBig
    }
    

    return (
        <button className={`${className} ${allStyles} ${styles[type]} ${loading ? styles.loading : ''}`}
            onClick={(e) => onClick(e, value)}
        >
            {value}
        </button>
    )
}

export default Button;