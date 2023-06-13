import React, { useState } from 'react';
import styles from './passwordReset.module.css';
import Header from '../../../components/header/Header';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import HeaderTitle from '../../../components/header/HeaderTitle';
import { useNavigate } from 'react-router-dom';
import Button, { ButtonSize, ButtonType } from '../../../components/ui/Button';
import { useForm } from 'react-hook-form';
import { resetPassword } from '../../../api/passwordReset.api';
import { logout } from '../../../api/auth.api';

const PasswordReset: React.FC<{}> = ({}) => {

    const [serverError, setServerError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            password: '',
            passwordConfirm: '',
        },
    });

    // Check passwords match
    const passwordMatch = () => {
        const { password, passwordConfirm } = getValues();
        return password === passwordConfirm || 'Passwords do not match';
    };

    const token = localStorage.getItem('resetToken');

    const handleSubmitForm = handleSubmit(async (data: any) => {
        setLoading(true);
        if (data) {

        const { success, status, message } = await resetPassword(data.password, token as string) 
        setLoading(false);
        
        if (status !== 200) {
            setServerError(message)
            return;
        }

        if (success) {
            await logout();
        }
        }
    });

    return (
        <React.Fragment>
            <div className={styles.main}>
                <Header>
                    <div className={styles.headerContainerRight}>
                        <div className={styles.headerWrapper}>
                            <ArrowLeftIcon
                                onClick={() => {
                                    navigate(-1);
                                }}
                            />
                            <HeaderTitle title={'Choose a new password'} />
                        </div>
                    </div>
                    <p className={styles.message}>
                        Make sure your new password is 8 characters or more. Try
                        including numbers, letter and punctuation marks for a
                        strong password.
                    </p>

                    <p className={styles.message}>
                        You'll be logged out of your account after your password
                        is changed.
                    </p>

                    <form
                        className={styles.formControl}
                        onSubmit={handleSubmitForm}
                    >
                        {serverError.length > 0 && (
                            <p className={styles.serverErrorMsg}>
                                {serverError}
                            </p>
                        )}

                        <div
                            className={`${styles.inputWrapper} ${
                                errors.password ? styles.inputError : ''
                            }`}
                        >
                            <input
                                {...register('password', {
                                    required: 'Password field required',
                                    minLength: {
                                        value: 1,
                                        message:
                                            'password must be at least 4 characters',
                                    },
                                })}
                                className={styles.formInput}
                                type="password"
                                id="password"
                                name="password"
                                placeholder=" "
                            />
                            <label
                                className={styles.formLabel}
                                htmlFor="password"
                            >
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
                                        value: 1,
                                        message:
                                            'confirm password must be at least 4 characters',
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

                        <Button
                            value={'Change password'}
                            type={ButtonType.secondary}
                            size={ButtonSize.big}
                            className={styles.btn}
                            onClick={() => {}}
                            loading={isLoading}
                        />
                    </form>
                </Header>
            </div>
        </React.Fragment>
    );
};

export default PasswordReset;
