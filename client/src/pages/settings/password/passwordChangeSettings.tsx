import React, { useContext, useEffect, useState } from 'react';
import styles from './passwordChangeSettings.module.css';
import Header from '../../../components/header/Header';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import HeaderTitle from '../../../components/header/HeaderTitle';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/user.context';
import Button, { ButtonSize, ButtonType } from '../../../components/ui/Button';
import { useForm } from 'react-hook-form';
import { requestPasswordReset } from '../../../api/passwordReset.api';

const PasswordChangeSettings: React.FC<{ }> = ({ }) => {
    const [user, setUser] = useState<any>(null);
    const [email, setName] = useState('');
    const [serverError, setServerError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
        },
    });

    // get auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setUser(user);
        };
        getAuthUser();
    }, []);

    const handleEmailClick = (settingName: string) => {
        navigate(`/settings/${settingName}`);
    };

    const handleSubmitForm = handleSubmit(async (data: any) => {
        setLoading(true);
        if (data) {
            const { message, status, success } = await requestPasswordReset(data.email);
            if (status !== 200) {
                setServerError(message)
                return;
            }
            if (success) {
                handleEmailClick('verification')
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
                            <HeaderTitle title={'Change password'} />
                        </div>
                    </div>
                    <p className={styles.message}>
                        Enter the email associated with your account to change
                        your password.
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
                </Header>
            </div>
        </React.Fragment>
    );
};

export default PasswordChangeSettings;
