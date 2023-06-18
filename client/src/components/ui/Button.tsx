import React, { FC } from 'react';
import styles from './Button.module.css';
import LoadingRing from './LoadingRing';

export enum ButtonType {
    primary = 'primary',
    secondary = 'secondary',
    tietary = 'tietary',
}

export enum ButtonSize {
    big = 'big',
    medium = 'medium',
    small = 'small',
}

interface ButtonProps {
    itemId?: string,
    value: any;
    type: ButtonType;
    size: ButtonSize;
    isLoading?: Boolean;
    isDisabled?: boolean;
    className?: string;
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
    onClick: Function;
}

const Button: FC<ButtonProps> = ({
    itemId,
    value,
    type,
    size,
    isLoading = false,
    isDisabled = false,
    className,
    onMouseEnter,
    onMouseLeave,
    onClick,
}) => {
    let allStyles = styles.primary;

    if (type === ButtonType.primary && size === ButtonSize.small) {
        allStyles = styles.primarySmall;
    }

    if (type === ButtonType.primary && size === ButtonSize.medium) {
        allStyles = styles.primaryMedium;
    }

    if (type === ButtonType.secondary && size === ButtonSize.small) {
        allStyles = styles.secondarySmall;
    }

    if (type === ButtonType.secondary && size === ButtonSize.big) {
        allStyles = styles.secondaryBig;
    }

    if (type === ButtonType.tietary && size === ButtonSize.small) {
        allStyles = styles.tietary;
    }
    if (type === ButtonType.tietary && size === ButtonSize.big) {
        allStyles = styles.tietaryBig;
    }

    return (
        <button
            className={`${className} ${allStyles} ${styles[type]} ${
                isLoading ? styles.loading : ''
            } ${isDisabled && styles.disabled}`}
            onClick={(e) => onClick(e, itemId)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            disabled={isDisabled}
        >
            {isLoading && <LoadingRing size={'small'} />}
            {!isLoading && <span>{value}</span>}
        </button>
    );
};

export default Button;
