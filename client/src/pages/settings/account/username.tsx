import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import styles from './username.module.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/user.context';
import Header from '../../../components/header/Header';
import HeaderTitle from '../../../components/header/HeaderTitle';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import { useForm } from 'react-hook-form';
import Button, { ButtonSize, ButtonType } from '../../../components/ui/Button';
import { editUserName, searchUserByUserName } from '../../../api/user.api';

const Username: React.FC<{}> = () => {
    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState('');


    const navigate = useNavigate();

    const [serverError, setServerError] = useState('');
    
    // get auth user
    const ctx = useContext(AuthContext);
    useEffect(() => {
        const getAuthUser = async () => {
            const { user } = ctx.getUserContext();
            setUser(user);
        };
        getAuthUser();
    }, []);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
        }
    });
    
    const checUsernameExistence = async (username: string): Promise<boolean> => {
        try {
            const { success, usernames } = await searchUserByUserName(username);

            return success && usernames.length > 0;
        } catch (error) {
            console.log('Error checking username existence:', error);
            return false;
        }
    };

    const handleChangeUsername = async (e: ChangeEvent<HTMLInputElement>) => {
        const inputUsername = e.target.value;
        setUsername(inputUsername);

        if (inputUsername !== user?.username) {
            const usernameExists = await checUsernameExistence(inputUsername);
            if (usernameExists) {
                setServerError('That username has been taken. Please choose another.');
            } else if (username.length < 5) {
                setServerError('Your username must be longer than 4 characters.');
            } else if (username.length > 15) {
                setServerError('Your username must be shorter than 15 characters.')
            } else {
                setServerError('');
            }
        } else {
            setServerError('');
        }
    };

    const handleUsernameClick = (settingName: string) => {
        navigate(`/settings/${settingName}`);
    };

    const handleSubmitForm = handleSubmit(async (data: any) => {
        if (data) {
            if (serverError || (username === user?.username)) {
                return; 
              }

            const { success, message, status } = await editUserName(username);

            if (status !== 200) {
                setServerError(message);
                return;
            }

            if (success) {
                handleUsernameClick('account');
            }
        }
    });


    useEffect(() => {
        setUsername(user?.username || '');
    }, [user])

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
                        <HeaderTitle title={'Change username'} />
                    </div>
                </div>
            </Header>
            <div className={styles.main}>
            <form className={styles.formControl} onSubmit={handleSubmitForm}>
                    {serverError.length > 0 && (
                                <p className={styles.serverErrorMsg}>{serverError}</p>
                            )} 
                        <div className={`${styles.inputWrapper} ${errors.username ? styles.inputError : ''}`}>
                            <input
                                {...register("username", { required: "username field is required." })}
                                className={styles.formInput}
                                type="text"
                                id="username"
                                name="username"
                                placeholder=" "
                                value={username}
                                onChange={handleChangeUsername}
                                contentEditable={true}
                                autoComplete="off"
                            />
                            <label className={styles.formLabel} htmlFor="username">
                                Username
                            </label>
                            {errors.username && 
                                <p className={styles.errorMsg}>{errors.username?.message}</p>
                            }   
                        </div> 
                        <Button
                            value={'Save'}
                            type={ButtonType.primary}
                            size={ButtonSize.small}
                            isDisabled={username === user?.username ? true : false}
                            className={styles.btn}
                            onClick={() => {}}
                        /> 
                </form>
            </div>
        </React.Fragment>
    );
};

export default Username;
