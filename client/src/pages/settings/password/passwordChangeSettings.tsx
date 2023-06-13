import React, { useState } from 'react';
import styles from './passwordChangeSettings.module.css';
import Header from '../../../components/header/Header';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import HeaderTitle from '../../../components/header/HeaderTitle';
import { useNavigate } from 'react-router-dom';
import Button, { ButtonSize, ButtonType } from '../../../components/ui/Button';
import { useForm } from 'react-hook-form';
import { requestPasswordReset } from '../../../api/passwordReset.api';

const PasswordChangeSettings: React.FC<{}> = ({}) => {
    const [email, setName] = useState('');
    const [serverError, setServerError] = useState('');

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
        },
    });


    const onNavigateToVerification = (settingName: string) => {
        navigate(`/settings/${settingName}`);
    };

    const handleSubmitForm = handleSubmit(async (data: any) => {
        if (data) {
            const { message, status, success } = await requestPasswordReset(
                data.email
            );
            if (status !== 200) {
                setServerError(message);
                return;
            }
            if (success) {
                onNavigateToVerification('verification');
            }
        }
    });

    return (
        <React.Fragment>
            <Header>
                <div className={styles.headerContainerRight}>
                    <div className={styles.headerWrapper}>
                        <ArrowLeftIcon
                            onClick={() => {
                                navigate(-1);
                            }}
                        />
                        <HeaderTitle title={'Change password'} />
                    </div>
                </div>
            </Header>
            <div className={styles.main}>
                <p className={styles.message}>
                    Enter the email associated with your account to change your
                    password.
                </p>
                <form
                    className={styles.formControl}
                    onSubmit={handleSubmitForm}
                >
                    {serverError.length > 0 && (
                        <p className={styles.serverErrorMsg}>{serverError}</p>
                    )}
                    <div
                        className={`${styles.inputWrapper} ${
                            errors.email ? styles.inputError : ''
                        }`}
                    >
                        <input
                            {...register('email', {
                                required: 'Email field is required.',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            className={styles.formInput}
                            type="text"
                            id="email"
                            name="email"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setName(e.target.value)}
                            contentEditable={true}
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
                    <Button
                        value={'Next'}
                        type={ButtonType.primary}
                        size={ButtonSize.small}
                        isDisabled={email.length === 0}
                        className={styles.btn}
                        onClick={() => {}}
                    />
                </form>
            </div>
        </React.Fragment>
    );
};

export default PasswordChangeSettings;
