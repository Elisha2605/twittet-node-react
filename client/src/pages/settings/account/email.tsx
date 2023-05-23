import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import styles from './email.module.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/user.context';
import Header from '../../../components/header/Header';
import HeaderTitle from '../../../components/header/HeaderTitle';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import { useForm } from 'react-hook-form';
import Button, { ButtonSize, ButtonType } from '../../../components/ui/Button';
import { editEmail, searchUserByEmail } from '../../../api/user.api';
import { validateEmail } from '../../../utils/formValidation.utils';

const Email: React.FC<{}> = () => {
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [serverError, setServerError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    // get auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setUser(user);
        };
        getAuthUser();
    }, []);

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

    const checkEmailExistence = async (email: string): Promise<boolean> => {
        try {
            const { success, emails } = await searchUserByEmail(email);

            return success && emails.length > 0;
        } catch (error) {
            console.log('Error checking email existence:', error);
            return false;
        }
    };

    const handleChangeEmail = async (e: ChangeEvent<HTMLInputElement>) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);

        if (inputEmail !== user?.email) {
            const emailExists = await checkEmailExistence(inputEmail);
            if (emailExists) {
                setServerError('Email already exists');
            } else {
                setServerError('');
            }
        } else {
            setServerError('');
        }
    };

    const handleEmailClick = (settingName: string) => {
        navigate(`/settings/${settingName}`);
    };

    const handleSubmitForm = handleSubmit(async (data: any) => {
        setLoading(true);
        if (data) {
            const { success, message, status } = await editEmail(email);

            if (status !== 200) {
                setServerError(message);
                return;
            }

            if (success) {
                handleEmailClick('account');
            }
        }
        setLoading(false);
    });

    useEffect(() => {
        setEmail(user?.email || '');
    }, [user]);
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
                        <HeaderTitle title={'Change email'} />
                    </div>
                </div>
            </Header>
            <div className={styles.main}>
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
                                validate: validateEmail,
                            })}
                            className={styles.formInput}
                            type="text"
                            id="email"
                            name="email"
                            placeholder=" "
                            value={email}
                            onChange={handleChangeEmail}
                            contentEditable={true}
                            autoComplete="off"
                        />
                        <label className={styles.formLabel} htmlFor="email">
                            Email
                        </label>
                        {errors.email && (
                            <p className={styles.errorMsg}>
                                {errors.email?.message || 'Invalid email'}
                            </p>
                        )}
                    </div>
                    <Button
                        value={'Save'}
                        type={ButtonType.primary}
                        size={ButtonSize.small}
                        isDisabled={email === user?.email ? true : false}
                        className={styles.btn}
                        onClick={() => {}}
                    />
                </form>
            </div>
        </React.Fragment>
    );
};

export default Email;
