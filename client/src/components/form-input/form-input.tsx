import React, { InputHTMLAttributes, FC } from "react";
import styles from "./form-input.module.css";

type FromInputProps = { label: string } & InputHTMLAttributes<HTMLInputElement>;

const FormInput: FC<FromInputProps> = ({ label, ...otherProps }) => {
    return (
        <div className={styles.group}>
            <input {...otherProps} />
            {label && (
                <div className={styles.formInputLabel}>
                    {label}
                </div>
            )}
        </div>
    )
}




export default FormInput;