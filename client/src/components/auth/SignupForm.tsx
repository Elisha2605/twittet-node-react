import React, { FC } from 'react';
import styles from './SignupForm.module.css';
import Button, { ButtonSize, ButtonType } from '../ui/Button';

interface SignupFormProps {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const SignupForm: FC<SignupFormProps> = ({
    name,
    email,
    password,
    confirmPassword,
}) => {
    return (
        <React.Fragment>
            <form className={styles.container}>
                <div className={styles.inputWrapper}>
                    <input
                        className={styles.formInput}
                        type="text"
                        id="name"
                        name="name"
                        placeholder=" "
                    />
                    <label className={styles.formLabel} htmlFor="name">
                        Name
                    </label>
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        className={styles.formInput}
                        type="text"
                        id="email"
                        name="email"
                        placeholder=" "
                    />
                    <label className={styles.formLabel} htmlFor="email">
                        Email
                    </label>
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        className={styles.formInput}
                        type="password"
                        id="password"
                        name="password"
                        placeholder=" "
                    />
                    <label className={styles.formLabel} htmlFor="password">
                        Password
                    </label>
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        className={styles.formInput}
                        type="password"
                        id="passwordConfirm"
                        name="passwordConfirm"
                        placeholder=" "
                    />
                    <label
                        className={styles.formLabel}
                        htmlFor="passwordConfirm"
                    >
                        Confirm password
                    </label>
                </div>
                <Button
                    value={'Signup'}
                    type={ButtonType.tietary}
                    size={ButtonSize.big}
                    onClick={() => {}}
                />
            </form>
        </React.Fragment>
    );
};

export default SignupForm;
