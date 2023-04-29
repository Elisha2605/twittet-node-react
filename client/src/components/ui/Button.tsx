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
    value: any;
    type: ButtonType;
    size: ButtonSize;
    loading?: Boolean;
    isDisabled?: boolean;
    className?: string;
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
    onClick: Function;
}

const Button: FC<ButtonProps> = ({
    value,
    type,
    size,
    loading = false,
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

    if (type === ButtonType.tietary && size === ButtonSize.small) {
        allStyles = styles.tietary;
    }
    if (type === ButtonType.tietary && size === ButtonSize.big) {
        allStyles = styles.tietaryBig;
    }

    return (
        <button
            className={`${className} ${allStyles} ${styles[type]} ${
                loading ? styles.loading : ''
            } ${isDisabled && styles.disabled}`}
            onClick={(e) => onClick(e, value)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            disabled={isDisabled}
        >
            {loading && <LoadingRing size={'small'} />}
            {!loading && <span>{value}</span>}
        </button>
    );
};

export default Button;
