import React, { FC } from 'react';
import styles from './SignupForm.module.css';
import Button, { ButtonSize, ButtonType } from '../ui/Button';
import { validateFileExtension } from '../../utils/formValidation.utils';

interface SignupFormProps {
    errors: any;
    serverError: string;
    register: any;
    isLoading: boolean;

    onSubmit: React.FormEventHandler<HTMLFormElement>;
    passwordMatch: Function;
}

const SignupForm: FC<SignupFormProps> = ({
    register,
    errors,
    serverError,
    isLoading,

    onSubmit,
    passwordMatch,
}) => {
    return (
        <React.Fragment>
            <form className={styles.container} onSubmit={onSubmit}>
                {serverError.length > 0 && (
                    <p className={styles.serverErrorMsg}>{serverError}</p>
                )}
                <div className={styles.inputWrapper}>
                    <div
                        className={`${styles.inputWrapper} ${
                            errors.name ? styles.inputError : ''
                        }`}
                    >
                        <input
                           {...register('name', {
                                required: 'Name field is required',
                                maxLength: { value: 30, message: 'Name should not exceed 30 characters' }
                            })}
                            className={styles.formInput}
                            type="text"
                            id="name"
                            name="name"
                            placeholder=" "
                        />
                        <label className={styles.formLabel} htmlFor="name">
                            Name
                        </label>
                        {errors.name && (
                            <p className={styles.errorMsg}>
                                {errors.name?.message}
                            </p>
                        )}
                    </div>
                </div>
                <div
                    className={`${styles.inputWrapper} ${
                        errors.username ? styles.inputError : ''
                    }`}
                >
                    <input
                        {...register('username', {
                            required: 'Username field is required.',
                            maxLength: { value: 25, message: 'Username should not exceed 25 characters' }
                        })}
                        className={styles.formInput}
                        type="text"
                        id="username"
                        name="username"
                        placeholder=" "
                    />
                    <label className={styles.formLabel} htmlFor="username">
                        Username
                    </label>
                    {errors.username && (
                        <p className={styles.errorMsg}>
                            {errors.username?.message}
                        </p>
                    )}
                </div>
                <div
                    className={`${styles.inputWrapper} ${
                        errors.email ? styles.inputError : ''
                    }`}
                >
                    <input
                        {...register('email', {
                            required: 'Email field is required.',
                        })}
                        className={styles.formInput}
                        type="text"
                        id="email"
                        name="email"
                        placeholder=" "
                    />
                    <label className={styles.formLabel} htmlFor="email">
                        Email
                    </label>
                    {errors.email && (
                        <p className={styles.errorMsg}>
                            {errors.email?.message}
                        </p>
                    )}
                </div>
                <div
                    className={`${styles.inputWrapper} ${
                        errors.password ? styles.inputError : ''
                    }`}
                >
                    <input
                        {...register('password', {
                            required: 'Password field required',
                            minLength: {
                                value: 3,
                                message:
                                    'password must be at least 3 characters',
                            },
                        })}
                        className={styles.formInput}
                        type="password"
                        id="password"
                        name="password"
                        placeholder=" "
                    />
                    <label className={styles.formLabel} htmlFor="password">
                        Password
                    </label>
                    {errors.password && (
                        <p className={styles.errorMsg}>
                            {errors.password?.message}
                        </p>
                    )}
                </div>
                <div
                    className={`${styles.inputWrapper} ${
                        errors.passwordConfirm ? styles.inputError : ''
                    }`}
                >
                    <input
                        {...register('passwordConfirm', {
                            required: 'Confirm password field required',
                            validate: passwordMatch,
                            minLength: {
                                value: 3,
                                message:
                                    'confirm password must be at least 3 characters',
                            },
                        })}
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
                    {errors.passwordConfirm && (
                        <p className={styles.errorMsg}>
                            {errors.passwordConfirm.message ||
                                'Passwords do not match'}
                        </p>
                    )}
                </div>
                <div
                    className={`${styles.inputWrapper} ${
                        errors.avatar ? styles.inputError : ''
                    }`}
                >
                    <input
                        {...register('avatar', {
                            validate: validateFileExtension,
                        })}
                        type="file"
                        name="avatar"
                    />
                    {errors.avatar && (
                        <p className={styles.errorMsg}>
                            {errors.avatar?.message || 'Invalid file type'}
                        </p>
                    )}
                </div>
                <Button
                    value={'Signup'}
                    type={ButtonType.tietary}
                    size={ButtonSize.big}
                    onClick={() => {}}
                    isLoading={isLoading}
                />
            </form>
        </React.Fragment>
    );
};

export default SignupForm;
