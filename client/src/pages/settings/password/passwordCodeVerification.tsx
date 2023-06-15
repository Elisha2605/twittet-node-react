import React, { useState } from 'react';
import styles from './passwordCodeVerification.module.css';
import Header from '../../../components/header/Header';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import HeaderTitle from '../../../components/header/HeaderTitle';
import { useNavigate } from 'react-router-dom';
import Button, { ButtonSize, ButtonType } from '../../../components/ui/Button';
import { useForm } from 'react-hook-form';
import { verifyPasswordVerificationToken } from '../../../api/passwordReset.api';

const PassworConfirmation: React.FC<{}> = ({}) => {
    const [email, setName] = useState('');
    const [serverError, setServerError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            token: '',
        },
    });

    const handleNavigate = (settingName: string) => {
        navigate(`/settings/${settingName}`);
    };

    const handleSubmitForm = handleSubmit(async (data: any) => {
        setLoading(true);
        if (data) {
            const { success, status, message, token } = await verifyPasswordVerificationToken(data.token);
            if (status !== 200) {
                setServerError(message);
            } else if (success) {
                localStorage.setItem('resetToken', token);
                handleNavigate('password-reset');
            }
        }
        setLoading(false);
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
                            <HeaderTitle title={'We sent you a code'} />
                        </div>
                    </div>
                    <p className={styles.message}>
                        Check your email to get your verification code.
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
                                errors.token ? styles.inputError : ''
                            }`}
                        >
                            <input
                                {...register('token', {
                                    required:
                                        'Code verification field is required.',
                                    validate: (value) =>
                                        value.length === 8 ||
                                        'Invalid verification code',
                                })}
                                className={styles.formInput}
                                type="text"
                                id="token"
                                name="token"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setName(e.target.value)}
                                contentEditable={true}
                            />
                            <label className={styles.formLabel} htmlFor="token">
                                Enter your code
                            </label>
                            {errors.token && (
                                <p className={styles.errorMsg}>
                                    {errors.token?.message}
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
                            loading={isLoading}
                        />
                    </form>
                </Header>
            </div>
        </React.Fragment>
    );
};

export default PassworConfirmation;
